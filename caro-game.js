document.addEventListener('DOMContentLoaded', () => {

    // --- Game Constants ---
    const BOARD_SIZE = 20;
    const WIN_LENGTH = 5;

    // --- DOM Elements ---
    const boardEl = document.getElementById("caro-board");
    const resultsEl = document.querySelector("#results");
    const playAgainBtn = document.querySelector("#play-again");
    const turnIndicator = document.querySelector(".bg-turn-indicator");
    const caroGameWrapper = document.querySelector(".caro-game-wrapper");
    const pvpBtn = document.getElementById("pvp-btn");
    const pvcXBtn = document.getElementById("pvc-x-btn");
    const pvcOBtn = document.getElementById("pvc-o-btn");
    const modalPlayAgainBtn = document.getElementById("modal-play-again-btn");

    // --- Game State Variables ---
    let turn = "X";
    let isGameOver = false;
    let gameMode = "pvp";
    let playerSymbol = "X";
    let cpuSymbol = "O";
    let boardState = [];

    // --- Game Initialization ---
    function createBoard() {
        boardEl.innerHTML = "";
        boardEl.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;
        boardEl.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 1fr)`;
        document.documentElement.style.setProperty('--board-size', BOARD_SIZE);
        const totalCells = BOARD_SIZE * BOARD_SIZE;
        boardState = Array(totalCells).fill(null);
        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement("div");
            cell.classList.add("box");
            cell.dataset.index = i;
            cell.addEventListener("click", handleBoxClick);
            boardEl.appendChild(cell);
        }
    }

    function startGame(mode, pSymbol = 'X') {
        caroGameWrapper.style.display = 'block';
        gameMode = mode;
        if (mode === 'pvc') {
            playerSymbol = pSymbol;
            cpuSymbol = (pSymbol === 'X') ? 'O' : 'X';
        }
        [pvpBtn, pvcXBtn, pvcOBtn].forEach(btn => btn.classList.remove('active'));
        if (mode === 'pvp') { pvpBtn.classList.add('active'); } 
        else if (pSymbol === 'X') { pvcXBtn.classList.add('active'); } 
        else { pvcOBtn.classList.add('active'); }
        createBoard();
        resetGame();
    }

    // --- Event Listeners ---
    pvpBtn.addEventListener("click", () => startGame('pvp'));
    pvcXBtn.addEventListener("click", () => startGame('pvc', 'X'));
    pvcOBtn.addEventListener("click", () => startGame('pvc', 'O'));
    playAgainBtn.addEventListener("click", resetGame);
    modalPlayAgainBtn.addEventListener("click", resetGame);

    // --- Main Game Logic ---
    function handleBoxClick(e) {
        const index = parseInt(e.target.dataset.index);
        if (isGameOver || boardState[index] !== null) return;
        makeMove(index, turn);
        if (!isGameOver) {
            changeTurn();
            if (gameMode === "pvc" && turn === cpuSymbol) {
                boardEl.classList.add("board-locked");
                setTimeout(cpuMove, 200);
            }
        }
    }

    function makeMove(index, symbol) {
        if (isGameOver || boardState[index] !== null) return;
        boardState[index] = symbol;
        boardEl.children[index].textContent = symbol;
        
        const winningLine = checkWin(index, symbol); // <<< FIX: Hàm checkWin giờ sẽ trả về MẢNG các ô thắng
        if (winningLine) {
            isGameOver = true;
            highlightWinningCells(winningLine); // <<< FIX: Highlight dựa trên mảng ô thắng
            showEndGameModal('win', symbol);
        } else if (boardState.every(cell => cell !== null)) {
            isGameOver = true;
            showEndGameModal('draw');
        }
    }

    function changeTurn() {
        turn = (turn === "X") ? "O" : "X";
        turnIndicator.style.left = (turn === "X") ? "0%" : "50%";
    }

    function showEndGameModal(status, winner = null) {
        const lang = document.documentElement.lang;
        const modalTitleEl = document.getElementById('endGameModalLabel');
        const modalBodyEl = document.getElementById('endGameModalBody');
        modalTitleEl.textContent = translations[lang].winModalTitle;
        if (status === 'win') {
            modalBodyEl.innerHTML = translations[lang].winModalBodyWin.replace('{symbol}', winner);
        } else {
            modalBodyEl.innerHTML = translations[lang].winModalBodyDraw;
        }
        $('#endGameModal').modal('show');
        playAgainBtn.style.display = 'inline-block';
    }

    // --- LOGIC KIỂM TRA THẮNG VÀ AI (ĐƯỢC VIẾT LẠI HOÀN TOÀN ĐỂ SỬA LỖI) ---
    
    function isOutOfBounds(row, col) {
        return row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE;
    }

    function checkWin(index, symbol, requiredLength = WIN_LENGTH) {
        const col = index % BOARD_SIZE;
        const row = Math.floor(index / BOARD_SIZE);
        const directions = [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: -1 }];

        for (const dir of directions) {
            const line = [index];
            // Đếm xuôi
            for (let i = 1; i < requiredLength; i++) {
                const r = row + i * dir.y; const c = col + i * dir.x;
                if (isOutOfBounds(r, c) || boardState[r * BOARD_SIZE + c] !== symbol) break;
                line.push(r * BOARD_SIZE + c);
            }
            // Đếm ngược
            for (let i = 1; i < requiredLength; i++) {
                const r = row - i * dir.y; const c = col - i * dir.x;
                if (isOutOfBounds(r, c) || boardState[r * BOARD_SIZE + c] !== symbol) break;
                line.push(r * BOARD_SIZE + c);
            }

            if (line.length >= requiredLength) {
                return line; // Trả về mảng các ô thắng
            }
        }
        return null; // Không thắng
    }

    function highlightWinningCells(winningLine) {
        winningLine.forEach(index => {
            boardEl.children[index].classList.add("winning-cell");
        });
    }

    function cpuMove() {
        if (isGameOver) {
            boardEl.classList.remove("board-locked");
            return;
        }
        const move = findBestMove();
        if (move !== -1) {
            makeMove(move, cpuSymbol);
        }
        if (!isGameOver) {
            changeTurn();
        }
        boardEl.classList.remove("board-locked");
    }

    function findBestMove() {
        // Ưu tiên 1: PHÒNG THỦ - Chặn người chơi thắng
        for (let i = 0; i < boardState.length; i++) {
            if (boardState[i] === null) {
                boardState[i] = playerSymbol;
                if (checkWin(i, playerSymbol, WIN_LENGTH)) {
                    boardState[i] = null; return i;
                }
                boardState[i] = null;
            }
        }
        // Ưu tiên 2: TẤN CÔNG - Tìm cách thắng
        for (let i = 0; i < boardState.length; i++) {
            if (boardState[i] === null) {
                boardState[i] = cpuSymbol;
                if (checkWin(i, cpuSymbol, WIN_LENGTH)) {
                    boardState[i] = null; return i;
                }
                boardState[i] = null;
            }
        }
        // Ưu tiên 3: PHÒNG THỦ SỚM - Chặn đường 3, 4 của người chơi
        const THREAT_LENGTHS = [4, 3];
        for (const length of THREAT_LENGTHS) {
            for (let i = 0; i < boardState.length; i++) {
                if (boardState[i] === null) {
                    boardState[i] = playerSymbol;
                    if (checkWin(i, playerSymbol, length)) {
                        boardState[i] = null; return i;
                    }
                    boardState[i] = null;
                }
            }
        }
        // Ưu tiên 4: Đi gần các quân đã có
        const candidateMoves = findCandidateMoves();
        if (candidateMoves.length > 0) {
            return candidateMoves[Math.floor(Math.random() * candidateMoves.length)];
        }
        // Ưu tiên 5: Đi ngẫu nhiên
        const emptyCells = [];
        boardState.forEach((cell, index) => { if (cell === null) emptyCells.push(index); });
        if (emptyCells.length > 0) {
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
        return -1;
    }

    function findCandidateMoves() {
        const candidates = new Set();
        const directions = [ {x:0,y:1},{x:0,y:-1},{x:1,y:0},{x:-1,y:0},{x:1,y:1},{x:1,y:-1},{x:-1,y:1},{x:-1,y:-1} ];
        for (let i = 0; i < boardState.length; i++) {
            if (boardState[i] !== null) {
                const row = Math.floor(i / BOARD_SIZE); const col = i % BOARD_SIZE;
                for (const dir of directions) {
                    const nRow = row + dir.y; const nCol = col + dir.x;
                    if (!isOutOfBounds(nRow, nCol)) {
                        const neighborIndex = nRow * BOARD_SIZE + nCol;
                        if (boardState[neighborIndex] === null) { candidates.add(neighborIndex); }
                    }
                }
            }
        }
        return Array.from(candidates);
    }

    // --- Reset Logic ---
    function resetGame() {
        isGameOver = false;
        turn = "X";
        turnIndicator.style.left = "0%";
        resultsEl.textContent = "";
        playAgainBtn.style.display = 'none';
        boardEl.classList.remove("board-locked");
        $('#endGameModal').modal('hide');
        boardState.fill(null);
        for (let i = 0; i < boardEl.children.length; i++) {
            boardEl.children[i].textContent = "";
            boardEl.children[i].classList.remove("winning-cell");
        }
        if (gameMode === "pvc" && cpuSymbol === "X") {
            boardEl.classList.add("board-locked");
            setTimeout(cpuMove, 200);
        }
    }

    // --- TỰ ĐỘNG KHỞI TẠO GAME KHI TẢI TRANG ---
    startGame('pvp');

});