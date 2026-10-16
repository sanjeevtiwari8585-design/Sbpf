import logging
import os
import time

from fastapi import HTTPException
from app import WORKER_TOKEN, configured, db_get, process_job

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
log = logging.getLogger("sbpf-media-worker")
POLL_SECONDS = max(5, int(os.getenv("QUEUE_POLL_SECONDS", "15")))


def main() -> None:
    if not configured():
        raise SystemExit("Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or WORKER_TOKEN.")
    log.info("SBPF media queue worker started; poll interval=%ss", POLL_SECONDS)
    while True:
        try:
            jobs = db_get(
                "media_download_jobs",
                {
                    "status": "eq.queued",
                    "rights_confirmed": "eq.true",
                    "select": "id,created_at",
                    "order": "created_at.asc",
                    "limit": "3",
                },
            )
            if not jobs:
                time.sleep(POLL_SECONDS)
                continue
            for job in jobs:
                try:
                    log.info("Processing queued job %s", job["id"])
                    result = process_job(job["id"], WORKER_TOKEN)
                    log.info("Job result: %s", result)
                except HTTPException as exc:
                    log.warning("Job %s failed with HTTP %s: %s", job.get("id"), exc.status_code, exc.detail)
                except Exception:
                    log.exception("Unexpected error processing job %s", job.get("id"))
        except Exception:
            log.exception("Queue poll failed")
            time.sleep(POLL_SECONDS)


if __name__ == "__main__":
    main()
