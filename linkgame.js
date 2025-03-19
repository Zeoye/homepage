// 连连看游戏逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 初始化游戏变量
    let canvas, ctx;
    let board = [];
    let selected = null;
    let score = 0;
    let timeLeft = 300;
    let gameLoop;
    let timer;
    const ROWS = 8;
    const COLS = 12;
    const CELL_SIZE = 50;
    const PADDING = 5;

    const ICONS = [
        '🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
        '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '��', '🐔'
    ];

    function initLinkGame() {
        canvas = document.getElementById('linkCanvas');
        ctx = canvas.getContext('2d');
        
        // 初始化游戏板
        initBoard();
        drawBoard();
    }

    function initBoard() {
        board = [];
        // 创建配对的图标
        let icons = [];
        for (let i = 0; i < (ROWS * COLS) / 2; i++) {
            const icon = ICONS[i % ICONS.length];
            icons.push(icon, icon);
        }
        
        // 随机打乱
        icons = shuffleArray(icons);
        
        // 填充游戏板
        for (let i = 0; i < ROWS; i++) {
            board[i] = [];
            for (let j = 0; j < COLS; j++) {
                board[i][j] = {
                    icon: icons[i * COLS + j],
                    visible: true
                };
            }
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function drawBoard() {
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                if (board[i][j] && board[i][j].visible) {
                    drawCell(i, j);
                }
            }
        }
    }

    function drawCell(row, col) {
        const x = col * CELL_SIZE + PADDING;
        const y = row * CELL_SIZE + PADDING;
        
        // 绘制背景
        ctx.fillStyle = selected && selected.row === row && selected.col === col ? '#4CAF50' : '#2a2a2a';
        ctx.fillRect(x, y, CELL_SIZE - PADDING * 2, CELL_SIZE - PADDING * 2);
        
        // 绘制图标
        ctx.font = '30px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            board[row][col].icon,
            x + (CELL_SIZE - PADDING * 2) / 2,
            y + (CELL_SIZE - PADDING * 2) / 2
        );
    }

    function canConnect(start, end) {
        // 检查是否是同一个图标
        if (board[start.row][start.col].icon !== board[end.row][end.col].icon) {
            return false;
        }
        
        // 检查是否可以通过直线或一次折线连接
        return checkDirectLine(start, end) || checkOneTurn(start, end) || checkTwoTurns(start, end);
    }

    function checkDirectLine(start, end) {
        if (start.row === end.row) {
            // 水平连接
            const minCol = Math.min(start.col, end.col);
            const maxCol = Math.max(start.col, end.col);
            for (let col = minCol + 1; col < maxCol; col++) {
                if (board[start.row][col].visible) {
                    return false;
                }
            }
            return true;
        }
        
        if (start.col === end.col) {
            // 垂直连接
            const minRow = Math.min(start.row, end.row);
            const maxRow = Math.max(start.row, end.row);
            for (let row = minRow + 1; row < maxRow; row++) {
                if (board[row][start.col].visible) {
                    return false;
                }
            }
            return true;
        }
        
        return false;
    }

    function checkOneTurn(start, end) {
        // 检查两个转折点
        const corners = [
            { row: start.row, col: end.col },
            { row: end.row, col: start.col }
        ];
        
        for (const corner of corners) {
            if (!board[corner.row][corner.col].visible ||
                (!board[corner.row][corner.col].visible &&
                 checkDirectLine(start, corner) &&
                 checkDirectLine(corner, end))) {
                return true;
            }
        }
        
        return false;
    }

    function checkTwoTurns(start, end) {
        // 检查所有可能的两次折线路径
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (!board[row][col].visible) {
                    const corner1 = { row: start.row, col };
                    const corner2 = { row, col: end.col };
                    if (checkDirectLine(start, corner1) &&
                        checkDirectLine(corner1, corner2) &&
                        checkDirectLine(corner2, end)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function handleClick(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const col = Math.floor(x / CELL_SIZE);
        const row = Math.floor(y / CELL_SIZE);
        
        if (row < 0 || row >= ROWS || col < 0 || col >= COLS || !board[row][col].visible) {
            return;
        }
        
        if (!selected) {
            selected = { row, col };
            drawBoard();
        } else {
            if (selected.row === row && selected.col === col) {
                selected = null;
                drawBoard();
                return;
            }
            
            if (canConnect(selected, { row, col })) {
                // 移除匹配的图标
                board[selected.row][selected.col].visible = false;
                board[row][col].visible = false;
                selected = null;
                
                // 更新分数
                score += 10;
                document.getElementById('linkScore').textContent = score;
                
                // 检查游戏是否结束
                if (checkGameComplete()) {
                    endLinkGame(true);
                }
            } else {
                selected = { row, col };
            }
            drawBoard();
        }
    }

    function checkGameComplete() {
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                if (board[i][j].visible) {
                    return false;
                }
            }
        }
        return true;
    }

    function updateTimer() {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById('linkTimer').textContent = timeLeft;
            if (timeLeft === 0) {
                endLinkGame(false);
            }
        }
    }

    function startLinkGame() {
        // 重置游戏状态
        score = 0;
        timeLeft = 300;
        selected = null;
        document.getElementById('linkScore').textContent = '0';
        document.getElementById('linkTimer').textContent = '300';
        
        initBoard();
        drawBoard();
        
        if (timer) {
            clearInterval(timer);
        }
        timer = setInterval(updateTimer, 1000);
        
        // 添加点击事件监听
        canvas.addEventListener('click', handleClick);
    }

    function endLinkGame(completed) {
        clearInterval(timer);
        canvas.removeEventListener('click', handleClick);
    }

    function openLinkGame() {
        document.getElementById('linkModal').style.display = 'flex';
        initLinkGame();
    }

    function closeLinkGame() {
        document.getElementById('linkModal').style.display = 'none';
        if (timer) {
            clearInterval(timer);
        }
        canvas.removeEventListener('click', handleClick);
    }

    // 导出全局函数
    window.openLinkGame = openLinkGame;
    window.closeLinkGame = closeLinkGame;
    window.startLinkGame = startLinkGame;
}); 