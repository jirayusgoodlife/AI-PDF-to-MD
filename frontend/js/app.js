class App {
    constructor() {
        this.sections = {
            upload: document.getElementById('upload-section'),
            options: document.getElementById('options-section'),
            progress: document.getElementById('progress-section'),
            result: document.getElementById('result-section')
        };

        this.uploader = new FileUploader();
        this.settings = new SettingsManager();
        this.converter = new ConversionManager(this);
        this.preview = new PreviewManager();

        this.initEvents();
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

    showSection(sectionId) {
        Object.values(this.sections).forEach(sec => sec.classList.add('hidden'));
        
        // Because the keys are upload, options, progress, result
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
});
