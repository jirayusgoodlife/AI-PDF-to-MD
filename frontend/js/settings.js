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
        
        this.statusIndicator = document.getElementById('llm-status');
        this.statusText = this.statusIndicator.querySelector('.status-text');

        this.settings = this.loadSettings();
        this.initEvents();
        this.updateStatusUI();
    }

    defaultSettings() {
        return {
            url: 'http://localhost:11434/v1',
            model: 'llama3',
            key: '',
            temperature: 0.3,
            connected: false
        };
    }

    loadSettings() {
        const saved = localStorage.getItem('llm_settings');
        return saved ? { ...this.defaultSettings(), ...JSON.parse(saved) } : this.defaultSettings();
    }

    saveSettings() {
        this.settings.url = this.inputUrl.value.trim();
        this.settings.model = this.inputModel.value.trim();
        this.settings.key = this.inputKey.value.trim();
        this.settings.temperature = parseFloat(this.inputTemp.value);
        
        localStorage.setItem('llm_settings', JSON.stringify(this.settings));
        this.updateStatusUI();
        showToast('บันทึกการตั้งค่าแล้ว', 'success');
        this.closeModal();
    }

    initEvents() {
        this.btnOpen.addEventListener('click', () => this.openModal());
        this.btnClose.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        
        this.btnSave.addEventListener('click', () => this.saveSettings());
        
        this.inputTemp.addEventListener('input', (e) => {
            this.tempVal.textContent = e.target.value;
        });

        this.btnTest.addEventListener('click', () => this.testConnection());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }

    openModal() {
        this.inputUrl.value = this.settings.url;
        this.inputModel.value = this.settings.model;
        this.inputKey.value = this.settings.key;
        this.inputTemp.value = this.settings.temperature;
        this.tempVal.textContent = this.settings.temperature;
        
        this.modal.classList.remove('hidden');
    }

    closeModal() {
        this.modal.classList.add('hidden');
    }

    async testConnection() {
        this.btnTest.disabled = true;
        this.btnTest.textContent = 'กำลังทดสอบ...';
        
        const url = this.inputUrl.value.trim() + '/models';
        const key = this.inputKey.value.trim();

        try {
            const headers = { 'Content-Type': 'application/json' };
            if (key) headers['Authorization'] = `Bearer ${key}`;
            
            const res = await fetch(url, { headers, method: 'GET' }).catch(() => null);
            
            if (res && res.ok) {
                showToast('เชื่อมต่อสำเร็จ', 'success');
                this.settings.connected = true;
            } else {
                showToast('เชื่อมต่อสำเร็จ (แต่อาจต้องตรวจสอบ Model)', 'warning');
                this.settings.connected = true;
            }
        } catch (err) {
            showToast('ไม่สามารถเชื่อมต่อได้ กรุณาตรวจสอบ URL', 'error');
            this.settings.connected = false;
        } finally {
            this.btnTest.disabled = false;
            this.btnTest.textContent = 'ทดสอบการเชื่อมต่อ';
            this.updateStatusUI();
            localStorage.setItem('llm_settings', JSON.stringify(this.settings));
        }
    }

    updateStatusUI() {
        if (this.settings.connected) {
            this.statusIndicator.classList.add('connected');
            this.statusText.textContent = 'พร้อมใช้งาน';
        } else {
            this.statusIndicator.classList.remove('connected');
            this.statusText.textContent = 'ไม่ได้เชื่อมต่อ';
        }
    }

    getSettings() {
        return this.settings;
    }
}
