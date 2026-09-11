class App {
    constructor() {
        this.sections = {
            upload: document.getElementById('upload-section'),
            options: document.getElementById('options-section'),
            progress: document.getElementById('progress-section'),
            result: document.getElementById('result-section')
        };

        // Initialize i18n
        if (window.i18n) {
            window.i18n.init();
        }

        this.uploader = new FileUploader();
        this.settings = new SettingsManager();
        this.converter = new ConversionManager(this);
        this.preview = new PreviewManager();

        this.initEvents();
        this.initToggleBadges();
    }

    initEvents() {
        document.addEventListener('files-changed', (e) => {
            const files = e.detail.files;
            if (files.length > 0) {
                this.sections.options.classList.remove('hidden');
            } else {
                this.sections.options.classList.add('hidden');
            }
        });

        document.getElementById('btn-new-convert').addEventListener('click', () => {
            this.resetApp();
        });
    }

    initToggleBadges() {
        const updateBadge = (toggleId, badgeId) => {
            const toggle = document.getElementById(toggleId);
            const badge = document.getElementById(badgeId);
            if (toggle && badge) {
                const isOn = toggle.checked;
                badge.textContent = isOn ? window.t('badge_on', 'เปิด') : window.t('badge_off', 'ปิด');
                badge.className = `toggle-status-badge ${isOn ? 'badge-on' : 'badge-off'}`;
            }
        };

        const toggles = [
            { toggleId: 'toggle-ocr', badgeId: 'badge-ocr' },
            { toggleId: 'toggle-force-ocr', badgeId: 'badge-force-ocr' },
            { toggleId: 'toggle-llm', badgeId: 'badge-llm' },
            { toggleId: 'toggle-rag', badgeId: 'badge-rag' }
        ];

        toggles.forEach(({ toggleId, badgeId }) => {
            const el = document.getElementById(toggleId);
            if (el) {
                el.addEventListener('change', () => updateBadge(toggleId, badgeId));
                updateBadge(toggleId, badgeId);
            }
        });

        document.addEventListener('lang-changed', () => {
            toggles.forEach(({ toggleId, badgeId }) => updateBadge(toggleId, badgeId));
        });
    }

    showSection(sectionId) {
        Object.values(this.sections).forEach(sec => sec.classList.add('hidden'));
        
        const key = sectionId.replace('-section', '');
        if (this.sections[key]) {
            this.sections[key].classList.remove('hidden');
        }
    }

    resetApp() {
        this.uploader.clear();
        this.sections.upload.classList.remove('hidden');
        this.sections.options.classList.add('hidden');
        this.sections.progress.classList.add('hidden');
        this.sections.result.classList.add('hidden');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();

    // Query params for automated testing / preview
    const params = new URLSearchParams(window.location.search);
    if (params.get('modal') === 'settings') {
        window.app.settings.openModal();
    }
    if (params.get('section') === 'progress') {
        window.app.showSection('progress-section');
        document.getElementById('step-upload').className = 'step done';
        document.getElementById('step-convert').className = 'step active';
        document.getElementById('step-llm').className = 'step';
        document.getElementById('step-rag').className = 'step';
        document.getElementById('step-done').className = 'step';
        document.getElementById('progress-bar').style.width = '45%';
        document.getElementById('progress-status-text').textContent = 'กำลังแปลงเอกสารด้วย Docling...';
    }
});
