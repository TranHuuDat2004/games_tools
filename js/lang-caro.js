// i18n.js - Internationalization Script
const translations = {
    en: {
        docTitle: "Gomoku (Caro) Game",
        caroTitle: "Gomoku (Caro) Game",
        caroSubtitle: "Try to get 5 pieces in a row, column, or diagonal.",
        howToPlayButton: "How to Play",
        sidebarTitle: "Caro Rule",
        sidebarContentHTML: `<p>Welcome to the Caro showdown!</p>
                             <p><strong>Objective:</strong> Be the first to get a continuous line of 5 of your pieces horizontally, vertically, or diagonally.</p>
                             <p><strong>How to Play:</strong> Players take turns placing their piece (X or O) on an empty cell on the board.</p>
                             <p><strong>Winning:</strong> The first player to form a 5-piece line wins. If the board is full and no one wins, the game is a draw.</p>
                             <hr>
                             <p><strong>Game Modes:</strong></p>
                             <p>You can challenge a friend in <strong>Player vs Player</strong> mode, or face off against the smart AI in <strong>Player vs Computer</strong> mode.</p>
                             <p>Enjoy the brain-teasing match!</p>`,
        modePVP: "Player vs Player",
        modePVC_X: "vs CPU (Play First)",
        modePVC_O: "vs CPU (Play Second)",
        turnTitle: "Turn",
        playAgain: "Play Again",
        winModalTitle: "🎉 Congratulations! 🎉",
        winModalBodyWin: "<strong>{symbol}</strong> is the winner!", // {symbol} is a placeholder
        winModalBodyDraw: "It's a Draw! Well played by both.",
        winModalClose: "Close",
        winModalPlayAgain: "Play Again",
        // ... (Giữ các key dịch thuật cũ nếu cần cho các trang khác)
    },
    vi: {
        docTitle: "Game Cờ Caro",
        caroTitle: "Game Cờ Caro (Gomoku)",
        caroSubtitle: "Cố gắng đạt được 5 quân cờ trên một hàng ngang, dọc hoặc chéo.",
        howToPlayButton: "Hướng dẫn cách chơi",
        sidebarTitle: "Luật Chơi Cờ Caro",
        sidebarContentHTML: `<p>Chào mừng bạn đến với trận đấu trí Caro!</p>
                             <p><strong>Mục tiêu:</strong> Là người đầu tiên có được một chuỗi 5 quân cờ liên tiếp theo hàng ngang, hàng dọc, hoặc đường chéo.</p>
                             <p><strong>Cách chơi:</strong> Lần lượt mỗi người chơi sẽ đặt quân cờ (X hoặc O) của mình vào một ô trống trên bàn cờ.</p>
                             <p><strong>Chiến thắng:</strong> Người chơi nào tạo được chuỗi 5 quân trước sẽ là người chiến thắng. Nếu bàn cờ đầy mà không ai thắng, ván cờ sẽ hòa.</p>
                             <hr>
                             <p><strong>Chế độ chơi:</strong></p>
                             <p>Bạn có thể thử sức với một người bạn trong chế độ <strong>Người vs Người</strong>, hoặc đối đầu với AI thông minh của máy trong chế độ <strong>Người vs Máy</strong>.</p>
                             <p>Chúc bạn có những ván cờ cân não!</p>`,
        modePVP: "Người vs Người",
        modePVC_X: "Đấu Máy (Đi trước)",
        modePVC_O: "Đấu Máy (Đi sau)",
        turnTitle: "Lượt",
        playAgain: "Chơi Lại",
        winModalTitle: "🎉 Chúc Mừng! 🎉",
        winModalBodyWin: "Người chơi <strong>{symbol}</strong> đã chiến thắng!",
        winModalBodyDraw: "Ván cờ hòa! Một trận đấu ngang tài ngang sức.",
        winModalClose: "Đóng",
        winModalPlayAgain: "Chơi Lại",
         // ... (Giữ các key dịch thuật cũ nếu cần cho các trang khác)
    }
};

function setLanguage(lang) {
    if (!translations[lang]) return;
    document.documentElement.lang = lang;
    const langTranslations = translations[lang];

    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = langTranslations[key];
        if (translation !== undefined) {
            if (key.endsWith('HTML')) {
                element.innerHTML = translation;
            } else {
                element.textContent = translation;
            }
        }
    });

    // Cập nhật nút active
    document.querySelectorAll('.lang-switcher .lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) btn.classList.add('active');
    });

    localStorage.setItem('preferredLanguage', lang);
}

document.addEventListener('DOMContentLoaded', () => {
    // Logic sidebar
    const insBtn = document.getElementById('insBtn');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('insSidebar');
    if(insBtn) insBtn.onclick = () => sidebar.classList.add('open');
    if(closeSidebarBtn) closeSidebarBtn.onclick = () => sidebar.classList.remove('open');
    
    // Logic dịch thuật
    document.querySelectorAll('.lang-switcher .lang-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            setLanguage(event.target.getAttribute('data-lang'));
        });
    });

    const preferredLang = localStorage.getItem('preferredLanguage') || (translations[navigator.language.split('-')[0]] ? navigator.language.split('-')[0] : 'vi');
    setLanguage(preferredLang);
});