class TicTacToeGame {
    constructor() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = false;
        this.currentPosition = 4;
        this.messageElement = document.getElementById('message');
        this.playButton = document.getElementById('playButton');
        this.restartButton = document.getElementById('restartButton');
        this.canvas = document.getElementById('gameCanvas');
        this.context = this.canvas.getContext('2d');
        this.cellSize = this.canvas.width / 3;

        this.winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        document.addEventListener('keydown', this.handleKeydown.bind(this));

        this.renderIntroScreen();
    }

    renderIntroScreen() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = '#000';
        this.context.font = '24px serif';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('Welcome to Tic Tac Toe', this.canvas.width / 2, this.canvas.height / 2 - 30);
        this.context.fillText('Press Enter to Start', this.canvas.width / 2, this.canvas.height / 2 + 30);
        
        document.addEventListener('keydown', this.handleStartKey.bind(this));
    }

    handleStartKey(event) {
        if (event.key === 'Enter') {
            document.removeEventListener('keydown', this.handleStartKey.bind(this));
            adBreak({
                type: 'preroll',
                name: 'coin_flip_preroll',
                adBreakDone: () => {
                    this.startGame();
                }
            });  
        }
    }

    startGame() {
        this.gameActive = true;
        this.messageElement.textContent = 'Player X moves';
        this.renderBoard();
    }

    renderBoard() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.board.forEach((cell, index) => {
            const x = (index % 3) * this.cellSize;
            const y = Math.floor(index / 3) * this.cellSize;
            this.context.fillStyle = index === this.currentPosition ? '#e88a1750' : '#fff';
            this.context.fillRect(x, y, this.cellSize, this.cellSize);
            this.context.strokeRect(x, y, this.cellSize, this.cellSize);

            if (cell) {
                this.context.fillStyle = '#000';
                this.context.font = '48px serif';
                this.context.textAlign = 'center';
                this.context.textBaseline = 'middle';
                this.context.fillText(cell, x + this.cellSize / 2, y + this.cellSize / 2);
            }
        });
    }

    checkWinner() {
        for (let combination of this.winningCombinations) {
            const [a, b, c] = combination;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                return this.board[a];
            }
        }

        if (this.board.every(cell => cell)) {
            return 'tie';
        }

        return null;
    }

    computerMove() {
        const findBestMove = (board, player) => {
            for (let combination of this.winningCombinations) {
                const [a, b, c] = combination;
                if (board[a] === player && board[b] === player && !board[c]) return c;
                if (board[a] === player && !board[b] && board[c] === player) return b;
                if (!board[a] && board[b] === player && board[c] === player) return a;
            }

            const opponent = player === 'O' ? 'X' : 'O';
            for (let combination of this.winningCombinations) {
                const [a, b, c] = combination;
                if (board[a] === opponent && board[b] === opponent && !board[c]) return c;
                if (board[a] === opponent && !board[b] && board[c] === opponent) return b;
                if (!board[a] && board[b] === opponent && board[c] === opponent) return a;
            }

            if (!board[4]) return 4;

            const availableMoves = board.map((val, index) => val === '' ? index : null).filter(val => val !== null);
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        };

        const bestMove = findBestMove(this.board, 'O');
        this.board[bestMove] = 'O';

        this.renderBoard();
        const winner = this.checkWinner();
        if (winner) {
            this.endGame(winner);
        } else {
            this.currentPlayer = 'X';
            this.messageElement.textContent = 'Player X moves';
        }
    }

    handleKeydown(event) {
        if (!this.gameActive || this.currentPlayer !== 'X') return;

        switch (event.key) {
            case 'ArrowUp':
                if (this.currentPosition > 2) this.currentPosition -= 3;
                break;
            case 'ArrowDown':
                if (this.currentPosition < 6) this.currentPosition += 3;
                break;
            case 'ArrowLeft':
                if (this.currentPosition % 3 !== 0) this.currentPosition -= 1;
                break;
            case 'ArrowRight':
                if (this.currentPosition % 3 !== 2) this.currentPosition += 1;
                break;
            case 'Enter':
                if (!this.board[this.currentPosition]) {
                    this.board[this.currentPosition] = 'X';
                    this.renderBoard();
                    const winner = this.checkWinner();
                    if (winner) {
                        this.endGame(winner);
                    } else {
                        this.currentPlayer = 'O';
                        this.messageElement.textContent = 'Player O moves';
                        setTimeout(this.computerMove.bind(this), 500);
                    }
                }
                break;
        }
        this.renderBoard();
    }

    endGame(winner) {
        if (winner === 'tie') {
            this.messageElement.textContent = 'It\'s a tie!';
        } else {
            this.messageElement.textContent = `Player ${winner} wins!`;
        }
        this.gameActive = false;
        setTimeout(this.askToRestart.bind(this), 2500);
    }

    askToRestart() {
        this.messageElement.textContent = 'Want to restart game?';
        this.restartButton.style.display = 'inline-block';
        this.restartButton.addEventListener('click', this.handleRestart.bind(this));
    }

    handleRestart() {
        this.restartButton.style.display = 'none';
        adBreak({
            type: 'preroll',
            name: 'coin_flip_preroll',
            adBreakDone: () => {
                this.resetGame();
            }
        });
    }

    resetGame() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.messageElement.textContent = 'Player X moves';
        this.renderBoard();
    }
}

const game = new TicTacToeGame();
