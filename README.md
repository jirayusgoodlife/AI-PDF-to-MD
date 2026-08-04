# AI-PDF-to-MD 📄→📝

แปลงเอกสาร PDF, Word, PowerPoint, Excel เป็น Markdown สำหรับ RAG  
พร้อมใช้ **Local LLM** (Ollama, vLLM, airllm) แก้ไขข้อความภาษาไทยที่ OCR ผิดพลาด

[![GitHub Repo](https://img.shields.io/badge/GitHub-jirayusgoodlife%2FAI--PDF--to--MD-blue?logo=github)](https://github.com/jirayusgoodlife/AI-PDF-to-MD)
[![Docker Hub](https://img.shields.io/badge/Docker%20Hub-jirayusgoodlife%2Fai--pdf--to--md-blue?logo=docker)](https://hub.docker.com/r/jirayusgoodlife/ai-pdf-to-md)
![Python](https://img.shields.io/badge/Python-3.11+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

> 🔗 **Open Source Repository**: [https://github.com/jirayusgoodlife/AI-PDF-to-MD](https.github.com/jirayusgoodlife/AI-PDF-to-MD)  
> 🐳 **Docker Hub Image**: [https://hub.docker.com/r/jirayusgoodlife/ai-pdf-to-md](https://hub.docker.com/r/jirayusgoodlife/ai-pdf-to-md)

## ✨ คุณสมบัติ

- 📄 **รองรับหลายรูปแบบ**: PDF, DOCX, PPTX, XLSX
- 🔧 **2 Conversion Engines**:
  - **Docling** (IBM) — รองรับทุกไฟล์, OCR ในตัว
  - **Marker** (Datalab) — เชี่ยวชาญ PDF, แม่นยำสูง
- 🤖 **Local LLM Integration**: แก้ไขข้อความภาษาไทยที่ OCR ผิด (สระ วรรณยุกต์ ผิดตำแหน่ง)
- 📦 **RAG-Ready Output**: แบ่ง Markdown เป็น chunks พร้อม metadata
- 🎨 **UI สวยงาม**: Dark glassmorphism design, drag & drop
- 🐳 **Docker Ready**: Deploy ด้วยคำสั่งเดียว

## 🚀 วิธีใช้งาน

### แบบ Manual Install

```bash
# 1. Clone repository
git clone <repo-url>
cd AI-PDF-to-MD

# 2. ติดตั้ง dependencies
cd backend
pip install -r requirements.txt

# 3. ตั้งค่า (optional)
cp ../.env.example .env
# แก้ไข .env ตามต้องการ

# 4. รัน server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

เปิดเบราว์เซอร์ไปที่ **http://localhost:8000**

### 🐳 การใช้งานด้วย Docker / Docker Hub

#### 1. ดึง Image จาก Docker Hub ไปใช้งานโดยตรง (ไม่ต้อง Build เอง)
```bash
# Pull image จาก Docker Hub
docker pull jirayusgoodlife/ai-pdf-to-md:latest

# รัน Container เดี่ยวๆ
docker run -d -p 8000:8000 \
  -v ./outputs:/app/outputs \
  -v ./uploads:/app/uploads \
  --name ai-pdf-to-md \
  jirayusgoodlife/ai-pdf-to-md:latest
```

#### 2. รันด้วย Docker Compose (แนะนำ)
มีให้เลือก 2 รูปแบบตามการใช้งาน:

##### รูปแบบที่ 1: All-in-One (แอปรวม Local LLM - Ollama + Auto Pull Model)
รันคำสั่งเดียวได้ทั้งตัวเว็บแอป Converter, Ollama Service และตัวดาวน์โหลด Model อัตโนมัติ:

```bash
# รันทั้งระบบ (App + Ollama + Auto Model Puller)
docker compose up -d

# ดูสถานะการทำงาน
docker compose ps

# ดู Logs
docker compose logs -f app
```

##### รูปแบบที่ 2: แยกส่วน (เฉพาะตัวแอป - เชื่อมต่อกับ Ollama / Local LLM ภายนอก)
หากคุณมี Ollama, vLLM หรือ AirLLM รันอยู่แล้วบนเครื่อง Host หรือ Server อื่น:

```bash
# รันเฉพาะแอปพลิเคชัน
docker compose -f docker-compose.app-only.yml up -d
```

---

## 🤖 ตั้งค่า Local LLM

### Ollama (แนะนำ)

```bash
# ติดตั้ง Ollama
curl -fsSL https://ollama.com/install.sh | sh

# ดึง model (แนะนำ llama3.1 สำหรับภาษาไทย)
ollama pull llama3.1

# Ollama จะรันอัตโนมัติที่ http://localhost:11434
```

### vLLM

```bash
pip install vllm
vllm serve <model-name> --api-key token-abc123
# จะรันที่ http://localhost:8000/v1
```

### การตั้งค่าบน Web UI

1. คลิกไอคอนฟันเฟืองที่มุมขวาบน
2. กรอก API URL (เช่น `http://localhost:11434/v1`)
3. กรอกชื่อ Model (เช่น `llama3.1`)
4. คลิก "ทดสอบการเชื่อมต่อ"
5. คลิก "บันทึก"

## 📁 โครงสร้างโปรเจค

```
AI-PDF-to-MD/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── config.py            # Settings
│   │   ├── models.py            # Pydantic models
│   │   ├── converters/          # Document conversion engines
│   │   │   ├── docling_converter.py
│   │   │   ├── marker_converter.py
│   │   │   └── factory.py
│   │   ├── llm/                 # LLM integration
│   │   │   ├── client.py
│   │   │   ├── thai_corrector.py
│   │   │   └── post_processor.py
│   │   ├── chunking/            # RAG chunking
│   │   │   └── rag_chunker.py
│   │   └── routes/              # API endpoints
│   │       ├── convert.py
│   │       ├── llm.py
│   │       └── health.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── app.js
│       ├── uploader.js
│       ├── converter.js
│       ├── preview.js
│       ├── settings.js
│       └── utils.js
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── README.md
```

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
| `GET` | `/api/llm/settings` | Get LLM settings |
| `POST` | `/api/llm/test` | Test LLM with sample text |

## 🔄 Conversion Pipeline

```
Upload File → Select Engine → Convert to Raw MD → [LLM Thai Correction] → [RAG Chunking] → Download
```

## 📋 System Requirements

- **Python** 3.11+
- **RAM**: 8GB minimum, 16GB+ recommended
- **GPU**: Optional (CUDA for faster Docling/Marker processing)
- **Disk**: 5GB+ (for ML models)

## 🙏 Credits

- [Docling](https://github.com/docling-project/docling) — IBM's document converter
- [Marker](https://github.com/datalab-to/marker) — PDF to markdown
- [pdf2md_llm](https://github.com/leoneversberg/pdf2md_llm) — LLM-enhanced PDF conversion
