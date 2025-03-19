// 俄罗斯方块游戏逻辑
const SHAPES = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]], // J
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]]  // Z
];

const COLORS = [
    '#00f0f0', // cyan
    '#f0f000', // yellow
    '#a000f0', // purple
    '#f0a000', // orange
    '#0000f0', // blue
    '#00f000', // green
    '#f00000'  // red
];

let canvas, ctx;
let nextCanvas, nextCtx;
let gameBoard = [];
let currentPiece = null;
let nextPiece = null;
let gameLoop;
let score = 0;
let level = 1;
let lines = 0;
let gameOver = false;

const BLOCK_SIZE = 30;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

function initTetris() {
    canvas = document.getElementById('tetrisCanvas');
    ctx = canvas.getContext('2d');
    nextCanvas = document.getElementById('nextPieceCanvas');
    nextCtx = nextCanvas.getContext('2d');
    
    // 初始化游戏板
    gameBoard = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
    
    // 创建第一个方块
    createNewPiece();
    drawGame();
}

function createNewPiece() {
    if (!nextPiece) {
        currentPiece = {
            shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
            color: Math.floor(Math.random() * COLORS.length),
            x: Math.floor(BOARD_WIDTH / 2) - 1,
            y: 0
        };
    } else {
        currentPiece = nextPiece;
    }
    
    nextPiece = {
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        color: Math.floor(Math.random() * COLORS.length),
        x: Math.floor(BOARD_WIDTH / 2) - 1,
        y: 0
    };
    
    if (!canMove(0, 0)) {
        gameOver = true;
        endTetrisGame();
    }
    
    drawNextPiece();
}

function drawNextPiece() {
    nextCtx.fillStyle = '#1a1a1a';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    const blockSize = 30;
    const offsetX = (nextCanvas.width - nextPiece.shape[0].length * blockSize) / 2;
    const offsetY = (nextCanvas.height - nextPiece.shape.length * blockSize) / 2;
    
    nextPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                nextCtx.fillStyle = COLORS[nextPiece.color];
                nextCtx.fillRect(offsetX + x * blockSize, offsetY + y * blockSize, blockSize - 1, blockSize - 1);
            }
        });
    });
}

function canMove(moveX, moveY, rotatedShape = null) {
    const shape = rotatedShape || currentPiece.shape;
    
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                const newX = currentPiece.x + x + moveX;
                const newY = currentPiece.y + y + moveY;
                
                if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
                    return false;
                }
                
                if (newY >= 0 && gameBoard[newY][newX]) {
                    return false;
                }
            }
        }
    }
    return true;
}

function rotatePiece() {
    const rotated = currentPiece.shape[0].map((_, i) =>
        currentPiece.shape.map(row => row[row.length - 1 - i])
    );
    
    if (canMove(0, 0, rotated)) {
        currentPiece.shape = rotated;
        drawGame();
    }
}

function movePiece(direction) {
    const moveX = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
    const moveY = direction === 'down' ? 1 : 0;
    
    if (canMove(moveX, moveY)) {
        currentPiece.x += moveX;
        currentPiece.y += moveY;
        drawGame();
        return true;
    }
    return false;
}

function dropPiece() {
    while (movePiece('down')) {}
    lockPiece();
}

function lockPiece() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                const boardY = currentPiece.y + y;
                if (boardY >= 0) {
                    gameBoard[boardY][currentPiece.x + x] = currentPiece.color + 1;
                }
            }
        });
    });
    
    clearLines();
    createNewPiece();
}

function clearLines() {
    let linesCleared = 0;
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (gameBoard[y].every(cell => cell > 0)) {
            gameBoard.splice(y, 1);
            gameBoard.unshift(Array(BOARD_WIDTH).fill(0));
            linesCleared++;
            y++;
        }
    }
    
    if (linesCleared > 0) {
        lines += linesCleared;
        score += linesCleared * 100 * level;
        level = Math.floor(lines / 10) + 1;
        
        document.getElementById('tetrisScore').textContent = score;
        document.getElementById('tetrisLevel').textContent = level;
        document.getElementById('tetrisLines').textContent = lines;
    }
}

function drawGame() {
    // 清空画布
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制已固定的方块
    gameBoard.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value > 0) {
                ctx.fillStyle = COLORS[value - 1];
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
            }
        });
    });
    
    // 绘制当前方块
    if (currentPiece) {
        ctx.fillStyle = COLORS[currentPiece.color];
        currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    ctx.fillRect(
                        (currentPiece.x + x) * BLOCK_SIZE,
                        (currentPiece.y + y) * BLOCK_SIZE,
                        BLOCK_SIZE - 1,
                        BLOCK_SIZE - 1
                    );
                }
            });
        });
    }
}

function gameStep() {
    if (!movePiece('down')) {
        lockPiece();
    }
}

function startTetris() {
    // 重置游戏状态
    gameBoard = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
    score = 0;
    level = 1;
    lines = 0;
    gameOver = false;
    
    document.getElementById('tetrisScore').textContent = '0';
    document.getElementById('tetrisLevel').textContent = '1';
    document.getElementById('tetrisLines').textContent = '0';
    
    createNewPiece();
    
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    
    gameLoop = setInterval(() => {
        if (!gameOver) {
            gameStep();
        }
    }, 1000 / level);
}

function endTetrisGame() {
    clearInterval(gameLoop);
}

function openTetrisGame() {
    document.getElementById('tetrisModal').style.display = 'flex';
    initTetris();
}

function closeTetrisGame() {
    document.getElementById('tetrisModal').style.display = 'none';
    if (gameLoop) {
        clearInterval(gameLoop);
    }
}

// 键盘控制
document.addEventListener('keydown', (e) => {
    if (document.getElementById('tetrisModal').style.display === 'flex' && !gameOver) {
        switch(e.key) {
            case 'ArrowLeft':
                movePiece('left');
                break;
            case 'ArrowRight':
                movePiece('right');
                break;
            case 'ArrowDown':
                movePiece('down');
                break;
            case 'ArrowUp':
                rotatePiece();
                break;
            case ' ':
                dropPiece();
                break;
        }
    }
}); 