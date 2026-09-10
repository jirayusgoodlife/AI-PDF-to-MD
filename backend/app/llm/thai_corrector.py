import logging
from typing import List, Optional
from .client import LLMClient

logger = logging.getLogger(__name__)

THAI_CORRECTION_SYSTEM_PROMPT = """คุณเป็นผู้เชี่ยวชาญด้านการประมวลผลเอกสารภาษาไทยและ RAG (Retrieval-Augmented Generation) ทำหน้าที่ตรวจทาน ทำความสะอาด (Data Cleansing) และแก้ไขข้อความภาษาไทยที่ได้จากการแปลงเอกสาร (OCR/PDF extraction) ให้เป็น Markdown ที่สมบูรณ์

ภารกิจและการทำความสะอาดข้อมูล (Cleansing Rules):
1. แก้ไขคำผิด สระ และวรรณยุกต์: แก้ไขตำแหน่งสระ/วรรณยุกต์ที่ลอย จม หรือสลับตำแหน่ง (เช่น 'เพียน' → 'เพี้ยน', 'ข้อมลู' → 'ข้อมูล') และแก้ปัญหา font encoding ที่ทำให้อ่านไม่รู้เรื่อง
2. กำจัดข้อความหัวกระดาษ/ท้ายกระดาษ และเลขหน้า: ลบ Header, Footer, เลขหน้า (เช่น 'หน้า 1 จาก 10', 'Page 1 of 5', ชื่อเอกสารหรือรหัสเอกสารที่ขึ้นซ้ำๆ ทุกหน้า) ซึ่งเป็นขยะที่ไม่จำเป็นต่อการทำ RAG
3. กำจัดจุดไข่ปลาและเส้นประซ้ำซ้อน: ลบจุดไข่ปลา เส้นประ หรือขีดเส้นใต้ที่ใช้ในแบบฟอร์มหรือสารบัญ (เช่น '....................', '-----------', '_ _ _ _ _ _') ให้เหลือเฉพาะเนื้อหาข้อความสำคัญ
4. จัดการการเว้นวรรคที่ผิดปกติ (Spacing Normalization):
   - แก้ไขตัวอักษรหรือคำภาษาไทยที่ถูกเว้นวรรคกระจัดกระจายผิดธรรมชาติจากการจัดหน้าแบบ Justify (เช่น 'ก า ร ท ด ส อ บ' → 'การทดสอบ', 'ข้อ ความ' → 'ข้อความ')
   - ลบช่องว่างที่เว้นวรรคติดกันเกินความจำเป็น (หลาย space ติดกัน) ให้เหลือช่องว่างเดียว
5. รักษาโครงสร้าง Markdown ที่มีประโยชน์: คงโครงสร้าง Heading (#, ##), ตาราง (Table), รายการ (List/Bullet), ลิงก์, โค้ดบล็อก ไว้ให้สมบูรณ์และถูกต้องตามมาตรฐาน Markdown
6. ไม่แต่งเติมเนื้อหา: ห้ามแต่งเติมเนื้อหาใหม่ ห้ามแปลภาษา และรักษาความหมายเดิมของเอกสารไว้ครบถ้วน
7. ห้ามใส่ markdown code block (```) ครอบข้อความผลลัพธ์ทั้งหมด ให้ส่งคืนเฉพาะเนื้อหาข้อความ Markdown ที่ทำความสะอาดแล้วเท่านั้น"""

class ThaiCorrector:
    def __init__(self, llm_client: LLMClient, chunk_size: int = 2000, system_prompt: Optional[str] = None):
        self.llm_client = llm_client
        self.chunk_size = chunk_size
        self.system_prompt = system_prompt.strip() if system_prompt and system_prompt.strip() else THAI_CORRECTION_SYSTEM_PROMPT

    def _split_into_chunks(self, text: str, chunk_size: int) -> List[str]:
        # Simple splitting by double newlines to respect markdown structure
        parts = text.split("\n\n")
        chunks = []
        current_chunk = []
        current_length = 0
        
        for part in parts:
            if current_length + len(part) > chunk_size and current_chunk:
                chunks.append("\n\n".join(current_chunk))
                current_chunk = [part]
                current_length = len(part)
            else:
                current_chunk.append(part)
                current_length += len(part) + 2
                
        if current_chunk:
            chunks.append("\n\n".join(current_chunk))
            
        return chunks

    async def correct_chunk(self, chunk: str) -> str:
        if not chunk.strip():
            return chunk
        try:
            return await self.llm_client.complete(self.system_prompt, chunk)
        except Exception as e:
            logger.error(f"Failed to correct chunk: {e}")
            return chunk

    async def correct(self, markdown: str) -> str:
        chunks = self._split_into_chunks(markdown, self.chunk_size)
        corrected_chunks = []
        
        for idx, chunk in enumerate(chunks):
            logger.info(f"Correcting chunk {idx+1}/{len(chunks)}")
            corrected_chunk = await self.correct_chunk(chunk)
            corrected_chunks.append(corrected_chunk)
            
        return "\n\n".join(corrected_chunks)
