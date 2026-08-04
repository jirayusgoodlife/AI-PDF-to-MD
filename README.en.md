# AI-PDF-to-MD 📄→📝 (English)

[🇬🇧 English Version](README.en.md) | [🇹🇭 ภาษาไทย](README.th.md)

Convert PDF, Word, PowerPoint, and Excel files to high-quality Markdown for RAG applications.  
Integrated with **Local LLM** (Ollama, vLLM, airllm) to correct OCR errors, typos, and misplaced Thai tone marks/vowels.

[![GitHub Repo](https://img.shields.io/badge/GitHub-jirayusgoodlife%2FAI--PDF--to--MD-blue?logo=github)](https://github.com/jirayusgoodlife/AI-PDF-to-MD)
[![Docker Hub](https://img.shields.io/badge/Docker%20Hub-jirayusgoodlife%2Fai--pdf--to--md-blue?logo=docker)](https://hub.docker.com/r/jirayusgoodlife/ai-pdf-to-md)
![Python](https://img.shields.io/badge/Python-3.11+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

> 🔗 **Open Source Repository**: [https://github.com/jirayusgoodlife/AI-PDF-to-MD](https://github.com/jirayusgoodlife/AI-PDF-to-MD)  
> 🐳 **Docker Hub Image**: [https://hub.docker.com/r/jirayusgoodlife/ai-pdf-to-md](https://hub.docker.com/r/jirayusgoodlife/ai-pdf-to-md)

---

## ✨ Key Features

- 📄 **Multi-Format Support**: PDF, DOCX, PPTX, XLSX
- 🔧 **Dual Conversion Engines**:
  - **Docling** (IBM) — All-in-one document structure recognition & OCR
  - **Marker** (Datalab) — Specialized high-accuracy PDF parsing
- 🤖 **Local LLM Correction**: Fixes misplaced Thai vowels/tone marks and OCR text distortions
- 📦 **RAG-Ready Output**: Automatically splits output into semantic Markdown chunks with metadata (headings, source file, chunk index)
- 🎨 **Modern Dark UI**: Glassmorphic SPA design with drag-and-drop file upload
- 🐳 **Docker Ready**: One-command deployment via Docker Compose

---

## 🚀 Quick Start

### 1. 🐳 Using Docker / Docker Hub (Recommended)

#### Pull image directly from Docker Hub:
```bash
docker pull jirayusgoodlife/ai-pdf-to-md:latest

docker run -d -p 8000:8000 \
  -v ./outputs:/app/outputs \
  -v ./uploads:/app/uploads \
  --name ai-pdf-to-md \
  jirayusgoodlife/ai-pdf-to-md:latest
```

#### Run with Docker Compose:

**Option A: Full Stack (App + Local LLM Ollama + Auto Model Puller)**
```bash
docker compose up -d
```

**Option B: App Only (Connect to External Ollama / vLLM / AirLLM)**
```bash
docker compose -f docker-compose.app-only.yml up -d
```

Open your browser at: **http://localhost:8000**

---

### 2. 🛠️ Manual Installation

```bash
# 1. Clone repository
git clone https://github.com/jirayusgoodlife/AI-PDF-to-MD.git
cd AI-PDF-to-MD

# 2. Install dependencies
cd backend
pip install -r requirements.txt

# 3. Environment configuration (optional)
cp ../.env.example .env

# 4. Start application
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 🤖 Local LLM Setup

### Ollama Setup
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull model (llama3.1 recommended)
ollama pull llama3.1
```

### Configuring Web UI
1. Click the gear icon ⚙️ on the top right corner.
2. Set API URL (e.g., `http://localhost:11434/v1`).
3. Set Model Name (e.g., `llama3.1`).
4. Click **Test Connection** ➔ **Save**.

---

## 📁 Project Structure

```
AI-PDF-to-MD/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── config.py            # Configuration & Settings
│   │   ├── models.py            # Pydantic schemas
│   │   ├── converters/          # Conversion engines (Docling, Marker)
│   │   ├── llm/                 # LLM client & Thai text corrector
│   │   ├── chunking/            # RAG chunker
│   │   └── routes/              # API routes
│   └── requirements.txt
├── frontend/
│   ├── index.html               # SPA UI
│   ├── css/style.css            # Dark glassmorphic styles
│   └── js/                      # App logic & modules
├── docker-compose.yml           # Full stack compose
├── docker-compose.app-only.yml # App-only compose
├── Dockerfile
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check & supported formats |
| `POST` | `/api/convert` | Upload & convert document |
| `GET` | `/api/convert/{id}/status` | Check conversion status |
| `GET` | `/api/convert/{id}/download` | Download markdown file |
| `GET` | `/api/convert/{id}/download/rag` | Download RAG JSON |
| `GET` | `/api/history` | List recent conversions |
| `GET` | `/api/llm/status` | Check LLM connection |
| `POST` | `/api/llm/settings` | Update LLM settings |
| `POST` | `/api/llm/test` | Test LLM with sample text |

---

## 🛠️ Building & Pushing Docker Image

```bash
docker login -u jirayusgoodlife
docker build -t jirayusgoodlife/ai-pdf-to-md:latest .
docker push jirayusgoodlife/ai-pdf-to-md:latest
```

---

## 🙏 Credits

- [Docling](https://github.com/docling-project/docling) — IBM's document converter
- [Marker](https://github.com/datalab-to/marker) — PDF to markdown
- [pdf2md_llm](https://github.com/leoneversberg/pdf2md_llm) — LLM-enhanced PDF conversion
