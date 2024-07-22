let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = false;
let currentPosition = 4;

const messageElement = document.getElementById('message');
const cells = document.querySelectorAll('.cell');

function renderBoard() {
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
        cell.style.backgroundColor = index === currentPosition ? '#e88a1750' : '#fff';
    });
}
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
function checkWinner() {
    // const winningCombinations = [
    //     [0, 1, 2],
    //     [3, 4, 5],
    //     [6, 7, 8],
    //     [0, 3, 6],
    //     [1, 4, 7],
    //     [2, 5, 8],
    //     [0, 4, 8],
    //     [2, 4, 6]
    // ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    if (board.every(cell => cell)) {
        return 'tie';
    }

    return null;
}

function computerMove() {
    function findBestMove(board, player) {


        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] === player && board[b] === player && !board[c]) return c;
            if (board[a] === player && !board[b] && board[c] === player) return b;
            if (!board[a] && board[b] === player && board[c] === player) return a;
        }

        const opponent = player === 'O' ? 'X' : 'O';
        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] === opponent && board[b] === opponent && !board[c]) return c;
            if (board[a] === opponent && !board[b] && board[c] === opponent) return b;
            if (!board[a] && board[b] === opponent && board[c] === opponent) return a;
        }

        if (!board[4]) return 4;

        const availableMoves = board.map((val, index) => val === '' ? index : null).filter(val => val !== null);
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    const bestMove = findBestMove(board, 'O');
    board[bestMove] = 'O';

    renderBoard();
    const winner = checkWinner();
    if (winner) {
        endGame(winner);
    } else {
        currentPlayer = 'X';
        messageElement.textContent = 'Ходи гравець X';
    }
}

function handleKeydown(event) {
    if (!gameActive || currentPlayer !== 'X') return;

    switch (event.key) {
        case 'ArrowUp':
            if (currentPosition > 2) currentPosition -= 3;
            break;
        case 'ArrowDown':
            if (currentPosition < 6) currentPosition += 3;
            break;
        case 'ArrowLeft':
            if (currentPosition % 3 !== 0) currentPosition -= 1;
            break;
        case 'ArrowRight':
            if (currentPosition % 3 !== 2) currentPosition += 1;
            break;
        case 'Enter':
            if (!board[currentPosition]) {
                board[currentPosition] = 'X';
                renderBoard();
                const winner = checkWinner();
                if (winner) {
                    endGame(winner);
                } else {
                    currentPlayer = 'O';
                    messageElement.textContent = 'Ходи гравець O';
                    setTimeout(computerMove, 500);
                }
            }
            break;
    }
    renderBoard();
}

function endGame(winner) {
    if (winner === 'tie') {
        messageElement.textContent = 'Нічия!';
    } else {
        messageElement.textContent = `Гравець ${winner} виграв!`;
    }
    gameActive = false;
    setTimeout(askToRestart, 500);
}

function askToStart() {
    const startGame = confirm('Ти хочеш грати?');
    if (startGame) {
        gameActive = true;
        messageElement.textContent = 'Ходи гравець X';
        renderBoard();
    }
}

function askToRestart() {
    const restartGame = confirm('Ти дійсно хочеш покинути гру?');
    if (restartGame) {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        messageElement.textContent = 'Ходи гравець X';
        renderBoard();
    }
}

document.addEventListener('keydown', handleKeydown);
askToStart();
