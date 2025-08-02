// i18n.js

const translations = {
    en: {
        // ... các key cũ của bạn ...

        // NEW KEYS FOR game.html
        pageTitle: "Play Games - Brain Teasers",
        pageDescription: "Choose your favorite game! Challenge yourself with strategic Gomoku (Caro) or relax with colorful Jigsaw Puzzles.",
        mainTitle: "Choose Your Game",
        mainSubtitle: "Challenge yourself with our classic brain teaser games!",
        caroCardTitle: "Gomoku (Caro)",
        caroCardDesc: "A classic strategy game. Align 5 of your pieces in a row before your opponent does. Challenge our smart AI or play against a friend!",
        puzzleCardTitle: "Jigsaw Puzzle",
        puzzleCardDesc: "Relax and train your observation skills with colorful pictures. Drag, drop, and rotate the pieces to complete the challenge.",
        playButton: "Play Now",
        // ===== THÊM CÁC KEY MỚI CHO TETRIS =====
        tetrisCardTitle: "Block Puzzle (Tetris)",
        tetrisCardDesc: "The classic game that challenges your speed and arrangement skills. Stack the blocks to fill rows and get the highest score possible!",
        tetrisCardAlt: "Tetris block game"
    },
    vi: {
        // ... các key cũ của bạn ...

        // NEW KEYS FOR game.html
        pageTitle: "Chơi Game - Thử Thách Trí Tuệ",
        pageDescription: "Chọn trò chơi bạn yêu thích! Thử sức với Cờ Caro chiến thuật hoặc thư giãn với Game Xếp Hình đầy màu sắc.",
        mainTitle: "Chọn Trò Chơi Của Bạn",
        mainSubtitle: "Thử thách bản thân với các trò chơi trí tuệ kinh điển của chúng tôi!",
        caroCardTitle: "Cờ Caro (Gomoku)",
        caroCardDesc: "Một trò chơi chiến thuật kinh điển. Hãy sắp xếp 5 quân cờ của bạn thành một hàng trước đối thủ. Thử thách AI thông minh của chúng tôi hoặc đấu với một người bạn!",
        puzzleCardTitle: "Game Xếp Hình",
        puzzleCardDesc: "Thư giãn và rèn luyện óc quan sát với những bức tranh đầy màu sắc. Kéo, thả và xoay các mảnh ghép để hoàn thành thử thách.",
        playButton: "Chơi Ngay",
         // ===== THÊM CÁC KEY MỚI CHO TETRIS =====
        tetrisCardTitle: "Xếp Gạch (Tetris)",
        tetrisCardDesc: "Trò chơi kinh điển thách thức tốc độ và khả năng sắp xếp của bạn. Xếp các khối gạch để lấp đầy các hàng và ghi điểm cao nhất có thể!",
        tetrisCardAlt: "Game xếp gạch Tetris"
    }
};

function setLanguage(lang) {
    if (!translations[lang]) return;
    document.documentElement.lang = lang;
    const langTranslations = translations[lang];

    // Dịch các phần tử có thuộc tính [data-translate]
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = langTranslations[key];
        if (translation !== undefined) {
            if (key.includes('HTML')) {
                element.innerHTML = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
    
    // Dịch các phần tử có thuộc tính [data-translate-attr]
    document.querySelectorAll('[data-translate-attr]').forEach(element => {
        const attrConfig = element.getAttribute('data-translate-attr'); // e.g., "content:pageDescription"
        const [attrName, key] = attrConfig.split(':');
        const translation = langTranslations[key];
        if (translation !== undefined) {
            element.setAttribute(attrName, translation);
        }
    });

    // Cập nhật nút active cho bộ chuyển ngôn ngữ
    document.querySelectorAll('.lang-switcher .lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });

    localStorage.setItem('preferredLanguage', lang);
}

