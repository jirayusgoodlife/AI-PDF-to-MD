# AI-PDF-to-MD 📄→📝 (ภาษาไทย)

[🇬🇧 English Version](README.en.md) | [🇹🇭 ภาษาไทย](README.th.md)

แปลงเอกสาร PDF, Word, PowerPoint, Excel เป็น Markdown สำหรับ RAG  
พร้อมใช้ **Local LLM** (Ollama, vLLM, airllm) แก้ไขข้อความภาษาไทยที่ OCR ผิดพลาด (เช่น สระ วรรณยุกต์ ผิดตำแหน่ง)

[![GitHub Repo](https://img.shields.io/badge/GitHub-jirayusgoodlife%2FAI--PDF--to--MD-blue?logo=github)](https://github.com/jirayusgoodlife/AI-PDF-to-MD)
[![Docker Hub](https://img.shields.io/badge/Docker%20Hub-jirayusgoodlife%2Fai--pdf--to--md-blue?logo=docker)](https://hub.docker.com/r/jirayusgoodlife/ai-pdf-to-md)
![Python](https://img.shields.io/badge/Python-3.11+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

> 🔗 **Open Source Repository**: [https://github.com/jirayusgoodlife/AI-PDF-to-MD](https://github.com/jirayusgoodlife/AI-PDF-to-MD)  
> 🐳 **Docker Hub Image**: [https://hub.docker.com/r/jirayusgoodlife/ai-pdf-to-md](https://hub.docker.com/r/jirayusgoodlife/ai-pdf-to-md)

---

## ✨ คุณสมบัติ

- 📄 **รองรับหลายรูปแบบ**: PDF, DOCX, PPTX, XLSX
- 🔧 **2 Conversion Engines**:
  - **Docling** (IBM) — รองรับทุกประเภทไฟล์, มี OCR ในตัว
  - **Marker** (Datalab) — เชี่ยวชาญ PDF โดยเฉพาะ, ให้ความแม่นยำสูง
- 🤖 **Local LLM Integration**: แก้ไขข้อความภาษาไทยที่ OCR ผิดพลาด (เช่น สระ วรรณยุกต์ เพี้ยนหรือวางผิดตำแหน่ง)
- 📦 **RAG-Ready Output**: แบ่ง Markdown เป็น Chunks พร้อม Metadata (Heading Path, Source File, Index)
- 🎨 **UI สวยงาม**: Dark glassmorphic design พร้อมระบบ Drag & Drop
- 🐳 **Docker Ready**: พร้อมใช้งานด้วย Docker Compose เพียงคำสั่งเดียว

---

## 🚀 วิธีใช้งาน

### 1. 🐳 การใช้งานด้วย Docker / Docker Hub (แนะนำ)

#### ดึง Image จาก Docker Hub ไปใช้งานโดยตรง
```bash
# Pull image จาก Docker Hub
docker pull jirayusgoodlife/ai-pdf-to-md:latest

# รัน Container
docker run -d -p 8000:8000 \
  -v ./outputs:/app/outputs \
  -v ./uploads:/app/uploads \
  --name ai-pdf-to-md \
  jirayusgoodlife/ai-pdf-to-md:latest
```

#### รันด้วย Docker Compose

**แบบที่ 1: All-in-One (รวมแอป + Local LLM Ollama + Auto Pull Model)**
```bash
docker compose up -d
```

**แบบที่ 2: รันเฉพาะตัวแอป (เชื่อมต่อ Local LLM ภายนอก)**
```bash
docker compose -f docker-compose.app-only.yml up -d
```

เปิดเบราว์เซอร์ไปที่: **http://localhost:8000**

---

### 2. 🛠️ แบบ Manual Install

```bash
# 1. Clone repository
git clone https://github.com/jirayusgoodlife/AI-PDF-to-MD.git
cd AI-PDF-to-MD

# 2. ติดตั้ง dependencies
cd backend
pip install -r requirements.txt

# 3. ตั้งค่า (optional)
cp ../.env.example .env

# 4. รัน server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 🤖 การตั้งค่า Local LLM

### Ollama
```bash
# ติดตั้ง Ollama
curl -fsSL https://ollama.com/install.sh | sh

# ดึงโมเดล (แนะนำ llama3.1)
ollama pull llama3.1
```

### การตั้งค่าบน Web UI
1. คลิกไอคอนฟันเฟือง ⚙️ ที่มุมขวาบน
2. กรอก API URL (เช่น `http://localhost:11434/v1`)
3. กรอกชื่อ Model (เช่น `llama3.1`)
4. คลิก "ทดสอบการเชื่อมต่อ" ➔ "บันทึก"

---

## 📁 โครงสร้างโปรเจค

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

## 🛠️ วิธีการ Build & Push ขึ้น Docker Hub

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
