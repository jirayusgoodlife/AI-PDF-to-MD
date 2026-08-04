FROM python:3.11-slim-bookworm

WORKDIR /app

# Upgrade system packages for security patches (Perl, glibc, OpenSSL, etc.)
# and install required system libraries
RUN apt-get update && \
    apt-get dist-upgrade -y --no-install-recommends && \
    apt-get install -y --no-install-recommends \
        build-essential \
        libgl1 \
        libglib2.0-0 \
        libsm6 \
        libxext6 \
        libxrender-dev \
        poppler-utils \
        tesseract-ocr \
        tesseract-ocr-tha \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies with security upgrades
COPY backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/app ./app
COPY frontend ./frontend

# Create output directories
RUN mkdir -p /app/outputs /app/uploads

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV UPLOAD_DIR=/app/uploads
ENV OUTPUT_DIR=/app/outputs

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
