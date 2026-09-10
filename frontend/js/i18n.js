// Multi-language (i18n) Module for if-doc2md
const translations = {
    th: {
        app_name: "if-doc2md",
        tagline: "แปลงเอกสารเป็น Markdown สำหรับ RAG",
        status_disconnected: "ยังไม่ได้เชื่อมต่อกับ LLM",
        status_connected: "เชื่อมต่อกับ LLM แล้ว",
        status_checking: "กำลังตรวจสอบ...",
        settings_btn_title: "ตั้งค่า",
        api_docs_title: "เอกสาร API (Swagger)",
        
        // Upload Section
        drop_title: "ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์",
        drop_desc: "รองรับ PDF, Word, PowerPoint, Excel (สูงสุด 100MB)",
        file_list_title: "รายการไฟล์ที่เลือก",
        add_more_files: "+ เพิ่มไฟล์",
        
        // Options Section
        options_title: "การตั้งค่าการแปลง",
        engine_label: "เอนจินการแปลง",
        docling_title: "Docling (แนะนำ)",
        docling_desc: "รองรับทุกไฟล์ แม่นยำสูง",
        marker_title: "Marker",
        marker_desc: "สำหรับ PDF เท่านั้น",
        toggle_llm_label: "ใช้ LLM แก้ไขภาษาไทย",
        toggle_rag_label: "แบ่ง Chunks สำหรับ RAG",
        badge_on: "เปิด",
        badge_off: "ปิด",
        btn_convert: "เริ่มแปลงเอกสาร",
        
        // Progress Section
        progress_title: "กำลังดำเนินการ",
        step_upload: "อัปโหลด",
        step_convert: "แปลงเอกสาร",
        step_llm: "แก้ไขข้อความ",
        step_rag: "แบ่ง Chunks",
        step_done: "เสร็จสิ้น",
        preparing: "กำลังเตรียมการ...",
        log_processing: "📄 กำลังประมวลผลไฟล์",
        log_uploading: "กำลังอัปโหลด",
        log_converting: "กำลังแปลงด้วย",
        log_correcting: "กำลังแก้ไขข้อความด้วย LLM...",
        log_chunking: "กำลังแบ่ง Chunks สำหรับ RAG...",
        log_done: "แปลงไฟล์สำเร็จเรียบร้อย",
        
        // Result Section
        result_title: "ผลลัพธ์การแปลง",
        tab_preview: "ตัวอย่าง Markdown",
        tab_raw: "Markdown ดิบ",
        tab_rag: "RAG Chunks",
        btn_copy_md: "คัดลอก Markdown",
        btn_download_md: "ดาวน์โหลด .md",
        btn_download_rag: "ดาวน์โหลด Chunks JSON",
        btn_new_convert: "แปลงไฟล์ใหม่",
        
        // Settings Modal
        modal_title: "การตั้งค่า LLM Server",
        llm_url_label: "API URL (OpenAI Compatible)",
        llm_model_label: "Model Name",
        llm_key_label: "API Key (ถ้ามี)",
        llm_temp_label: "Temperature",
        llm_prompt_label: "System Prompt (Cleansing & แก้ไขข้อความ RAG)",
        btn_reset_prompt: "คืนค่าเริ่มต้น",
        llm_prompt_hint: "ปรับแต่งคำสั่งลบ Header/Footer, เลขหน้า, จุดไข่ปลา (...), และการเว้นวรรคผิดปกติเพื่อเพิ่มคุณภาพ RAG",
        btn_test_llm: "ทดสอบการเชื่อมต่อ",
        btn_testing_llm: "กำลังทดสอบ...",
        btn_save_settings: "บันทึก",
        
        // Toasts
        toast_saved: "บันทึกการตั้งค่าแล้ว",
        toast_prompt_reset: "คืนค่า System Prompt เริ่มต้นแล้ว",
        toast_conn_success: "เชื่อมต่อสำเร็จ",
        toast_conn_warning: "เชื่อมต่อสำเร็จ (ตรวจสอบโมเดล)",
        toast_conn_failed: "ไม่สามารถเชื่อมต่อได้ กรุณาตรวจสอบ URL",
        toast_copied: "คัดลอกไปยังคลิปบอร์ดแล้ว",
        toast_copy_failed: "ไม่สามารถคัดลอกได้",
        toast_select_file: "กรุณาเลือกไฟล์ก่อน",
        toast_file_too_large: "มีขนาดใหญ่เกินไป (สูงสุด 100MB)",
        toast_file_not_supported: "ไม่รองรับประเภทไฟล์",
        toast_convert_success: "แปลงเอกสารสำเร็จแล้ว!",
        toast_convert_failed: "เกิดข้อผิดพลาดในการแปลงเอกสาร"
    },
    en: {
        app_name: "if-doc2md",
        tagline: "Convert Documents to Markdown for RAG",
        status_disconnected: "Not connected to LLM",
        status_connected: "Connected to LLM",
        status_checking: "Checking...",
        settings_btn_title: "Settings",
        api_docs_title: "API Documentation (Swagger)",
        
        // Upload Section
        drop_title: "Drag & drop files here, or click to browse",
        drop_desc: "Supports PDF, Word, PowerPoint, Excel (Max 100MB)",
        file_list_title: "Selected Files",
        add_more_files: "+ Add More Files",
        
        // Options Section
        options_title: "Conversion Settings",
        engine_label: "Conversion Engine",
        docling_title: "Docling (Recommended)",
        docling_desc: "All document formats, high accuracy",
        marker_title: "Marker",
        marker_desc: "PDF documents only",
        toggle_llm_label: "Enhance Thai Text with LLM",
        toggle_rag_label: "Split Chunks for RAG",
        badge_on: "ON",
        badge_off: "OFF",
        btn_convert: "Start Conversion",
        
        // Progress Section
        progress_title: "Processing",
        step_upload: "Upload",
        step_convert: "Convert",
        step_llm: "LLM Correction",
        step_rag: "RAG Chunks",
        step_done: "Completed",
        preparing: "Preparing...",
        log_processing: "📄 Processing file",
        log_uploading: "Uploading",
        log_converting: "Converting with",
        log_correcting: "Enhancing text with LLM...",
        log_chunking: "Splitting Chunks for RAG...",
        log_done: "File conversion completed",
        
        // Result Section
        result_title: "Conversion Results",
        tab_preview: "Markdown Preview",
        tab_raw: "Raw Markdown",
        tab_rag: "RAG Chunks",
        btn_copy_md: "Copy Markdown",
        btn_download_md: "Download .md",
        btn_download_rag: "Download Chunks JSON",
        btn_new_convert: "Convert Another File",
        
        // Settings Modal
        modal_title: "LLM Server Settings",
        llm_url_label: "API URL (OpenAI Compatible)",
        llm_model_label: "Model Name",
        llm_key_label: "API Key (Optional)",
        llm_temp_label: "Temperature",
        llm_prompt_label: "System Prompt (RAG Cleansing & Enhancement)",
        btn_reset_prompt: "Reset to Default",
        llm_prompt_hint: "Configure instructions to clean headers/footers, page numbers, repeated dots (...), and abnormal spacing for RAG",
        btn_test_llm: "Test Connection",
        btn_testing_llm: "Testing...",
        btn_save_settings: "Save",
        
        // Toasts
        toast_saved: "Settings saved successfully",
        toast_prompt_reset: "System Prompt restored to default",
        toast_conn_success: "Connected successfully",
        toast_conn_warning: "Connected (check model name)",
        toast_conn_failed: "Connection failed, please verify URL",
        toast_copied: "Copied to clipboard",
        toast_copy_failed: "Failed to copy",
        toast_select_file: "Please select files first",
        toast_file_too_large: "is too large (Max 100MB)",
        toast_file_not_supported: "Unsupported file format",
        toast_convert_success: "Conversion completed successfully!",
        toast_convert_failed: "Document conversion failed"
    }
};

class I18nManager {
    constructor() {
        this.currentLang = localStorage.getItem('app_lang') || 'th';
    }

    init() {
        this.applyLanguage(this.currentLang);
        this.bindEvents();
    }

    bindEvents() {
        const btnTh = document.getElementById('lang-th');
        const btnEn = document.getElementById('lang-en');

        if (btnTh) {
            btnTh.addEventListener('click', () => this.setLanguage('th'));
        }
        if (btnEn) {
            btnEn.addEventListener('click', () => this.setLanguage('en'));
        }
    }

    setLanguage(lang) {
        if (!translations[lang]) return;
        this.currentLang = lang;
        localStorage.setItem('app_lang', lang);
        this.applyLanguage(lang);
        
        // Trigger event so other components know language changed
        document.dispatchEvent(new CustomEvent('lang-changed', { detail: { lang } }));
    }

    applyLanguage(lang) {
        const dict = translations[lang] || translations.th;

        // Update active class on header buttons
        const btnTh = document.getElementById('lang-th');
        const btnEn = document.getElementById('lang-en');
        if (btnTh && btnEn) {
            if (lang === 'th') {
                btnTh.classList.add('active');
                btnEn.classList.remove('active');
            } else {
                btnEn.classList.add('active');
                btnTh.classList.remove('active');
            }
        }

        // Update elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.textContent = dict[key];
            }
        });

        // Update placeholders with data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (dict[key]) {
                el.setAttribute('placeholder', dict[key]);
            }
        });

        // Update title and aria-labels
        document.title = `${dict.app_name} | ${dict.tagline}`;
        const settingsBtn = document.getElementById('btn-settings');
        if (settingsBtn) {
            settingsBtn.setAttribute('aria-label', dict.settings_btn_title);
            settingsBtn.setAttribute('title', dict.settings_btn_title);
        }
        const apiDocsBtn = document.getElementById('btn-api-docs');
        if (apiDocsBtn) {
            apiDocsBtn.setAttribute('aria-label', dict.api_docs_title);
            apiDocsBtn.setAttribute('title', dict.api_docs_title);
        }

        // Update toggle badges
        this.updateToggleBadges();
    }

    updateToggleBadges() {
        const dict = translations[this.currentLang];
        const toggleLlm = document.getElementById('toggle-llm');
        const toggleRag = document.getElementById('toggle-rag');
        const badgeLlm = document.getElementById('badge-llm');
        const badgeRag = document.getElementById('badge-rag');

        if (badgeLlm && toggleLlm) {
            badgeLlm.textContent = toggleLlm.checked ? dict.badge_on : dict.badge_off;
            badgeLlm.className = `toggle-status-badge ${toggleLlm.checked ? 'badge-on' : 'badge-off'}`;
        }
        if (badgeRag && toggleRag) {
            badgeRag.textContent = toggleRag.checked ? dict.badge_on : dict.badge_off;
            badgeRag.className = `toggle-status-badge ${toggleRag.checked ? 'badge-on' : 'badge-off'}`;
        }
    }

    t(key, fallback = '') {
        const dict = translations[this.currentLang] || translations.th;
        return dict[key] || fallback || key;
    }
}

window.i18n = new I18nManager();
window.t = (key, fallback) => window.i18n.t(key, fallback);
