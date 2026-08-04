import logging
import re
from typing import List, Optional
from ..models import RAGChunk, ChunkMetadata, RAGOutput

logger = logging.getLogger(__name__)

class RAGChunker:
    def chunk_by_headings(self, markdown: str, source_file: str, max_chunk_size: int = 4000) -> RAGOutput:
        lines = markdown.split("\n")
        chunks = []
        current_chunk_lines = []
        current_heading_path = []
        
        in_table = False
        
        for line in lines:
            # Check for table boundaries (simple check)
            if line.strip().startswith('|') and line.strip().endswith('|'):
                in_table = True
            elif in_table and not line.strip():
                in_table = False
                
            heading_match = re.match(r'^(#{1,6})\s+(.*)$', line)
            
            if heading_match and not in_table:
                if current_chunk_lines:
                    chunks.append((current_heading_path.copy(), "\n".join(current_chunk_lines)))
                    current_chunk_lines = []
                
                level = len(heading_match.group(1))
                heading_text = heading_match.group(2).strip()
                
                if len(current_heading_path) >= level:
                    current_heading_path = current_heading_path[:level-1]
                current_heading_path.append(heading_text)
                
                current_chunk_lines.append(line)
            else:
                current_chunk_lines.append(line)
                
            if not in_table and len("\n".join(current_chunk_lines)) > max_chunk_size:
                chunks.append((current_heading_path.copy(), "\n".join(current_chunk_lines)))
                current_chunk_lines = []

        if current_chunk_lines:
            chunks.append((current_heading_path.copy(), "\n".join(current_chunk_lines)))

        rag_chunks = []
        total_chunks = len(chunks)
        
        for idx, (path, content) in enumerate(chunks):
            metadata = ChunkMetadata(
                source=source_file,
                page=None,
                heading_path=path,
                chunk_index=idx + 1,
                total_chunks=total_chunks
            )
            rag_chunks.append(RAGChunk(content=content.strip(), metadata=metadata))
            
        return RAGOutput(
            chunks=rag_chunks,
            total_chunks=total_chunks,
            source_file=source_file
        )
