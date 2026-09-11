# if-doc2md 📄→📝 (คู่มือภาษาไทย)

[🇹🇭 ภาษาไทย](README.th.md) | [🇬🇧 English Version](README.en.md)

ระบบแปลงเอกสาร **PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx)** ให้เป็น **Markdown** คุณภาพสูงสำหรับระบบ **RAG (Retrieval-Augmented Generation)**  
พร้อมระบบ **Data Cleansing** และแก้ไขข้อความภาษาไทยด้วย **Local LLM** (Ollama, vLLM, LM Studio) เพื่อตัด Header, Footer, เลขหน้า, จุดไข่ปลา และเว้นวรรคผิดปกติออกโดยอัตโนมัติ

[![GitHub Repo](https://img.shields.io/badge/GitHub-jirayusgoodlife%2FAI--PDF--to--MD-blue?logo=github)](https://github.com/jirayusgoodlife/AI-PDF-to-MD)
[![Docker Hub](https://img.shields.io/badge/Docker%20Hub-jirayusgoodlife%2Fai--pdf--to--md-blue?logo=docker)](https://hub.docker.com/r/jirayusgoodlife/ai-pdf-to-md)
![Python](https://img.shields.io/badge/Python-3.11+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📸 ภาพตัวอย่างหน้าจอการใช้งาน (Screenshots)

| 1. หน้าจอหลักและการอัปโหลดไฟล์ | 2. การตั้งค่าเอนจินและเปิดใช้ LLM/RAG |
| :---: | :---: |
| ![หน้าจอหลัก](docs/screenshots/ui_main.png) | ![ตัวเลือกการแปลง](docs/screenshots/ui_options.png) |
| **3. การติดตามขั้นตอนประมวลผลแบบเรียลไทม์** | **4. หน้าต่างผลลัพธ์ Markdown & RAG Chunks** |
| ![ขั้นตอนการแปลง](docs/screenshots/ui_progress.png) | ![ผลลัพธ์](docs/screenshots/ui_result.png) |

### 5. การตั้งค่า LLM Server และ System Prompt สำหรับ Data Cleansing
สามารถปรับแต่งคำสั่ง Prompt เพื่อควบคุมการตัดข้อมูลขยะสำหรับ RAG และปรับแก้ไขสระ/วรรณยุกต์ภาษาไทยได้อย่างอิสระ
![การตั้งค่าและ System Prompt](docs/screenshots/ui_settings.png)

### 6. เอกสาร API แบบโต้ตอบ (Interactive OpenAPI / Swagger UI)
เปิดดูและทดลองยิง API ทุกเส้นทางได้ง่ายๆ ผ่านปุ่มรูปเอกสาร API ในหน้าเว็บ หรือเข้าผ่าน URL:
- Swagger UI: `http://localhost:8000/docs` (หรือ `/swagger`, `/api/docs`)
- ReDoc UI: `http://localhost:8000/redoc`
- OpenAPI JSON Spec: `http://localhost:8000/openapi.json`
![Swagger UI](docs/screenshots/ui_swagger.png)

---

## ✨ จุดเด่นและความสามารถ (Features)

1. **🎨 หน้าจอใช้งานทันสมัย (Dark Slate & Electric Blue)**
   - ดีไซน์ Glassmorphic ใช้งานง่าย สบายตา
   - ปุ่มสลับภาษาบนแถบนำทาง (🇹🇭 ไทย / 🇬🇧 อังกฤษ)
   - ป้ายสถานะการเชื่อมต่อกับ LLM แบบสด ("เชื่อมต่อกับ LLM แล้ว" / "ยังไม่ได้เชื่อมต่อกับ LLM")

2. **📄 รองรับไฟล์เอกสารและภาพสแกนหลากหลาย**
   - PDF, Microsoft Word (`.docx`), PowerPoint (`.pptx`), Excel (`.xlsx`)
   - ไฟล์ภาพสแกนและรูปถ่ายเอกสาร (`.png`, `.jpg`, `.jpeg`, `.webp`, `.tiff`, `.bmp`) สูงสุด 100MB

3. **🔧 เอนจินการแปลงเอกสาร 2 รูปแบบ**
   - **Docling (IBM)**: รองรับไฟล์เอกสารทุกตระกูล มี OCR ดึงตาราง ตารางซ้อน และโครงสร้างหัวข้อได้ละเอียด
   - **Marker (Datalab)**: ออกแบบเฉพาะทางเพื่อสกัดเนื้อหาจาก PDF ด้วยความเร็วและความแม่นยำสูง

4. **🔍 ระบบ OCR เอกสารสแกน / ถ่ายเอกสาร และรูปถ่าย (Thai & Multilingual OCR)**
   - **รองรับทั้ง PDF สแกนและรูปถ่าย**: สกัดข้อความจากเอกสาร PDF ที่เป็นภาพสแกน, สำเนาถ่ายเอกสาร, หรือไฟล์รูปภาพโดยตรง
   - **Tesseract OCR (ภาษาไทย `tha` + อังกฤษ `eng`)**: ถอดข้อความภาษาไทยและอังกฤษได้อย่างแม่นยำ
   - **Auto-Detect Scanned PDF**: ตรวจจับอัตโนมัติหากเอกสารไม่มี Text Layer เพื่อสลับไปใช้ Full Page OCR โดยอัตโนมัติ
   - **Thai Spacing Normalization**: ทำความสะอาดสระลอย วรรณยุกต์ และกำจัดช่องว่างที่แยกตัวอักษรไทยออกจากกัน เพื่อให้ข้อความ Markdown สมบูรณ์พร้อมใช้กับ RAG ทันที
   - **ตัวเลือกควบคุม OCR**: สามารถเปิด/ปิด OCR หรือสั่งบังคับ OCR ทั้งหน้า (Force Full-Page OCR) ได้จากหน้าเว็บ

5. **🧹 ระบบ Data Cleansing & แก้ไขภาษาไทยด้วย LLM**
   - **ตัด Header / Footer / เลขหน้า**: เช่น *"หน้า 1 จาก 10"*, *"Page 2 of 15"*, ชื่อเอกสารหรือรหัสลับที่ขึ้นซ้ำๆ ทุกหน้า ซึ่งเป็น Noise รบกวน Vector Embedding ของ RAG
   - **ลบจุดไข่ปลาและเส้นประ**: เช่น `....................`, `-------------`, `_ _ _ _ _ _` ที่ติดมาจากสารบัญหรือแบบฟอร์ม
   - **แก้ปัญหา Spacing ผิดปกติ**: ตัวอักษรที่กระจายจากการจัดหน้าแบบ Justify เช่น `ก า ร ท ด ส อ บ` → `การทดสอบ` และช่องว่างหลายเคาะซ้ำซ้อน
   - **แก้สระและวรรณยุกต์ลอย/จม**: จัดระเบียบวรรณยุกต์และคำผิดที่เกิดจาก Font Encoding หรือ OCR

5. **⚙️ ปรับแต่ง System Prompt ได้อิสระใน Setting**
   - แก้ไขคำสั่ง Prompt ในหน้าต่างตั้งค่า พร้อมบันทึกลงในระบบทันที
   - ปุ่ม **"คืนค่าเริ่มต้น" (Reset to default)** เพื่อย้อนกลับไปใช้ Prompt มาตรฐานที่มีชุดกฎ RAG Cleansing ครบครัน

6. **📦 Semantic RAG Chunking**
   - แบ่งชิ้นส่วนข้อความตามโครงสร้างหัวข้อ (H1, H2, H3...)
   - บันทึก Metadata ละเอียด: `source`, `heading_path`, `chunk_index`, `total_chunks`
   - ส่งออกเป็นไฟล์ `.json` สำหรับนำไปทำ Embeddings ใน Vector Database ได้ทันที

---

## 🚀 วิธีการติดตั้งและเริ่มใช้งาน

### 1. 🐳 ใช้งานผ่าน Docker / Docker Hub (แนะนำที่สุด)

#### ดึง Image ตรงจาก Docker Hub
```bash
docker pull jirayusgoodlife/ai-pdf-to-md:latest

docker run -d -p 8000:8000 \
  -v ./outputs:/app/outputs \
  -v ./uploads:/app/uploads \
  --name if-doc2md \
  jirayusgoodlife/ai-pdf-to-md:latest
```

#### ใช้งานด้วย Docker Compose (All-in-One: App + Local LLM Ollama)
```bash
# รันทั้งระบบ
docker compose up -d

# ดูบันทึกการทำงาน
docker compose logs -f
```

เปิดเว็บเบราว์เซอร์ไปที่: **http://localhost:8000**

---

### 2. 🛠️ ติดตั้งและรันโดยตรง (Manual / Local Dev)

```bash
# 1. Clone repository
git clone https://github.com/jirayusgoodlife/AI-PDF-to-MD.git
cd AI-PDF-to-MD

# 2. ติดตั้ง Dependencies ใน backend
cd backend
pip install -r requirements.txt

# 3. สร้างไฟล์ตั้งค่า
cp ../.env.example .env

# 4. รันเซิร์ฟเวอร์
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 🤖 การเชื่อมต่อ Local LLM

ระบบรองรับ LLM Server ทุกค่ายที่เข้ากันได้กับมาตรฐาน **OpenAI Compatible API** เช่น **Ollama**, **vLLM**, **LM Studio**, **LocalAI**

### ตัวอย่างการเชื่อมต่อ Ollama:
```bash
# 1. ติดตั้ง Ollama และดึงโมเดลภาษาไทย/สากล (แนะนำ llama3.1 หรือ gemma2)
ollama pull llama3.1

# 2. ตรวจสอบให้ Ollama เปิดบริการที่ port 11434
```

### การตั้งค่าผ่าน Web UI:
1. คลิกไอคอนฟันเฟือง ⚙️ ที่มุมขวาบน
2. กรอก **API URL**: `http://localhost:11434/v1` (หรือ IP ของ LLM Server)
3. กรอก **Model Name**: เช่น `llama3.1`, `google/gemma-4-31B-it-qat-w4a16-ct`
4. ปรับแต่งคำสั่ง **System Prompt** หากต้องการกฎ Cleansing เพิ่มเติม
5. คลิก **"ทดสอบการเชื่อมต่อ"** ➔ ระบบจะแสดงสัญญาณไฟสีเขียว **"เชื่อมต่อกับ LLM แล้ว"**
6. คลิก **"บันทึก"**

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

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
│   └── screenshots/             # ภาพตัวอย่างหน้าจอระบบ
├── docker-compose.yml           # All-in-One Deployment
└── Dockerfile
```

---

## 📄 ใบอนุญาต (License)

โปรเจกต์นี้เผยแพร่ภายใต้สัญญาอนุญาต [MIT License](LICENSE) สามารถนำไปใช้งาน พัฒนาต่อยอด และประยุกต์ใช้ในองค์กรได้อย่างอิสระ
