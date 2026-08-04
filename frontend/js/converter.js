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
            showToast('กรุณาเลือกไฟล์ก่อน', 'warning');
            return;
        }

        const engine = document.querySelector('input[name="engine"]:checked').value;
        const useLlm = document.getElementById('toggle-llm').checked;
        const useRag = document.getElementById('toggle-rag').checked;

        this.app.showSection('progress-section');
        this.resetProgress();
        this.btnStart.disabled = true;

        try {
            // Process each file
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                this.log(`📄 กำลังประมวลผลไฟล์: ${file.name} (${i + 1}/${files.length})`);

                // 1. Upload step
                this.setStep('upload', 10, `กำลังอัปโหลด ${file.name}...`);

                const formData = new FormData();
                formData.append('file', file);
                formData.append('engine', engine);
                formData.append('llm_enabled', useLlm.toString());
                formData.append('rag_mode', useRag.toString());

                // If LLM is enabled, update backend settings first
                if (useLlm) {
                    const llmSettings = this.app.settings.getSettings();
                    try {
                        await fetch('/api/llm/settings', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                base_url: llmSettings.url || 'http://localhost:11434/v1',
                                model: llmSettings.model || 'llama3.1',
                                api_key: llmSettings.apiKey || 'ollama',
                                enabled: true,
                                temperature: llmSettings.temperature || 0.3,
                                system_prompt: ''
                            })
                        });
                    } catch (e) {
                        this.log('⚠️ ไม่สามารถอัพเดตการตั้งค่า LLM ได้');
                    }
                }

                // 2. Convert step
                this.setStep('convert', 30, `กำลังแปลงไฟล์ด้วย ${engine}...`);

                let response;
                try {
                    response = await fetch('/api/convert', {
                        method: 'POST',
                        body: formData
                    });
                } catch (fetchError) {
                    throw new Error(`ไม่สามารถเชื่อมต่อ server ได้: ${fetchError.message}`);
                }

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.detail || `Server error: ${response.status}`);
                }

                const result = await response.json();
                this.currentTaskId = result.task_id;
                this.log(`✅ แปลงไฟล์สำเร็จด้วย ${result.engine}`);

                // 3. LLM step
                if (useLlm) {
                    this.setStep('llm', 70, 'กำลังใช้ LLM ปรับปรุงข้อความภาษาไทย...');
                    this.log('🤖 LLM กำลังแก้ไขสระ วรรณยุกต์ที่ผิดตำแหน่ง...');
                } else {
                    this.steps.llm.classList.add('done');
                }

                // 4. RAG step
                if (useRag) {
                    this.setStep('rag', 90, 'กำลังแบ่ง Chunks สำหรับ RAG...');
                    this.log('📦 แบ่ง Markdown เป็น chunks พร้อม metadata');
                } else {
                    this.steps.rag.classList.add('done');
                }

                // 5. Fetch results
                this.setStep('done', 100, 'เสร็จสิ้น!');

                // Download the markdown content
                let markdown = '';
                try {
                    const mdResponse = await fetch(result.output_url);
                    if (mdResponse.ok) {
                        markdown = await mdResponse.text();
                    }
                } catch (e) {
                    this.log('⚠️ ไม่สามารถโหลดผลลัพธ์ Markdown ได้');
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
                        this.log('⚠️ ไม่สามารถโหลด RAG chunks ได้');
                    }
                }

                this.log('🎉 ทำงานเสร็จสมบูรณ์');

                // Show results
                this.app.preview.setResult(markdown, ragChunks, useRag, result);
                this.app.showSection('result-section');
            }

        } catch (error) {
            this.statusText.textContent = 'เกิดข้อผิดพลาด';
            this.log(`❌ Error: ${error.message}`);
            showToast(`เกิดข้อผิดพลาด: ${error.message}`, 'error');
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
        const time = new Date().toLocaleTimeString('th-TH');
        this.logOutput.textContent += `[${time}] ${msg}\n`;
        this.logOutput.scrollTop = this.logOutput.scrollHeight;
    }
}

