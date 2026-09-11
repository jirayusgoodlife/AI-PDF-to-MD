class FileUploader {
    constructor() {
        this.dropZone = document.getElementById('drop-zone');
        this.fileInput = document.getElementById('file-input');
        this.fileListContainer = document.getElementById('file-list-container');
        this.fileList = document.getElementById('file-list');
        this.btnAddMore = document.getElementById('btn-add-more');
        
        this.files = [];
        this.maxSize = 100 * 1024 * 1024; // 100MB
        this.allowedTypes = [
            '.pdf', '.docx', '.doc', '.pptx', '.ppt', '.xlsx', '.xls',
            '.png', '.jpg', '.jpeg', '.webp', '.tiff', '.tif', '.bmp'
        ];

        this.initEvents();
    }

    initEvents() {
        this.dropZone.addEventListener('click', () => this.fileInput.click());
        
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('drag-over');
        });
        
        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.classList.remove('drag-over');
        });
        
        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('drag-over');
            if (e.dataTransfer.files.length) {
                this.handleFiles(Array.from(e.dataTransfer.files));
            }
        });
        
        this.fileInput.addEventListener('change', () => {
            if (this.fileInput.files.length) {
                this.handleFiles(Array.from(this.fileInput.files));
            }
            this.fileInput.value = ''; // reset
        });

        this.btnAddMore.addEventListener('click', () => this.fileInput.click());
    }

    handleFiles(newFiles) {
        let added = 0;
        
        newFiles.forEach(file => {
            if (file.size > this.maxSize) {
                const msg = window.t ? `${file.name} ${window.t('toast_file_too_large')}` : `ไฟล์ ${file.name} มีขนาดใหญ่เกินไป (สูงสุด 100MB)`;
                showToast(msg, 'error');
                return;
            }
            
            const ext = ('.' + getFileExtension(file.name)).toLowerCase();
            const isImage = (file.type && file.type.startsWith('image/')) || 
                            ['.png', '.jpg', '.jpeg', '.webp', '.tiff', '.tif', '.bmp', '.gif'].includes(ext);
            const isAllowed = isImage || this.allowedTypes.includes(ext);

            if (!isAllowed) {
                const msg = window.t ? `${window.t('toast_file_not_supported')} ${ext}` : `ไม่รองรับประเภทไฟล์ ${ext}`;
                showToast(msg, 'error');
                return;
            }
            
            if (this.files.find(f => f.name === file.name && f.size === file.size)) {
                return;
            }
            
            this.files.push(file);
            added++;
        });

        if (added > 0) {
            this.renderFileList();
            this.emitChange();
        }
    }

    removeFile(index) {
        this.files.splice(index, 1);
        this.renderFileList();
        this.emitChange();
    }

    renderFileList() {
        this.fileList.innerHTML = '';
        
        if (this.files.length === 0) {
            this.fileListContainer.classList.add('hidden');
            this.dropZone.classList.remove('hidden');
            return;
        }

        this.dropZone.classList.add('hidden');
        this.fileListContainer.classList.remove('hidden');

        this.files.forEach((file, index) => {
            const li = document.createElement('li');
            li.className = 'file-item fade-in';
            li.innerHTML = `
                <div class="file-item-icon">${getFileIcon(file.name)}</div>
                <div class="file-item-info">
                    <div class="file-item-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</div>
                    <div class="file-item-size">${formatFileSize(file.size)}</div>
                </div>
                <button class="btn-remove" data-index="${index}" title="ลบไฟล์">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                </button>
            `;
            this.fileList.appendChild(li);
        });

        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                this.removeFile(index);
            });
        });
    }

    emitChange() {
        document.dispatchEvent(new CustomEvent('files-changed', { detail: { files: this.files } }));
    }

    getFiles() {
        return this.files;
    }

    clear() {
        this.files = [];
        this.renderFileList();
        this.emitChange();
    }
}
