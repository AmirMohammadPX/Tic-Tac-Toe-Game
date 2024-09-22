// Initialize game state
const board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = false;
let gameMode = '';
let difficulty = '';
let scores = { X: 0, O: 0 };

// Winning combinations on the board
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

// DOM element selections
const statusDisplay = document.getElementById('status');
const equalDisplay = document.getElementById('equal');
const scoreBoard = document.getElementById('scoreboard');
const resetButton = document.getElementById('reset');
const changeModeButton = document.getElementById('changeMode');
const twoPlayersButton = document.getElementById('twoPlayers');
const easyButton = document.getElementById('easy');
const mediumButton = document.getElementById('medium');
const impossibleButton = document.getElementById('impossible');
const scoreXDisplay = document.getElementById('scoreX');
const scoreODisplay = document.getElementById('scoreO');
const modeSelection = document.getElementById('modeSelection');
const playerOIcon = document.getElementById('playerO-icon');
const gameBoard = document.getElementById('gameBoard');
const darkModeToggle = document.getElementById('darkModeToggle');

// Create board cells
const boardElement = document.querySelector('.board');
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-index', i);
    boardElement.appendChild(cell);
}
const cells = document.querySelectorAll('.cell');

//Event Github Button
document.getElementById("GithubButton").addEventListener('click', () => {
    location.replace("https://github.com/AmirMohammadPX/Tic-Tac-Toe-Game")
});
// Event listeners for game mode buttons
twoPlayersButton.addEventListener('click', () => {
    gameMode = 'two';
    startGame();
});

easyButton.addEventListener('click', () => {
    gameMode = 'single';
    difficulty = 'easy';
    statusDisplay.textContent = "Level: Easy";
    startGame();
});

mediumButton.addEventListener('click', () => {
    gameMode = 'single';
    difficulty = 'medium';
    statusDisplay.textContent = "Level: Medium";
    startGame();
});

impossibleButton.addEventListener('click', () => {
    gameMode = 'single';
    difficulty = 'impossible';
    statusDisplay.textContent = "Level: Impossible";
    startGame();
});

// Event listeners for game controls
resetButton.addEventListener('click', resetGame);
changeModeButton.addEventListener('click', changeMode);

cells.forEach(cell => {
    cell.addEventListener('click', () => cellClick(cell));
});

// Function to change game mode
function changeMode() {
    scores = { X: 0, O: 0 };
    scoreXDisplay.textContent = '0';
    scoreODisplay.textContent = '0';
    gameBoard.style.display = 'none';
    modeSelection.style.display = 'block';
    resetBoard();
}

// Function to handle cell click
function cellClick(cell) {
    const index = cell.getAttribute('data-index');
    if (board[index] !== '' || !gameActive) return;

    updateCell(cell, index);
    checkForWinner();

    if (gameMode === 'single' && gameActive && currentPlayer === 'O') {
        gameActive = false;
        setTimeout(() => computerMove(), 500);
    }
}

// Function to update cell content
function updateCell(cell, index) {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('scale-in');
}

// Function to change player
function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
}

// Function to update game status
function updateStatus() {
    if (currentPlayer === 'X') {
        document.getElementById('playerXScore').classList.add('selectPlayerScore');
        document.getElementById('playerOScore').classList.remove('selectPlayerScore');
    } else {
        document.getElementById('playerXScore').classList.remove('selectPlayerScore');
        document.getElementById('playerOScore').classList.add('selectPlayerScore');
    }
    gameActive = true;
}

// Function to check for a winner
function checkForWinner() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            document.getElementById('playerXScore').classList.remove('selectPlayerScore');
            document.getElementById('playerOScore').classList.remove('selectPlayerScore');
            if (currentPlayer === 'X') {
                document.getElementById('playerXScore').classList.add('winPlayerScore');
            } else {
                document.getElementById('playerOScore').classList.add('winPlayerScore');
            }
            highlightWinningCells(combination);
            updateScore(currentPlayer);
            return;
        }
    }

    if (!board.includes('')) {
        document.getElementById('playerXScore').classList.remove('selectPlayerScore');
        document.getElementById('playerOScore').classList.remove('selectPlayerScore');
        equalDisplay.classList.remove('opacity-0');
        scoreboard.classList.add('selectPlayerScore');
        gameActive = false;
        return;
    }

    changePlayer();
}

// Function to highlight winning cells
function highlightWinningCells(combination) {
    combination.forEach(index => {
        cells[index].classList.add('win');
    });
}

// Function to update score
function updateScore(player) {
    scores[player]++;
    scoreXDisplay.textContent = scores.X;
    scoreODisplay.textContent = scores.O;
}

// Function for computer move
function computerMove() {
    let index;
    switch (difficulty) {
        case 'easy':
            index = getRandomEmptyCell();
            break;
        case 'medium':
            index = Math.random() < 0.5 ? getBestMove() : getRandomEmptyCell();
            break;
        case 'impossible':
            index = getBestMove();
            break;
        default:
            index = getRandomEmptyCell();
    }
    const cell = document.querySelector(`[data-index="${index}"]`);
    updateCell(cell, index);
    checkForWinner();
}

// Function to get a random empty cell
function getRandomEmptyCell() {
    const emptyCells = board.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Function to get the best move (for impossible difficulty)
function getBestMove() {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

// Minimax algorithm for AI
function minimax(board, depth, isMaximizing) {
    const scores = { X: -1, O: 1, tie: 0 };
    const result = checkWinner();
    if (result !== null) return scores[result];

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Function to check for a winner
function checkWinner() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    if (!board.includes('')) return 'tie';
    return null;
}

// Function to start the game
function startGame() {
    if (gameMode === 'single') {
        statusDisplay.textContent = `Level: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;
        playerOIcon.classList.remove('bi-person-fill');
        playerOIcon.classList.add('bi-robot');
    } else {
        statusDisplay.textContent = "Two Players Mode";
        playerOIcon.classList.remove('bi-robot');
        playerOIcon.classList.add('bi-person-fill');
    }
    document.querySelectorAll('.cell.scale-in').forEach(button => {
        button.classList.remove('scale-in');
    });
    document.getElementById('playerXScore').classList.remove('winPlayerScore');
    document.getElementById('playerOScore').classList.remove('winPlayerScore');
    equalDisplay.classList.add('opacity-0');
    scoreboard.classList.remove('selectPlayerScore');
    resetBoard();
    gameActive = true;
    updateStatus();
    modeSelection.style.display = 'none';
    gameBoard.style.display = 'block';

    // Add 'visible' class to cells with delay
    cells.forEach((cell, index) => {
        setTimeout(() => {
            cell.classList.add('visible');
        }, index * 100);
    });
}

// Function to reset the game
function resetGame() {
    document.querySelectorAll('.cell.scale-in').forEach(button => {
        button.classList.remove('scale-in');
    });
    document.getElementById('playerXScore').classList.remove('winPlayerScore');
    document.getElementById('playerOScore').classList.remove('winPlayerScore');
    equalDisplay.classList.add('opacity-0');
    scoreboard.classList.remove('selectPlayerScore');

    resetBoard();
    gameActive = true;
    updateStatus();

    setTimeout(() => {
        cells.forEach((cell, index) => {
            setTimeout(() => {
                cell.classList.add('visible');
            }, index * 100);
        });
    }, 50);
}

// Function to reset the board
function resetBoard() {
    board.fill('');
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('win');
    });
}
