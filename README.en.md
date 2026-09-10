# if-doc2md 📄→📝 (English Documentation)

[🇬🇧 English Version](README.en.md) | [🇹🇭 ภาษาไทย](README.th.md)

An intelligent document-to-Markdown conversion engine designed for **Retrieval-Augmented Generation (RAG)** pipelines. Supports **PDF, Word (.docx), PowerPoint (.pptx), and Excel (.xlsx)** with **Docling**, **Marker**, and **Local LLM** (Ollama, vLLM, LM Studio) for automated Thai text correction and RAG data cleansing.

[![GitHub Repo](https://img.shields.io/badge/GitHub-jirayusgoodlife%2FAI--PDF--to--MD-blue?logo=github)](https://github.com/jirayusgoodlife/AI-PDF-to-MD)
[![Docker Hub](https://img.shields.io/badge/Docker%20Hub-jirayusgoodlife%2Fai--pdf--to--md-blue?logo=docker)](https://hub.docker.com/r/jirayusgoodlife/ai-pdf-to-md)
![Python](https://img.shields.io/badge/Python-3.11+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📸 UI Showcase

| 1. Main Drag & Drop Interface | 2. Engine & Conversion Options |
| :---: | :---: |
| ![Main Screen](docs/screenshots/ui_main.png) | ![Options Screen](docs/screenshots/ui_options.png) |
| **3. Live Step Progress Tracker** | **4. Markdown Preview & RAG Output** |
| ![Progress Steps](docs/screenshots/ui_progress.png) | ![Result Screen](docs/screenshots/ui_result.png) |

### 5. LLM Settings & Custom System Prompt (RAG Cleansing)
Configure API endpoints and edit the **System Prompt** to eliminate unwanted RAG artifacts (headers/footers, page numbers, repeated dots `.....`, and full-justify spacing anomalies).
![Settings & Prompt](docs/screenshots/ui_settings.png)

### 6. Interactive OpenAPI & Swagger Documentation
Test and explore all API endpoints directly in your browser or via the API Docs button in the navigation header:
- Swagger UI: `http://localhost:8000/docs` (or `/swagger`, `/api/docs`)
- ReDoc UI: `http://localhost:8000/redoc`
- OpenAPI Schema: `http://localhost:8000/openapi.json`
![Swagger UI](docs/screenshots/ui_swagger.png)

---

## ✨ Key Features

1. **🎨 Slate Gray & Electric Blue Glassmorphic UI**
   - Clean, modern single-page application.
   - Built-in bilingual language switcher (🇹🇭 TH / 🇬🇧 EN) in the navigation bar.
   - Real-time LLM connection status badge with auto-sync.

2. **📄 Broad Document Format Support**
   - PDF, Word (`.docx`), PowerPoint (`.pptx`), and Excel (`.xlsx`) up to 100MB.

3. **🔧 Dual Conversion Engines**
   - **Docling (IBM)**: Full document format parsing, OCR, table extraction, and deep layout analysis.
   - **Marker (Datalab)**: High-speed, specialized extraction engine for PDF files.

4. **🧹 AI Thai Text Correction & RAG Cleansing Pipeline**
   - **Removes Headers, Footers & Page Numbers**: Filters out repeated document headers and page indicators (e.g., *"Page 1 of 10"*, *"หน้า 1 จาก 10"*), eliminating vector embedding noise.
   - **Cleans Dot Leaders & Form Fill Lines**: Strips lines like `..........`, `------------`, `_ _ _ _ _` from tables of contents and blanks.
   - **Normalizes Abnormal Spacing**: Resolves letter/word spacing scattered by full justification (e.g. `ก า ร ท ด ส อ บ` → `การทดสอบ`).
   - **Fixes OCR Errors**: Restores floating tone marks, missing vowels, and font encoding issues.

5. **⚙️ Customizable System Prompt with Instant Reset**
   - Edit the LLM instruction prompt directly in the Settings modal.
   - One-click **"Reset to Default"** restores comprehensive RAG cleansing rules anytime.

6. **📦 Semantic RAG Chunking**
   - Splits content into coherent semantic blocks based on heading hierarchy (H1, H2, H3).
   - Generates metadata: `heading_path`, `source`, `chunk_index`, and `total_chunks`.
   - Download as structured `.json` ready for embedding into Milvus, Qdrant, Chroma, or Pinecone.

---

## 🚀 Quick Start

### 1. 🐳 Run via Docker / Docker Hub (Recommended)

#### Pull and Run directly:
```bash
docker pull jirayusgoodlife/ai-pdf-to-md:latest

docker run -d -p 8000:8000 \
  -v ./outputs:/app/outputs \
  -v ./uploads:/app/uploads \
  --name if-doc2md \
  jirayusgoodlife/ai-pdf-to-md:latest
```

#### Run with Docker Compose (All-in-One: App + Local LLM Ollama):
```bash
docker compose up -d
```

Open your browser at: **http://localhost:8000**

---

### 2. 🛠️ Manual Installation (Local Python Environment)

```bash
# 1. Clone repository
git clone https://github.com/jirayusgoodlife/AI-PDF-to-MD.git
cd AI-PDF-to-MD

# 2. Install backend dependencies
cd backend
pip install -r requirements.txt

# 3. Setup configuration
cp ../.env.example .env

# 4. Run development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 🤖 Configuring Local LLM

Compatible with any **OpenAI-compatible API** endpoint (Ollama, vLLM, LM Studio, LocalAI).

### Using Ollama:
```bash
# 1. Pull a recommended model
ollama pull llama3.1

# 2. Ensure Ollama is listening on port 11434
```

### In the Web UI:
1. Click the gear icon ⚙️ in the top right.
2. Enter your **API URL** (e.g., `http://localhost:11434/v1` or remote server IP).
3. Enter your **Model Name** (e.g., `llama3.1`, `google/gemma-4-31B-it-qat-w4a16-ct`).
4. Optionally customize the **System Prompt** for your specific domain cleansing rules.
5. Click **"Test Connection"** ➔ Verify the status indicator turns green.
6. Click **"Save"**.

---

## 📂 Project Architecture

```text
AI-PDF-to-MD/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI Application & Routes entry
│   │   ├── config.py            # Environment & System Settings
│   │   ├── models.py            # Pydantic Schemas (API, LLM, RAG)
│   │   ├── converters/          # Docling & Marker Converter Adapters
│   │   ├── chunking/            # Heading-based Semantic RAG Chunker
│   │   ├── llm/
│   │   │   ├── client.py        # OpenAI-compatible Async Client
│   │   │   ├── thai_corrector.py# Thai Correction & Cleansing Prompt Logic
│   │   │   └── post_processor.py# Regex Cleaners & Pre/Post pipeline
│   │   └── routes/              # /api/convert, /api/llm, etc.
│   └── requirements.txt
├── frontend/
│   ├── index.html               # Web UI Single Page Application
│   ├── css/
│   │   └── style.css            # Slate Gray & Electric Blue Glassmorphic theme
│   └── js/
│       ├── app.js               # Application Orchestrator
│       ├── i18n.js              # Thai / English Localization Engine
│       ├── settings.js          # Settings Modal & Prompt Manager
│       ├── uploader.js          # Drag & Drop File Upload Handler
│       ├── converter.js         # API Bridge & Step Progress Controller
│       └── preview.js           # Markdown Preview & Chunks Renderer
├── docs/
│   └── screenshots/             # UI Screenshots
├── docker-compose.yml           # All-in-One Deployment
└── Dockerfile
```

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
