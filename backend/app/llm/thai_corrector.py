import logging
from typing import List
from .client import LLMClient

logger = logging.getLogger(__name__)

THAI_CORRECTION_SYSTEM_PROMPT = """คุณเป็นผู้เชี่ยวชาญด้านภาษาไทย ทำหน้าที่แก้ไขข้อความภาษาไทยที่ได้จากการแปลงเอกสาร (OCR/PDF extraction)

กฎ:
1. แก้ไขสระ วรรณยุกต์ ที่อยู่ผิดตำแหน่ง เช่น 'เพียน' → 'เพี้ยน', 'ข้อมลู' → 'ข้อมูล'
2. แก้คำที่สะกดผิดจากปัญหา font encoding
3. รักษาโครงสร้าง Markdown เดิมไว้ทั้งหมด (headings, tables, links, code blocks)
4. ห้ามแปลภาษา ห้ามเปลี่ยนความหมาย ห้ามเพิ่มหรือลบเนื้อหา
5. ถ้าข้อความถูกต้องแล้ว ให้คืนข้อความเดิมโดยไม่เปลี่ยนแปลง
6. ห้ามเพิ่ม markdown code fence (```) ครอบผลลัพธ์

ส่งคืนเฉพาะข้อความที่แก้ไขแล้วเท่านั้น ไม่ต้องอธิบาย"""

class ThaiCorrector:
    def __init__(self, llm_client: LLMClient, chunk_size: int = 2000):
        self.llm_client = llm_client
        self.chunk_size = chunk_size

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
            return await self.llm_client.complete(THAI_CORRECTION_SYSTEM_PROMPT, chunk)
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
