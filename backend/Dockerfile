FROM python:3.12-slim AS builder
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends libatomic1 \
    && rm -rf /var/lib/apt/lists/*
ENV PRISMA_BINARY_CACHE_DIR=/prisma-binaries
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY prisma prisma
RUN prisma generate --schema=prisma/schema.prisma \
    && prisma py fetch
COPY app app
FROM python:3.12-slim AS runtime
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
RUN apt-get update \
    && apt-get install -y --no-install-recommends libatomic1 \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV PRISMA_BINARY_CACHE_DIR=/prisma-binaries
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /prisma-binaries /prisma-binaries
COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/app /app/app
CMD ["sh", "-c", "python -m prisma migrate deploy --schema=prisma/schema.prisma && python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]