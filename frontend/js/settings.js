class SettingsManager {
    constructor() {
        this.modal = document.getElementById('settings-modal');
        this.btnOpen = document.getElementById('btn-settings');
        this.btnClose = document.getElementById('btn-close-settings');
        this.btnSave = document.getElementById('btn-save-settings');
        this.btnTest = document.getElementById('btn-test-llm');
        
        this.inputUrl = document.getElementById('llm-url');
        this.inputModel = document.getElementById('llm-model');
        this.inputKey = document.getElementById('llm-key');
        this.inputTemp = document.getElementById('llm-temp');
        this.tempVal = document.getElementById('temp-val');
        this.inputPrompt = document.getElementById('llm-prompt');
        this.btnResetPrompt = document.getElementById('btn-reset-prompt');
        
        this.statusIndicator = document.getElementById('llm-status');
        this.statusText = this.statusIndicator.querySelector('.status-text');

        this.settings = this.loadSettings();
        this.initEvents();
        
        // Auto-check and sync with backend on startup
        this.syncWithBackend();
    }

    getDefaultPrompt() {
        return `คุณเป็นผู้เชี่ยวชาญด้านการประมวลผลเอกสารภาษาไทยและ RAG (Retrieval-Augmented Generation) ทำหน้าที่ตรวจทาน ทำความสะอาด (Data Cleansing) และแก้ไขข้อความภาษาไทยที่ได้จากการแปลงเอกสาร (OCR/PDF extraction) ให้เป็น Markdown ที่สมบูรณ์

ภารกิจและการทำความสะอาดข้อมูล (Cleansing Rules):
1. แก้ไขคำผิด สระ และวรรณยุกต์: แก้ไขตำแหน่งสระ/วรรณยุกต์ที่ลอย จม หรือสลับตำแหน่ง (เช่น 'เพียน' → 'เพี้ยน', 'ข้อมลู' → 'ข้อมูล') และแก้ปัญหา font encoding ที่ทำให้อ่านไม่รู้เรื่อง
2. กำจัดข้อความหัวกระดาษ/ท้ายกระดาษ และเลขหน้า: ลบ Header, Footer, เลขหน้า (เช่น 'หน้า 1 จาก 10', 'Page 1 of 5', ชื่อเอกสารหรือรหัสเอกสารที่ขึ้นซ้ำๆ ทุกหน้า) ซึ่งเป็นขยะที่ไม่จำเป็นต่อการทำ RAG
3. กำจัดจุดไข่ปลาและเส้นประซ้ำซ้อน: ลบจุดไข่ปลา เส้นประ หรือขีดเส้นใต้ที่ใช้ในแบบฟอร์มหรือสารบัญ (เช่น '....................', '-----------', '_ _ _ _ _ _') ให้เหลือเฉพาะเนื้อหาข้อความสำคัญ
4. จัดการการเว้นวรรคที่ผิดปกติ (Spacing Normalization):
   - แก้ไขตัวอักษรหรือคำภาษาไทยที่ถูกเว้นวรรคกระจัดกระจายผิดธรรมชาติจากการจัดหน้าแบบ Justify (เช่น 'ก า ร ท ด ส อ บ' → 'การทดสอบ', 'ข้อ ความ' → 'ข้อความ')
   - ลบช่องว่างที่เว้นวรรคติดกันเกินความจำเป็น (หลาย space ติดกัน) ให้เหลือช่องว่างเดียว
5. รักษาโครงสร้าง Markdown ที่มีประโยชน์: คงโครงสร้าง Heading (#, ##), ตาราง (Table), รายการ (List/Bullet), ลิงก์, โค้ดบล็อก ไว้ให้สมบูรณ์และถูกต้องตามมาตรฐาน Markdown
6. ไม่แต่งเติมเนื้อหา: ห้ามแต่งเติมเนื้อหาใหม่ ห้ามแปลภาษา และรักษาความหมายเดิมของเอกสารไว้ครบถ้วน
7. ห้ามใส่ markdown code block (\`\`\`) ครอบข้อความผลลัพธ์ทั้งหมด ให้ส่งคืนเฉพาะเนื้อหาข้อความ Markdown ที่ทำความสะอาดแล้วเท่านั้น`;
    }

    defaultSettings() {
        return {
            url: 'http://localhost:11434/v1',
            model: 'llama3',
            key: '',
            temperature: 0.3,
            systemPrompt: this.getDefaultPrompt(),
            connected: false
        };
    }

    loadSettings() {
        const saved = localStorage.getItem('llm_settings');
        return saved ? { ...this.defaultSettings(), ...JSON.parse(saved) } : this.defaultSettings();
    }

    async syncWithBackend() {
        // Set checking state
        this.statusIndicator.classList.remove('connected');
        this.statusIndicator.classList.add('checking');
        if (window.t) {
            this.statusText.textContent = window.t('status_checking');
        }

        try {
            // 1. Fetch current backend LLM settings
            const settingsRes = await fetch('/api/llm/settings');
            if (settingsRes.ok) {
                const backendSettings = await settingsRes.json();
                // If user doesn't have custom localStorage override, use backend defaults
                if (!localStorage.getItem('llm_settings_custom') && backendSettings.base_url) {
                    this.settings.url = backendSettings.base_url;
                    this.settings.model = backendSettings.model || this.settings.model;
                    this.settings.key = backendSettings.api_key || '';
                }
                if (backendSettings.system_prompt && !this.settings.systemPrompt) {
                    this.settings.systemPrompt = backendSettings.system_prompt;
                }
            }

            // 2. Fetch backend LLM connection status
            const statusRes = await fetch('/api/llm/status');
            if (statusRes.ok) {
                const statusData = await statusRes.json();
                this.settings.connected = Boolean(statusData.connected);
                if (statusData.model) {
                    this.settings.backendModel = statusData.model;
                }
            } else {
                this.settings.connected = false;
            }
        } catch (err) {
            console.warn('Failed to auto-sync LLM status from backend:', err);
            this.settings.connected = false;
        } finally {
            this.statusIndicator.classList.remove('checking');
            this.updateStatusUI();
            localStorage.setItem('llm_settings', JSON.stringify(this.settings));
        }
    }

    async saveSettings() {
        this.settings.url = this.inputUrl.value.trim();
        this.settings.model = this.inputModel.value.trim();
        this.settings.key = this.inputKey.value.trim();
        this.settings.temperature = parseFloat(this.inputTemp.value);
        this.settings.systemPrompt = this.inputPrompt ? this.inputPrompt.value.trim() : (this.settings.systemPrompt || this.getDefaultPrompt());
        
        localStorage.setItem('llm_settings', JSON.stringify(this.settings));
        localStorage.setItem('llm_settings_custom', 'true');

        // Sync settings to backend
        try {
            await fetch('/api/llm/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    base_url: this.settings.url,
                    model: this.settings.model,
                    api_key: this.settings.key,
                    enabled: true,
                    temperature: this.settings.temperature,
                    system_prompt: this.settings.systemPrompt
                })
            });
        } catch (e) {
            console.warn('Could not sync to backend:', e);
        }

        showToast(window.t ? window.t('toast_saved') : 'บันทึกการตั้งค่าแล้ว', 'success');
        this.closeModal();
        this.syncWithBackend();
    }

    initEvents() {
        this.btnOpen.addEventListener('click', () => this.openModal());
        this.btnClose.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        
        this.btnSave.addEventListener('click', () => this.saveSettings());
        
        if (this.btnResetPrompt) {
            this.btnResetPrompt.addEventListener('click', () => this.resetPrompt());
        }

        this.inputTemp.addEventListener('input', (e) => {
            this.tempVal.textContent = e.target.value;
        });

        this.btnTest.addEventListener('click', () => this.testConnection());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });

        document.addEventListener('lang-changed', () => {
            this.updateStatusUI();
        });
    }

    resetPrompt() {
        if (this.inputPrompt) {
            this.inputPrompt.value = this.getDefaultPrompt();
        }
        showToast(window.t ? window.t('toast_prompt_reset') : 'คืนค่า System Prompt เริ่มต้นแล้ว', 'info');
    }

    openModal() {
        this.inputUrl.value = this.settings.url;
        this.inputModel.value = this.settings.model;
        this.inputKey.value = this.settings.key;
        this.inputTemp.value = this.settings.temperature;
        this.tempVal.textContent = this.settings.temperature;
        if (this.inputPrompt) {
            this.inputPrompt.value = this.settings.systemPrompt || this.getDefaultPrompt();
        }
        
        this.modal.classList.remove('hidden');
    }

    closeModal() {
        this.modal.classList.add('hidden');
    }

    async testConnection() {
        this.btnTest.disabled = true;
        this.btnTest.textContent = window.t ? window.t('btn_testing_llm') : 'กำลังทดสอบ...';
        
        const url = this.inputUrl.value.trim();
        const model = this.inputModel.value.trim();
        const key = this.inputKey.value.trim();

        try {
            // First update backend with the test settings
            await fetch('/api/llm/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    base_url: url,
                    model: model,
                    api_key: key,
                    enabled: true
                })
            });

            // Now check status via backend (avoids browser CORS issues)
            const res = await fetch('/api/llm/status');
            const data = await res.json();
            
            if (data && data.connected) {
                showToast(window.t ? window.t('toast_conn_success') : 'เชื่อมต่อสำเร็จ', 'success');
                this.settings.connected = true;
            } else {
                const errMsg = data && data.error ? `: ${data.error}` : '';
                showToast((window.t ? window.t('toast_conn_failed') : 'ไม่สามารถเชื่อมต่อได้') + errMsg, 'error');
                this.settings.connected = false;
            }
        } catch (err) {
            showToast(window.t ? window.t('toast_conn_failed') : 'ไม่สามารถเชื่อมต่อได้ กรุณาตรวจสอบ URL', 'error');
            this.settings.connected = false;
        } finally {
            this.btnTest.disabled = false;
            this.btnTest.textContent = window.t ? window.t('btn_test_llm') : 'ทดสอบการเชื่อมต่อ';
            this.updateStatusUI();
            localStorage.setItem('llm_settings', JSON.stringify(this.settings));
        }
    }

    updateStatusUI() {
        if (this.settings.connected) {
            this.statusIndicator.classList.add('connected');
            this.statusIndicator.classList.remove('checking');
            const connectedText = window.t ? window.t('status_connected') : 'เชื่อมต่อกับ LLM แล้ว';
            this.statusText.textContent = connectedText;
        } else {
            this.statusIndicator.classList.remove('connected');
            const disconnectedText = window.t ? window.t('status_disconnected') : 'ยังไม่ได้เชื่อมต่อกับ LLM';
            this.statusText.textContent = disconnectedText;
        }
    }

    getSettings() {
        return this.settings;
    }
}
