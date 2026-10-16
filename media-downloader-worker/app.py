import os
import re
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import Any

import requests
from fastapi import FastAPI, Header, HTTPException

app = FastAPI(title="SBPF Media Download Worker", version="1.0.0")

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
WORKER_TOKEN = os.environ.get("WORKER_TOKEN", "")
BUCKET = os.environ.get("SUPABASE_STORAGE_BUCKET", "swarnim-video-exports")
MAX_BYTES = int(os.environ.get("MAX_DOWNLOAD_BYTES", str(50 * 1024 * 1024)))
TIMEOUT_SECONDS = int(os.environ.get("DOWNLOAD_TIMEOUT_SECONDS", "900"))


def configured() -> bool:
    return bool(SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY and WORKER_TOKEN)


def headers(extra: dict[str, str] | None = None) -> dict[str, str]:
    result = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
    }
    if extra:
        result.update(extra)
    return result


def db_get(path: str, params: dict[str, str]) -> Any:
    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/{path}",
        headers=headers({"Accept": "application/json"}),
        params=params,
        timeout=30,
    )
    response.raise_for_status()
    return response.json()


def db_patch(path: str, params: dict[str, str], body: dict[str, Any]) -> None:
    response = requests.patch(
        f"{SUPABASE_URL}/rest/v1/{path}",
        headers=headers({"Content-Type": "application/json", "Prefer": "return=minimal"}),
        params=params,
        json=body,
        timeout=30,
    )
    response.raise_for_status()


def upload_file(local_path: Path, storage_path: str, mime_type: str) -> None:
    if local_path.stat().st_size > MAX_BYTES:
        raise RuntimeError(f"File exceeds configured limit ({MAX_BYTES} bytes).")
    with local_path.open("rb") as file_handle:
        response = requests.post(
            f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{storage_path}",
            headers=headers({"Content-Type": mime_type, "x-upsert": "true"}),
            data=file_handle,
            timeout=120,
        )
    response.raise_for_status()


def safe_filename(value: str) -> str:
    value = re.sub(r"[^A-Za-z0-9._-]+", "-", value).strip(".-")
    return (value or "media")[:100]


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "ok": True,
        "configured": configured(),
        "processor": "yt-dlp + FFmpeg",
        "max_download_bytes": MAX_BYTES,
    }


@app.post("/process/{job_id}")
def process_job(job_id: str, x_worker_token: str | None = Header(default=None)) -> dict[str, Any]:
    if not configured():
        raise HTTPException(status_code=503, detail="Worker environment is not configured.")
    if not x_worker_token or x_worker_token != WORKER_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid worker token.")
    if not re.fullmatch(r"[0-9a-fA-F-]{36}", job_id):
        raise HTTPException(status_code=400, detail="Invalid job id.")

    try:
        rows = db_get(
            "media_download_jobs",
            {
                "id": f"eq.{job_id}",
                "select": "id,user_id,source_url,media_type,quality,status,rights_confirmed",
                "limit": "1",
            },
        )
    except requests.RequestException:
        raise HTTPException(status_code=502, detail="Could not read job from Supabase.")

    if not rows:
        raise HTTPException(status_code=404, detail="Job not found.")
    job = rows[0]
    if job.get("rights_confirmed") is not True:
        raise HTTPException(status_code=403, detail="Rights confirmation is required.")
    if job.get("status") in ("completed", "processing"):
        raise HTTPException(status_code=409, detail=f"Job is already {job['status']}.")
    if job.get("media_type") not in ("video", "audio", "both"):
        raise HTTPException(status_code=400, detail="Unsupported media type.")

    # Only accept standard web URLs; do not allow local/private-network targets.
    source_url = job.get("source_url", "")
    if not source_url.startswith(("https://", "http://")):
        raise HTTPException(status_code=400, detail="Only HTTP(S) source URLs are accepted.")

    db_patch(
        "media_download_jobs",
        {"id": f"eq.{job_id}"},
        {"status": "processing", "error_message": None},
    )

    with tempfile.TemporaryDirectory(prefix="sbpf-media-") as tmp:
        root = Path(tmp)
        output_template = str(root / "%(title).80B-%(id)s.%(ext)s")
        media_type = job["media_type"]
        quality = job.get("quality") or "best_available"
        cmd = ["yt-dlp", "--no-playlist", "--no-warnings", "--restrict-filenames",
               "--max-filesize", str(MAX_BYTES), "-o", output_template]

        if media_type == "audio" or quality == "audio_high":
            cmd += ["-x", "--audio-format", "mp3", "--audio-quality", "0"]
        else:
            if quality in ("1080p", "720p", "480p"):
                height = quality[:-1]
                cmd += ["-f", f"bv*[height<={height}]+ba/b[height<={height}]/b"]
            else:
                cmd += ["-f", "bv*+ba/b"]
            cmd += ["--merge-output-format", "mp4"]

        cmd.append(source_url)
        try:
            completed = subprocess.run(
                cmd, cwd=root, capture_output=True, text=True, timeout=TIMEOUT_SECONDS
            )
            if completed.returncode != 0:
                raise RuntimeError((completed.stderr or completed.stdout or "yt-dlp failed")[-1500:])
            media_files = [
                p for p in root.iterdir()
                if p.is_file() and p.suffix.lower() in {".mp4", ".webm", ".mkv", ".mp3", ".m4a", ".wav"}
            ]
            if not media_files:
                raise RuntimeError("Processor completed but no supported media file was produced.")

            assets = []
            for media_file in media_files:
                ext = media_file.suffix.lower()
                mime = {
                    ".mp4": "video/mp4", ".webm": "video/webm", ".mkv": "video/x-matroska",
                    ".mp3": "audio/mpeg", ".m4a": "audio/mp4", ".wav": "audio/wav",
                }.get(ext, "application/octet-stream")
                asset_type = "audio" if ext in (".mp3", ".m4a", ".wav") else "video"
                if media_type == "audio" and asset_type != "audio":
                    continue
                if media_type == "video" and asset_type != "video":
                    continue
                storage_path = f"{job['user_id']}/{job_id}/{safe_filename(media_file.name)}"
                upload_file(media_file, storage_path, mime)
                assets.append({
                    "job_id": job_id,
                    "user_id": job["user_id"],
                    "asset_type": asset_type,
                    "format": ext.lstrip("."),
                    "quality": quality,
                    "storage_path": storage_path,
                    "file_name": media_file.name,
                    "mime_type": mime,
                    "size_bytes": media_file.stat().st_size,
                    "status": "ready",
                    "metadata": {"processor": "yt-dlp+FFmpeg"},
                })

            if not assets:
                raise RuntimeError("No output matched the selected media type.")
            for asset in assets:
                response = requests.post(
                    f"{SUPABASE_URL}/rest/v1/media_download_assets",
                    headers=headers({"Content-Type": "application/json", "Prefer": "resolution=merge-duplicates,return=minimal"}),
                    json=asset,
                    timeout=30,
                )
                response.raise_for_status()

            first = assets[0]
            db_patch(
                "media_download_jobs",
                {"id": f"eq.{job_id}"},
                {
                    "status": "completed",
                    "completed_at": "now()",
                    "output_storage_path": first["storage_path"],
                    "output_file_name": first["file_name"],
                    "output_mime_type": first["mime_type"],
                    "output_size_bytes": first["size_bytes"],
                    "error_message": None,
                    "metadata": {"processor": "yt-dlp+FFmpeg", "assets_count": len(assets)},
                },
            )
            return {"ok": True, "job_id": job_id, "status": "completed", "assets_count": len(assets)}
        except subprocess.TimeoutExpired:
            message = f"Download exceeded timeout of {TIMEOUT_SECONDS} seconds."
        except Exception as exc:
            message = str(exc)[:1500]
        try:
            db_patch(
                "media_download_jobs",
                {"id": f"eq.{job_id}"},
                {"status": "failed", "error_message": message},
            )
        except Exception:
            pass
        raise HTTPException(status_code=422, detail=message)
