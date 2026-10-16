FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

RUN apt-get update \
 && apt-get install -y --no-install-recommends ffmpeg ca-certificates curl \
 && rm -rf /var/lib/apt/lists/* \
 && pip install --upgrade "yt-dlp[default]" \
 && yt-dlp --version

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY app.py .

RUN useradd --create-home --uid 10001 worker
USER worker

EXPOSE 8080
CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-8080}"]
