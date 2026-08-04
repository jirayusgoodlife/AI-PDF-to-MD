class PreviewManager {
    constructor() {
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabPanes = document.querySelectorAll('.tab-pane');
        
        this.previewTab = document.getElementById('tab-preview');
        this.rawTextarea = document.getElementById('raw-markdown');
        this.ragContainer = document.getElementById('rag-chunks-container');
        
        this.tabRagBtn = document.getElementById('tab-rag-btn');
        this.btnDlRag = document.getElementById('btn-dl-rag');
        
        this.btnCopy = document.getElementById('btn-copy-md');
        this.btnDlMd = document.getElementById('btn-dl-md');
        this.btnNew = document.getElementById('btn-new-convert');

        this.currentMarkdown = '';
        this.currentRagChunks = [];

        this.initEvents();
    }

    initEvents() {
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.tabBtns.forEach(b => b.classList.remove('active'));
                this.tabPanes.forEach(p => p.classList.remove('active'));
                
                const targetId = e.target.getAttribute('data-target');
                e.target.classList.add('active');
                document.getElementById(targetId).classList.add('active');
            });
        });

        this.btnCopy.addEventListener('click', () => {
            copyToClipboard(this.currentMarkdown);
        });

        this.btnDlMd.addEventListener('click', () => {
            if (this.currentResult && this.currentResult.output_url) {
                window.open(this.currentResult.output_url, '_blank');
            } else {
                this.downloadFile(this.currentMarkdown, 'document.md', 'text/markdown');
            }
        });

        this.btnDlRag.addEventListener('click', () => {
            if (this.currentResult && this.currentResult.chunks_url) {
                window.open(this.currentResult.chunks_url, '_blank');
            } else {
                this.downloadFile(JSON.stringify(this.currentRagChunks, null, 2), 'rag_chunks.json', 'application/json');
            }
        });
    }

    setResult(markdown, ragChunks, useRag, result = null) {
        this.currentMarkdown = markdown;
        this.currentResult = result;
        this.currentRagChunks = ragChunks;

        this.rawTextarea.value = markdown;
        this.previewTab.innerHTML = this.renderMarkdown(markdown);

        if (useRag && ragChunks.length > 0) {
            this.tabRagBtn.classList.remove('hidden');
            this.btnDlRag.classList.remove('hidden');
            this.renderRagChunks(ragChunks);
        } else {
            this.tabRagBtn.classList.add('hidden');
            this.btnDlRag.classList.add('hidden');
        }

        // Reset to preview tab
        this.tabBtns[0].click();
    }

    renderRagChunks(chunks) {
        this.ragContainer.innerHTML = chunks.map((chunk, index) => {
            const meta = chunk.metadata || {};
            const headingPath = (meta.heading_path || []).join(' › ');
            const content = chunk.content || chunk.text || '';
            const source = meta.source || 'unknown';
            const chunkIdx = meta.chunk_index || (index + 1);
            const total = meta.total_chunks || chunks.length;
            return `
            <div class="rag-card fade-in" style="animation-delay: ${index * 0.05}s">
                <div class="rag-meta">
                    <span>Chunk ${chunkIdx}/${total}</span>
                    <span>📄 ${escapeHtml(source)}</span>
                    ${headingPath ? `<span>📑 ${escapeHtml(headingPath)}</span>` : ''}
                </div>
                <div class="rag-content">${escapeHtml(content.substring(0, 500))}${content.length > 500 ? '...' : ''}</div>
            </div>`;
        }).join('');
    }

    renderMarkdown(md) {
        let html = md
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em>$1</em>')
            .replace(/```(.*?)```/gims, '<pre><code>$1</code></pre>')
            .replace(/`(.*?)`/gim, '<code>$1</code>')
            .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
            .replace(/\n$/gim, '<br />');

        html = html.split('\n\n').map(p => {
            if (p.trim().startsWith('<h') || p.trim().startsWith('<pre')) return p;
            return `<p>${p}</p>`;
        }).join('');

        html = html.replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>')
                   .replace(/<\/ul>\n<ul>/gim, '\n');

        return html;
    }

    downloadFile(content, filename, type) {
        const blob = new Blob([content], { type: type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
