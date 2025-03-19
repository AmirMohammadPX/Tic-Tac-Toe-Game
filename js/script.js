//https://github.com/AmirMohammadPX/Tic-Tac-Toe-Game
// Game state initialization
const board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X'; // Current player (X or O)
let gameActive = false;
let gameMode = '';
let difficulty = '';
let scores = { X: 0, O: 0 };
let playerSymbol = 'X'; // Player's symbol (X or O)
let computerSymbol = 'O'; // Computer's symbol (O or X)

// Define winning combinations
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
const playerOName = document.getElementById('playerOName');
const playerXName = document.getElementById('playerXName');
const scoreXDisplay = document.getElementById('scoreX');
const scoreODisplay = document.getElementById('scoreO');
const modeSelection = document.getElementById('modeSelection');
const playerOIcon = document.getElementById('playerO-icon');
const gameBoard = document.getElementById('gameBoard');

// Create game board cells
const boardElement = document.querySelector('.board');
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-index', i);
    boardElement.appendChild(cell);
}
const cells = document.querySelectorAll('.cell');

// Create game controls container
const controlsContainer = document.createElement('div');
controlsContainer.className = 'game-controls';
gameBoard.appendChild(controlsContainer);

// Move control buttons to container
controlsContainer.appendChild(resetButton);
controlsContainer.appendChild(changeModeButton);

// Event listeners for game mode buttons
document.getElementById('twoPlayers').addEventListener('click', () => {
    gameMode = 'two';
    startGame();
});

document.getElementById('easy').addEventListener('click', () => {
    gameMode = 'single';
    difficulty = 'Easy';
    startGame();
});

document.getElementById('medium').addEventListener('click', () => {
    gameMode = 'single';
    difficulty = 'Medium';
    startGame();
});

document.getElementById('impossible').addEventListener('click', () => {
    gameMode = 'single';
    difficulty = 'Impossible';
    startGame();
});

// Event listener for switching symbols (X or O)
document.getElementById('switchSymbol').addEventListener('click', () => {
    if (playerSymbol === 'X') {
        playerSymbol = 'O'; // Player chooses O
        computerSymbol = 'X'; // Computer is X
        document.getElementById('switchSymbol').textContent = 'Switch to X'; // Update button text
    } else {
        playerSymbol = 'X'; // Player chooses X
        computerSymbol = 'O'; // Computer is O
        document.getElementById('switchSymbol').textContent = 'Switch to O'; // Update button text
    }
    currentPlayer = 'X'; // X always starts the game
});

// Event listeners for game controls
resetButton.addEventListener('click', resetGame);
changeModeButton.addEventListener('click', changeMode);

// Add click handlers to all cells
cells.forEach(cell => {
    cell.addEventListener('click', () => cellClick(cell));
});

// Function to change game mode
function changeMode() {
    // Reset scores
    scores = { X: 0, O: 0 };
    scoreXDisplay.textContent = '0';
    scoreODisplay.textContent = '0';

    // Hide game board and show mode selection
    gameBoard.style.display = 'none';
    modeSelection.style.display = '';

    // Reset the board
    resetBoard();
}

// Function to handle cell clicks
function cellClick(cell) {
    const index = cell.getAttribute('data-index');

    // Ignore click if cell is filled or game is inactive
    if (board[index] !== '' || !gameActive) return;

    // Update cell and check for winner
    updateCell(cell, index);
    checkForWinner();

    // Handle computer move in single-player mode
    if (gameMode === 'single' && gameActive && currentPlayer === computerSymbol) {
        gameActive = false;
        setTimeout(() => computerMove(), 500);
    }
}

// Function to update cell content
function updateCell(cell, index) {
    board[index] = currentPlayer; // Update board state
    cell.textContent = currentPlayer; // Update cell display
    cell.classList.add('scale-in'); // Add animation
}

// Function to switch players
function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
}

// Function to update game status display
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

// Function to check for winner
function checkForWinner() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            // Remove selection highlights
            document.getElementById('playerXScore').classList.remove('selectPlayerScore');
            document.getElementById('playerOScore').classList.remove('selectPlayerScore');

            // Highlight winner
            if (currentPlayer === 'X') {
                document.getElementById('playerXScore').classList.add('winPlayerScore');
            } else {
                document.getElementById('playerOScore').classList.add('winPlayerScore');
            }

            // Highlight winning cells
            highlightWinningCells(combination);
            updateScore(currentPlayer);

            // Auto reset after delay
            setTimeout(() => {
                resetGame();
            }, 2005);

            return;
        }
    }

    // Check for draw
    if (!board.includes('')) {
        document.getElementById('playerXScore').classList.remove('selectPlayerScore');
        document.getElementById('playerOScore').classList.remove('selectPlayerScore');
        equalDisplay.classList.remove('opacity-0');
        scoreboard.classList.add('selectPlayerScore');
        gameActive = false;

        // Auto reset after delay
        setTimeout(() => {
            resetGame();
        }, 1500);

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

// Function to handle computer move
function computerMove() {
    let index;
    switch (difficulty) {
        case 'Easy':
            index = Math.random() < 0.7 ? getSmartMove() : getRandomEmptyCell(); // 70% smart moves
            break;
        case 'Medium':
            index = Math.random() < 0.9 ? getSmartMove() : getRandomEmptyCell(); // 90% smart moves
            break;
        case 'Impossible':
            index = getBestMove(); // Always best move
            break;
        default:
            index = getRandomEmptyCell(); // Random move
    }
    const cell = document.querySelector(`[data-index="${index}"]`);
    updateCell(cell, index); // Update the cell
    checkForWinner(); // Check for a winner
}

// Function to get random empty cell
function getRandomEmptyCell() {
    const emptyCells = board.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Function to get a smart move (block or win)
function getSmartMove() {
    // Check for a winning move
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = computerSymbol;
            if (checkWinner() === computerSymbol) {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }

    // Block player's winning move
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = playerSymbol;
            if (checkWinner() === playerSymbol) {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }

    // Take center if available
    if (board[4] === '') return 4;

    // Take corners
    const corners = [0, 2, 6, 8];
    const freeCorners = corners.filter(i => board[i] === '');
    if (freeCorners.length > 0) {
        return freeCorners[Math.floor(Math.random() * freeCorners.length)];
    }

    // Take edges
    const edges = [1, 3, 5, 7];
    const freeEdges = edges.filter(i => board[i] === '');
    if (freeEdges.length > 0) {
        return freeEdges[Math.floor(Math.random() * freeEdges.length)];
    }

    return getRandomEmptyCell(); // Fallback to random move
}

// Function to get the best move (Minimax algorithm)
function getBestMove() {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = computerSymbol;
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

// Minimax algorithm implementation
function minimax(board, depth, isMaximizing) {
    const scores = { X: -1, O: 1, tie: 0 }; // Scores for X, O, and tie
    const result = checkWinner();
    if (result !== null) return scores[result];

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = computerSymbol;
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
                board[i] = playerSymbol;
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Function to check for a winner (for Minimax)
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

// Function to start game
function startGame() {
    if (gameMode === 'single') {
        statusDisplay.textContent = `Single Player(${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)})`;
        playerOIcon.classList.remove('bi-person-fill');
        playerOIcon.classList.add('bi-robot');
        playerXName.textContent = "You";
        playerOName.textContent = "Robot";

        // Update player and computer symbols
        if (playerSymbol === 'X') {
            currentPlayer = 'X'; // Player starts as X
        } else {
            currentPlayer = 'O'; // Player starts as O
            // If player is O, computer (X) makes the first move
            setTimeout(() => computerMove(), 500);
        }
    } else {
        statusDisplay.textContent = "Two Players";
        playerOIcon.classList.remove('bi-robot');
        playerOIcon.classList.add('bi-person-fill');
        playerXName.textContent = "Player1";
        playerOName.textContent = "Player2";

        // In two-player mode, X always starts
        currentPlayer = 'X';
    }

    // Reset animations and styles
    document.querySelectorAll('.cell.scale-in').forEach(button => {
        button.classList.remove('scale-in');
    });
    document.getElementById('playerXScore').classList.remove('winPlayerScore');
    document.getElementById('playerOScore').classList.remove('winPlayerScore');
    equalDisplay.classList.add('opacity-0');
    scoreboard.classList.remove('selectPlayerScore');

    // Reset board and start game
    resetBoard();
    gameActive = true;
    updateStatus();

    // Show game board
    modeSelection.style.display = 'none';
    gameBoard.style.display = '';

    // Animate cells appearance
    cells.forEach((cell, index) => {
        setTimeout(() => {
            cell.classList.add('visible');
        }, index * 100);
    });
}

// Function to reset game
function resetGame() {
    // Reset animations and styles
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

    // Animate cells reset
    setTimeout(() => {
        cells.forEach((cell, index) => {
            cell.classList.add('reset-animation');
            setTimeout(() => {
                cell.classList.remove('reset-animation');
                cell.classList.add('visible');
            }, 500 + (index * 100));
        });
    }, 50);
}

// Function to reset board
function resetBoard() {
    board.fill('');
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('win');
    });
}