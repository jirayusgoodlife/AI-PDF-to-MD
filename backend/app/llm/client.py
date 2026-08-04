from openai import AsyncOpenAI
import logging
from typing import Tuple

logger = logging.getLogger(__name__)

class LLMClient:
    def __init__(self, base_url: str, api_key: str, model: str):
        self.client = AsyncOpenAI(base_url=base_url, api_key=api_key)
        self.model = model

    async def complete(self, system_prompt: str, user_content: str, temperature: float = 0.3) -> str:
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                temperature=temperature
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            logger.error(f"LLM completion failed: {e}")
            raise

    async def check_connection(self) -> Tuple[bool, str]:
        try:
            # We list models to check connection
            models = await self.client.models.list()
            return True, ""
        except Exception as e:
            logger.error(f"LLM connection check failed: {e}")
            return False, str(e)
