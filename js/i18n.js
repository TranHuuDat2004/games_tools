// --- PHẦN THÊM VÀO: LOGIC KHỞI TẠO VÀ LẮNG NGHE SỰ KIỆN ---

document.addEventListener('DOMContentLoaded', () => {

    // 1. Gắn sự kiện click cho tất cả các nút chuyển ngôn ngữ
    // Lưu ý: Phần này cần được gọi *SAU KHI* header.js đã chạy và tạo ra các nút.
    // DOMContentLoaded đảm bảo điều này.
    const langButtons = document.querySelectorAll('.lang-switcher .lang-btn');
    langButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const selectedLang = event.target.getAttribute('data-lang');
            if (selectedLang) {
                setLanguage(selectedLang);
            }
        });
    });

    // 2. Tự động thiết lập ngôn ngữ khi tải trang
    // Ưu tiên ngôn ngữ đã lưu, nếu không có thì lấy ngôn ngữ trình duyệt, cuối cùng là tiếng Việt.
    const browserLang = navigator.language.split('-')[0]; // Lấy 'en' từ 'en-US'
    const preferredLang = localStorage.getItem('preferredLanguage') || (translations[browserLang] ? browserLang : 'vi');
    
    setLanguage(preferredLang);
});