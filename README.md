# AI-PDF-to-MD 📄→📝

Convert PDF, Word, PowerPoint, and Excel files to RAG-ready Markdown using **Docling**, **Marker**, and **Local LLM** (Ollama, vLLM, AirLLM).

[🇬🇧 English Documentation](README.en.md) | [🇹🇭 อ่านคู่มือภาษาไทย](README.th.md)

[![GitHub Repo](https://img.shields.io/badge/GitHub-jirayusgoodlife%2FAI--PDF--to--MD-blue?logo=github)](https://github.com/jirayusgoodlife/AI-PDF-to-MD)
[![Docker Hub](https://img.shields.io/badge/Docker%20Hub-jirayusgoodlife%2Fai--pdf--to--md-blue?logo=docker)](https://hub.docker.com/r/jirayusgoodlife/ai-pdf-to-md)
![Python](https://img.shields.io/badge/Python-3.11+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

> 🔗 **Open Source Repository**: [https://github.com/jirayusgoodlife/AI-PDF-to-MD](https://github.com/jirayusgoodlife/AI-PDF-to-MD)  
> 🐳 **Docker Hub Image**: [https://hub.docker.com/r/jirayusgoodlife/ai-pdf-to-md](https://hub.docker.com/r/jirayusgoodlife/ai-pdf-to-md)

---

## 🌐 Documentation Languages / ภาษาคู่มือ

- **[🇬🇧 README.en.md](README.en.md)** — Full documentation in English.
- **[🇹🇭 README.th.md](README.th.md)** — คู่มือการใช้งานภาษาไทยแบบละเอียด.

---

## ✨ Features / คุณสมบัติเด่น

- 📄 **Multi-format document parsing**: PDF, DOCX, PPTX, XLSX.
- 🔧 **Dual engines**: Choice between **Docling** (IBM) and **Marker** (Datalab).
- 🤖 **Local LLM text correction**: Fixes OCR typos and Thai tone mark/vowel placement errors.
- 📦 **RAG Chunking**: Structured semantic chunking with heading metadata.
- 🎨 **Modern Dark UI**: Glassmorphic SPA interface with Drag & Drop.
- 🐳 **Docker Compose**: One-click deployment with local Ollama service.

---

## ⚡ Quick Start / เริ่มต้นใช้งานรวดเร็ว

```bash
# Pull and run directly from Docker Hub
docker pull jirayusgoodlife/ai-pdf-to-md:latest

# Run with full stack (App + Ollama + Auto Model Puller)
docker compose up -d
```

Open in browser: **http://localhost:8000**

---

For detailed installation, configuration, and API reference, please visit:
- **[English Guide](README.en.md)**
- **[คู่มือภาษาไทย](README.th.md)**
