class ConversionManager {
    constructor(app) {
        this.app = app;
        this.btnStart = document.getElementById('btn-start-convert');
        this.progressBar = document.getElementById('progress-bar');
        this.statusText = document.getElementById('progress-status-text');
        this.logOutput = document.getElementById('log-output');
        this.currentTaskId = null;
        
        this.steps = {
            upload: document.getElementById('step-upload'),
            convert: document.getElementById('step-convert'),
            llm: document.getElementById('step-llm'),
            rag: document.getElementById('step-rag'),
            done: document.getElementById('step-done')
        };

        this.initEvents();
    }

    initEvents() {
        this.btnStart.addEventListener('click', () => this.startConversion());
    }

    async startConversion() {
        const files = this.app.uploader.getFiles();
        if (files.length === 0) {
            showToast(window.t ? window.t('toast_select_file') : 'กรุณาเลือกไฟล์ก่อน', 'warning');
            return;
        }

        const engine = document.querySelector('input[name="engine"]:checked').value;
        const useOcr = document.getElementById('toggle-ocr') ? document.getElementById('toggle-ocr').checked : true;
        const forceOcr = document.getElementById('toggle-force-ocr') ? document.getElementById('toggle-force-ocr').checked : false;
        const useLlm = document.getElementById('toggle-llm').checked;
        const useRag = document.getElementById('toggle-rag').checked;

        this.app.showSection('progress-section');
        this.resetProgress();
        this.btnStart.disabled = true;

        try {
            // Process each file
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const prefix = window.t ? window.t('log_processing') : '📄 กำลังประมวลผลไฟล์';
                this.log(`${prefix}: ${file.name} (${i + 1}/${files.length})`);

                // 1. Upload step
                const uploadMsg = window.t ? `${window.t('log_uploading')} ${file.name}...` : `กำลังอัปโหลด ${file.name}...`;
                this.setStep('upload', 10, uploadMsg);

                const llmSettings = this.app.settings.getSettings();

                const formData = new FormData();
                formData.append('file', file);
                formData.append('engine', engine);
                formData.append('ocr_enabled', useOcr.toString());
                formData.append('force_ocr', forceOcr.toString());
                formData.append('llm_enabled', useLlm.toString());
                formData.append('rag_mode', useRag.toString());
                if (useLlm && llmSettings.systemPrompt) {
                    formData.append('system_prompt', llmSettings.systemPrompt);
                }

                // If LLM is enabled and user has custom settings, sync to backend
                if (useLlm && localStorage.getItem('llm_settings_custom')) {
                    try {
                        await fetch('/api/llm/settings', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                base_url: llmSettings.url,
                                model: llmSettings.model,
                                api_key: llmSettings.key || '',
                                enabled: true,
                                temperature: llmSettings.temperature || 0.3,
                                system_prompt: llmSettings.systemPrompt || ''
                            })
                        });
                    } catch (e) {
                        this.log('⚠️ Could not sync LLM settings to server');
                    }
                }

                // 2. Convert step
                const convertMsg = window.t ? `${window.t('log_converting')} ${engine}...` : `กำลังแปลงไฟล์ด้วย ${engine}...`;
                this.setStep('convert', 30, convertMsg);

                let response;
                try {
                    response = await fetch('/api/convert', {
                        method: 'POST',
                        body: formData
                    });
                } catch (fetchError) {
                    throw new Error(`Connection error: ${fetchError.message}`);
                }

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.detail || `Server error: ${response.status}`);
                }

                const result = await response.json();
                this.currentTaskId = result.task_id;
                this.log(`✅ Converted with ${result.engine}`);

                // 3. LLM step
                if (useLlm) {
                    const llmMsg = window.t ? window.t('log_correcting') : 'กำลังแก้ไขข้อความด้วย LLM...';
                    this.setStep('llm', 70, llmMsg);
                    this.log(`🤖 ${llmMsg}`);
                } else {
                    this.steps.llm.classList.add('done');
                }

                // 4. RAG step
                if (useRag) {
                    const ragMsg = window.t ? window.t('log_chunking') : 'กำลังแบ่ง Chunks สำหรับ RAG...';
                    this.setStep('rag', 90, ragMsg);
                    this.log(`📦 ${ragMsg}`);
                } else {
                    this.steps.rag.classList.add('done');
                }

                // 5. Fetch results
                const doneMsg = window.t ? window.t('log_done') : 'เสร็จสิ้น!';
                this.setStep('done', 100, doneMsg);

                // Download the markdown content
                let markdown = '';
                try {
                    const mdResponse = await fetch(result.output_url);
                    if (mdResponse.ok) {
                        markdown = await mdResponse.text();
                    }
                } catch (e) {
                    this.log('⚠️ Could not load output markdown');
                }

                // Download RAG chunks if available
                let ragChunks = [];
                if (useRag && result.chunks_url) {
                    try {
                        const ragResponse = await fetch(result.chunks_url);
                        if (ragResponse.ok) {
                            const ragData = await ragResponse.json();
                            ragChunks = ragData.chunks || [];
                        }
                    } catch (e) {
                        this.log('⚠️ Could not load RAG chunks');
                    }
                }

                this.log('🎉 ' + (window.t ? window.t('toast_convert_success') : 'สำเร็จเรียบร้อย'));

                // Show results
                this.app.preview.setResult(markdown, ragChunks, useRag, result);
                this.app.showSection('result-section');
            }

        } catch (error) {
            this.statusText.textContent = window.t ? window.t('toast_convert_failed') : 'เกิดข้อผิดพลาด';
            this.log(`❌ Error: ${error.message}`);
            showToast(`${window.t ? window.t('toast_convert_failed') : 'เกิดข้อผิดพลาด'}: ${error.message}`, 'error');
        } finally {
            this.btnStart.disabled = false;
        }
    }

    setStep(stepName, percent, text) {
        Object.keys(this.steps).forEach(k => {
            this.steps[k].classList.remove('active');
        });
        
        let found = false;
        Object.keys(this.steps).forEach(k => {
            if (!found) this.steps[k].classList.add('done');
            if (k === stepName) {
                found = true;
                this.steps[k].classList.remove('done');
                this.steps[k].classList.add('active');
            }
        });

        this.progressBar.style.width = `${percent}%`;
        this.statusText.textContent = text;
    }

    resetProgress() {
        this.progressBar.style.width = '0%';
        this.logOutput.textContent = '';
        this.currentTaskId = null;
        Object.values(this.steps).forEach(el => {
            el.classList.remove('active', 'done');
        });
        this.steps.upload.classList.add('active');
    }

    log(msg) {
        const time = new Date().toLocaleTimeString();
        this.logOutput.textContent += `[${time}] ${msg}\n`;
        this.logOutput.scrollTop = this.logOutput.scrollHeight;
    }
}
