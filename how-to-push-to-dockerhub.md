# 🛠️ วิธีการ Build และ Push ขึ้น Docker Hub (ตัวอย่างของ jirayusgoodlife)

หากต้องการอัปเดตหรือ Push Image เวอร์ชั่นใหม่ขึ้น Docker Hub Repository [jirayusgoodlife/ai-pdf-to-md](https://hub.docker.com/repository/docker/jirayusgoodlife/ai-pdf-to-md):

```bash
# 1. เข้าสู่ระบบ Docker Hub (หากยังไม่ได้ Login)
docker login -u jirayusgoodlife

# 2. Build Image พร้อม Tag ของ Docker Hub
docker build -t jirayusgoodlife/ai-pdf-to-md:latest .
# หรือระบุ Tag version (เช่น v1.0.2)
docker build -t jirayusgoodlife/ai-pdf-to-md:v1.0.2 .

# 3. Push Image ขึ้น Docker Hub
docker push jirayusgoodlife/ai-pdf-to-md:latest
docker push jirayusgoodlife/ai-pdf-to-md:v1.0.2
```

*(ตัวเลือกเสริม) Build แบบ Multi-platform (amd64 / arm64)*:
```bash
docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 \
  -t jirayusgoodlife/ai-pdf-to-md:latest \
  --push .
```
---

## 🛠️ Building & Pushing Docker Image

```bash
docker login -u jirayusgoodlife
docker build -t jirayusgoodlife/ai-pdf-to-md:latest .
docker push jirayusgoodlife/ai-pdf-to-md:latest
```

