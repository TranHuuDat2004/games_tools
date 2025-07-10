// setLanguage.js - THAY THẾ HÀM NÀY

function setLanguage(lang) {
    if (!translations[lang]) {
        console.error("Language not supported:", lang);
        return;
    }
    document.documentElement.lang = lang;
    const langTranslations = translations[lang];

    // 1. Dịch các phần tử có thuộc tính [data-translate]
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = langTranslations[key];
        if (translation !== undefined) {
            // <<< FIX: KIỂM TRA NẾU KEY KẾT THÚC BẰNG "HTML"
            if (key.endsWith('HTML')) {
                element.innerHTML = translation;
            } else {
                element.textContent = translation;
            }
        } else {
            console.warn(`Translation key "${key}" not found for [data-translate] in language "${lang}".`);
        }
    });

    // 2. Dịch các phần tử có class .lang-specific
    document.querySelectorAll('.lang-specific').forEach(element => {
        const textKey = lang === 'vi' ? 'data-lang-vi' : 'data-lang-en';
        const newText = element.getAttribute(textKey);
        
        // <<< FIX: Kiểm tra nếu nội dung dịch có chứa thẻ HTML
        if (newText) {
            if (newText.includes('<') && newText.includes('>')) {
                 // Nếu có thẻ HTML, dùng innerHTML
                 element.innerHTML = newText;
            } else {
                // Nếu không, chỉ cập nhật text bên trong, giữ lại các thẻ con khác nếu có
                // Ví dụ: <a>Văn bản <span class="sr-only"></span></a>
                const childNodes = Array.from(element.childNodes);
                const textNode = childNodes.find(node => node.nodeType === Node.TEXT_NODE);
                if (textNode) {
                    textNode.textContent = newText;
                } else if (newText.trim() !== '') {
                    // Nếu không có text node nào nhưng vẫn có nội dung dịch, chèn vào đầu
                    element.insertAdjacentText('afterbegin', newText);
                }
            }
        }
    });

    // 3. Cập nhật nút active cho bộ chuyển ngôn ngữ
    document.querySelectorAll('.lang-switcher .lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });

    localStorage.setItem('preferredLanguage', lang);
}