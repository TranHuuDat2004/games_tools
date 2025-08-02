$(document).ready(function () {
    // --- LANGUAGE SWITCHER LOGIC (Reused from your site) ---
    function setLanguage(lang) {
        localStorage.setItem('language', lang);
        $('.lang-btn').removeClass('active');
        $(`.lang-btn[data-lang="${lang}"]`).addClass('active');

        // Translate elements with data-translate attribute
        $('[data-translate]').each(function () {
            const key = $(this).data('translate');
            if (translations[lang] && translations[lang][key]) {
                $(this).text(translations[lang][key]);
            }
        });

        // Translate elements with data-lang-vi/en attributes
        $('.lang-specific').each(function () {
            const text = $(this).data('lang-' + lang);
            if (text) {
                // Keep child elements like <span class="screen-reader-only">
                const childHtml = $(this).children().length > 0 ? $(this).children().clone().wrap('<p>').parent().html() : '';
                $(this).html(text + ' ' + childHtml);
            }
        });

        // Special case for buttons with multiple states
        $('#start-pause-btn').text(
            $('#start-pause-btn').data('paused') === 'true'
                ? translations[lang].pauseBtn
                : translations[lang].startBtn
        );
        $('#hard-drop-btn').text(translations[lang].hardDrop);
        $('#restart-btn').text(translations[lang].restartBtn);
    }

    $('.lang-btn').on('click', function () {
        const lang = $(this).data('lang');
        setLanguage(lang);
    });

    // Initialize language on page load
    const savedLang = localStorage.getItem('language') || 'vi';
    setLanguage(savedLang);

    // ===== THÊM PHẦN NÀY ĐỂ TẢI ĐIỂM CAO =====
    function loadHighScore() {
        const storedHighScore = localStorage.getItem('tetrisHighScore');
        highScore = storedHighScore ? parseInt(storedHighScore, 10) : 0;
        highScoreElement.innerText = highScore;
    }
    // ===========================================

    // --- TETRIS GAME LOGIC ---

    const canvas = document.getElementById('tetris-board');
    const context = canvas.getContext('2d');
    const nextCanvas = document.getElementById('next-piece-canvas');
    const nextContext = nextCanvas.getContext('2d');

    const scoreElement = document.getElementById('score');
    const linesElement = document.getElementById('lines');
    const levelElement = document.getElementById('level');
    const startPauseBtn = document.getElementById('start-pause-btn');
    const restartBtn = document.getElementById('restart-btn');
    const gameOverMessage = document.getElementById('game-over-message');
    // THÊM CÁC DÒNG SAU VÀO:
    const highScoreElement = document.getElementById('high-score');
    let highScore = 0;

    const COLS = 10;
    const ROWS = 20;
    const BLOCK_SIZE = 30;
    const NEXT_BLOCK_SIZE = 20;

    // Thêm các hằng số này
    const BLOCK_PADDING = 0.1; // Khoảng cách giữa các khối (tỷ lệ)
    const CORNER_RADIUS = 0.2; // Độ bo góc (tỷ lệ)

    // Thêm hàm tiện ích này ngay sau các hằng số
    function drawRoundRect(ctx, x, y, width, height, radius) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
        ctx.fill();
    }

    // Adjust canvas size based on constants
    canvas.width = COLS * BLOCK_SIZE;
    canvas.height = ROWS * BLOCK_SIZE;
    context.scale(BLOCK_SIZE, BLOCK_SIZE);
    nextContext.scale(NEXT_BLOCK_SIZE, NEXT_BLOCK_SIZE);

    // Thay thế bằng
    const COLORS = [
        null,       // 0 - Empty
        '#e63946',  // 1 - T (Red)
        '#457b9d',  // 2 - I (Blue)
        '#f1faee',  // 3 - O (White/Light)
        '#f4a261',  // 4 - L (Orange)
        '#2a9d8f',  // 5 - J (Teal)
        '#a8dadc',  // 6 - S (Light Cyan)
        '#9b5de5',  // 7 - Z (Purple)
        '#fca311',  // 8 - Plus (+) - Yellow/Orange
        '#00f5d4',  // 9 - U Shape - Bright Mint
        '#ff006e',  // 10 - Single Dot - Hot Pink
        '#8338ec',  // 11 - Domino (1x2) - Indigo
        '#3a86ff'   // 12 - Corner (3 blocks) - Bright Blue
    ];

    const PIECES = [
        [[0, 0, 0], [1, 1, 1], [0, 1, 0]], // T
        [[0, 0, 0, 0], [2, 2, 2, 2], [0, 0, 0, 0], [0, 0, 0, 0]], // I
        [[3, 3], [3, 3]], // O
        [[0, 4, 0], [0, 4, 0], [0, 4, 4]], // L
        [[0, 5, 0], [0, 5, 0], [5, 5, 0]], // J
        [[0, 6, 6], [6, 6, 0], [0, 0, 0]], // S
        [[7, 7, 0], [0, 7, 7], [0, 0, 0]],  // Z
        // --- CÁC KHỐI MỚI ĐA DẠNG HƠN ---
        [[0, 8, 0], [8, 8, 8], [0, 8, 0]], // 8: Plus shape (5 blocks)

        [[9, 0, 9], [9, 9, 9], [0, 0, 0]], // 9: U shape (5 blocks)

        [[10]], // 10: Single dot (1 block)

        [[11, 0], [11, 0]], // 11: Domino (1x2) - ĐÃ SỬA

        [[12, 12], [12, 0]], // 12: Corner (3 blocks)
    ];

    let board = createBoard();
    let player;
    let nextPiece;
    let score = 0;
    let lines = 0;
    let level = 1;
    let dropCounter = 0;
    let dropInterval = 1000;
    let isPaused = false;
    let isGameOver = false;
    let animationFrameId;

    loadHighScore(); // <-- GỌI HÀM NÀY Ở ĐÂY

    function createBoard() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }

    function createPiece(type) {
        if (type === 'T') return [[0, 0, 0], [1, 1, 1], [0, 1, 0]];
        if (type === 'I') return [[0, 0, 0, 0], [2, 2, 2, 2], [0, 0, 0, 0], [0, 0, 0, 0]];
        if (type === 'O') return [[3, 3], [3, 3]];
        if (type === 'L') return [[0, 4, 0], [0, 4, 0], [0, 4, 4]];
        if (type === 'J') return [[0, 5, 0], [0, 5, 0], [5, 5, 0]];
        if (type === 'S') return [[0, 6, 6], [6, 6, 0], [0, 0, 0]];
        if (type === 'Z') return [[7, 7, 0], [0, 7, 7], [0, 0, 0]];
    }

    function playerReset() {
        // Nếu chưa có khối "tiếp theo", tạo một khối ngẫu nhiên
        if (!nextPiece) {
            const randNextIndex = Math.floor(Math.random() * PIECES.length);
            nextPiece = {
                // Tạo một bản sao của khối để tránh thay đổi bản gốc khi xoay
                matrix: JSON.parse(JSON.stringify(PIECES[randNextIndex]))
            };
        }

        // Gán khối "tiếp theo" cho người chơi
        player = {
            matrix: nextPiece.matrix,
            pos: { x: Math.floor(COLS / 2) - Math.floor(nextPiece.matrix[0].length / 2), y: 0 }
        };

        // Tạo khối "tiếp theo" mới cho lần sau
        const randNextIndex = Math.floor(Math.random() * PIECES.length);
        nextPiece = {
            matrix: JSON.parse(JSON.stringify(PIECES[randNextIndex]))
        };

        // Kiểm tra va chạm ngay khi khối mới xuất hiện (trường hợp game over)
        if (collide(board, player)) {
            gameOver();
        }

        // Vẽ lại khu vực hiển thị khối tiếp theo
        drawNextPiece();
    }

    // Tìm hàm draw() cũ và thay thế bằng hàm mới này
    function draw() {
        // Xóa toàn bộ canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Vẽ lưới nền (background grid)
        context.fillStyle = '#282828'; // Màu từ CSS var(--grid-color)
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                drawRoundRect(context, x + BLOCK_PADDING, y + BLOCK_PADDING, 1 - BLOCK_PADDING * 2, 1 - BLOCK_PADDING * 2, CORNER_RADIUS);
            }
        }

        // 2. Vẽ các khối đã nằm trên bàn cờ
        drawMatrix(board, { x: 0, y: 0 });

        // 3. Vẽ khối đang rơi
        drawMatrix(player.matrix, player.pos);
    }

    // Tìm hàm drawNextPiece() cũ và thay thế bằng hàm mới này
    function drawNextPiece() {
        const matrix = nextPiece.matrix;
        const matrixWidth = matrix[0].length;
        const matrixHeight = matrix.length;
        const canvasWidth = nextCanvas.width / NEXT_BLOCK_SIZE;
        const canvasHeight = nextCanvas.height / NEXT_BLOCK_SIZE;

        // Căn giữa khối trong canvas
        const xOffset = (canvasWidth - matrixWidth) / 2;
        const yOffset = (canvasHeight - matrixHeight) / 2;

        // Vẽ nền cho canvas "Next"
        nextContext.fillStyle = '#000';
        nextContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

        // Vẽ các khối
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    nextContext.fillStyle = COLORS[value];
                    drawRoundRect(
                        nextContext,
                        x + xOffset + BLOCK_PADDING,
                        y + yOffset + BLOCK_PADDING,
                        1 - BLOCK_PADDING * 2,
                        1 - BLOCK_PADDING * 2,
                        CORNER_RADIUS
                    );
                }
            });
        });
    }

    // Tìm hàm drawMatrix() cũ và thay thế bằng hàm mới này
    function drawMatrix(matrix, offset) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    context.fillStyle = COLORS[value];
                    const drawX = x + offset.x;
                    const drawY = y + offset.y;

                    // Vẽ khối với padding và bo góc
                    drawRoundRect(
                        context,
                        drawX + BLOCK_PADDING,
                        drawY + BLOCK_PADDING,
                        1 - BLOCK_PADDING * 2,
                        1 - BLOCK_PADDING * 2,
                        CORNER_RADIUS
                    );
                }
            });
        });
    }

    function merge(board, player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    board[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
    }

    function collide(board, player) {
        const [matrix, offset] = [player.matrix, player.pos];
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < matrix[y].length; ++x) {
                if (matrix[y][x] !== 0 &&
                    (board[y + offset.y] &&
                        board[y + offset.y][x + offset.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    function playerDrop() {
        if (isPaused || isGameOver) return;
        player.pos.y++;
        if (collide(board, player)) {
            player.pos.y--;
            merge(board, player);
            sweep();
            playerReset();
        }
        dropCounter = 0;
    }

    function hardDrop() {
        if (isPaused || isGameOver) return;
        while (!collide(board, player)) {
            player.pos.y++;
        }
        player.pos.y--;
        merge(board, player);
        sweep();
        playerReset();
        dropCounter = 0;
    }

    function playerMove(dir) {
        if (isPaused || isGameOver) return;
        player.pos.x += dir;
        if (collide(board, player)) {
            player.pos.x -= dir;
        }
    }

    function rotate(matrix, dir) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
            }
        }
        if (dir > 0) {
            matrix.forEach(row => row.reverse());
        } else {
            matrix.reverse();
        }
    }

    function playerRotate(dir) {
        if (isPaused || isGameOver) return;
        const pos = player.pos.x;
        let offset = 1;
        rotate(player.matrix, dir);
        while (collide(board, player)) {
            player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > player.matrix[0].length) {
                rotate(player.matrix, -dir);
                player.pos.x = pos;
                return;
            }
        }
    }

    function sweep() {
        let clearedLines = 0;
        outer: for (let y = board.length - 1; y > 0; --y) {
            for (let x = 0; x < board[y].length; ++x) {
                if (board[y][x] === 0) {
                    continue outer;
                }
            }
            const row = board.splice(y, 1)[0].fill(0);
            board.unshift(row);
            y++;
            clearedLines++;
        }
        if (clearedLines > 0) {
            updateScore(clearedLines);
        }
    }

    function updateScore(clearedLines) {
        const linePoints = [0, 40, 100, 300, 1200];
        score += linePoints[clearedLines] * level;
        lines += clearedLines;

        if (lines >= level * 10) {
            level++;
            dropInterval *= 0.9;
        }

        scoreElement.innerText = score;
        linesElement.innerText = lines;
        levelElement.innerText = level;
    }

    let lastTime = 0;
    function update(time = 0) {
        if (!isPaused && !isGameOver) {
            const deltaTime = time - lastTime;
            lastTime = time;
            dropCounter += deltaTime;
            if (dropCounter > dropInterval) {
                playerDrop();
            }
            draw();
        }
        animationFrameId = requestAnimationFrame(update);
    }

    function startGame() {
        isGameOver = false;
        isPaused = false;
        board = createBoard();
        score = 0;
        lines = 0;
        level = 1;
        dropInterval = 1000;
        updateScore(0); // Reset display
        playerReset();
        gameOverMessage.style.display = 'none';

        const lang = localStorage.getItem('language') || 'vi';
        $(startPauseBtn).text(translations[lang].pauseBtn).data('paused', 'true');

        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        update();
    }

    function togglePause() {
        if (isGameOver) return;
        isPaused = !isPaused;
        const lang = localStorage.getItem('language') || 'vi';
        if (isPaused) {
            $(startPauseBtn).text(translations[lang].startBtn).data('paused', 'false');
        } else {
            $(startPauseBtn).text(translations[lang].pauseBtn).data('paused', 'true');
        }
    }

    // Thay thế bằng phiên bản cập nhật này:
    function gameOver() {
        isGameOver = true;
        cancelAnimationFrame(animationFrameId);
        gameOverMessage.style.display = 'flex';

        // ===== THÊM LOGIC KIỂM TRA VÀ LƯU ĐIỂM CAO =====
        if (score > highScore) {
            highScore = score;
            highScoreElement.innerText = highScore;
            localStorage.setItem('tetrisHighScore', highScore);
            // Có thể thêm hiệu ứng đặc biệt ở đây để báo người chơi đã phá kỷ lục!
            console.log("New high score!", highScore);
        }
        // ==================================================
    }


    // Event Listeners
    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') playerMove(-1);
        else if (event.key === 'ArrowRight') playerMove(1);
        else if (event.key === 'ArrowDown') playerDrop();
        else if (event.key === 'ArrowUp') playerRotate(1);
        else if (event.key === ' ') {
            event.preventDefault(); // Prevent page scroll
            hardDrop();
        }
    });

    startPauseBtn.addEventListener('click', () => {
        if (isGameOver || !player) {
            startGame();
        } else {
            togglePause();
        }
    });

    restartBtn.addEventListener('click', startGame);

    // Mobile controls
    $('#move-left-btn').on('click', () => playerMove(-1));
    $('#move-right-btn').on('click', () => playerMove(1));
    $('#move-down-btn').on('click', () => playerDrop());
    $('#rotate-btn').on('click', () => playerRotate(1));
    $('#hard-drop-btn').on('click', () => hardDrop());

    // Initial draw to show empty state
    draw();
    drawNextPiece();
});