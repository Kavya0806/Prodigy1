const boardElem = document.getElementById('board');
const statusElem = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const newgameBtn = document.getElementById('newgame');
const modeRadios = document.getElementsByName('mode');
const scoreXElem = document.getElementById('score-x');
const scoreOElem = document.getElementById('score-o');
const scoreDrawElem = document.getElementById('score-draw');

let board, currentPlayer, winner, gameOver, mode;
let score = { X: 0, O: 0, draw: 0 };

function initBoard() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  winner = null;
  gameOver = false;
  renderBoard();
  setStatus(`Current: ${playerString(currentPlayer)}`);
  highlightBoard();
}

function renderBoard() {
  boardElem.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.idx = i;
    cell.textContent = board[i];
    if (board[i]) cell.classList.add('taken');
    cell.tabIndex = 0;
    cell.onclick = handleCellClick;
    cell.onkeydown = (e) => { if (e.key === "Enter" || e.key === ' ') cell.click(); };
    boardElem.appendChild(cell);
  }
}

function handleCellClick(e) {
  if (gameOver) return;
  const idx = e.currentTarget.dataset.idx;
  if (board[idx]) return;
  board[idx] = currentPlayer;
  renderBoard();
  if (checkWin()) {
    winner = currentPlayer;
    score[winner]++;
    setStatus(`${playerString(winner)} wins!`);
    highlightWinner();
    gameOver = true;
  } else if (board.every(Boolean)) {
    score.draw++;
    setStatus("It's a draw!");
    highlightBoard('draw');
    gameOver = true;
  } else {
    currentPlayer = otherPlayer(currentPlayer);
    setStatus(`Current: ${playerString(currentPlayer)}`);
    if (mode === 'ai' && currentPlayer === 'O') {
      setTimeout(AIMove, 400);
    }
  }
  updateScores();
}

function playerString(p) {
  return p === 'X' ? '❌ X' : '🟡 O';
}

function otherPlayer(p) {
  return p === 'X' ? 'O' : 'X';
}

// Minimax implementation for unbeatable AI
function AIMove() {
  if (gameOver) return;
  let best = minimax(board, 'O');
  board[best.idx] = 'O';
  renderBoard();
  if (checkWin()) {
    winner = 'O';
    score.O++;
    setStatus(`${playerString('O')} wins!`);
    highlightWinner();
    gameOver = true;
  } else if (board.every(Boolean)) {
    score.draw++;
    setStatus("It's a draw!");
    highlightBoard('draw');
    gameOver = true;
  } else {
    currentPlayer = 'X';
    setStatus(`Current: ${playerString('X')}`);
  }
  updateScores();
}

// Minimax logic
function minimax(newBoard, player) {
  const availSpots = newBoard.map((v,i) => v === '' ? i : null).filter(v => v != null);

  if (winning(newBoard, 'X')) return { score: -10 };
  if (winning(newBoard, 'O')) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  let moves = [];
  for (let i of availSpots) {
    let move = { idx: i };
    newBoard[i] = player;
    let result = minimax(newBoard, otherPlayer(player));
    move.score = result.score;
    newBoard[i] = '';
    moves.push(move);
  }
  if (player === 'O') {
    let max = moves.reduce((a, b) => a.score > b.score ? a : b);
    return max;
  } else {
    let min = moves.reduce((a, b) => a.score < b.score ? a : b);
    return min;
  }
}

// Checks for win and highlights
function checkWin() {
  const winlines = [
    [0,1,2],[3,4,5],[6,7,8], [0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
  ];
  return winlines.some(line => {
    const [a,b,c] = line;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      winner = board[a];
      boardElem.querySelectorAll('.cell').forEach(cell => {
        if (line.includes(+cell.dataset.idx)) cell.classList.add('winner');
      });
      return true;
    }
    return false;
  });
}

// Win test for minimax only
function winning(arr, pl) {
  const winlines = [
    [0,1,2],[3,4,5],[6,7,8], [0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
  ];
  return winlines.some(([a,b,c]) => arr[a] === pl && arr[b] === pl && arr[c] === pl);
}

function setStatus(msg) { statusElem.textContent = msg; }
function updateScores() {
  scoreXElem.textContent = `X: ${score.X}`;
  scoreOElem.textContent = `O: ${score.O}`;
  scoreDrawElem.textContent = `Draws: ${score.draw}`;
}

function highlightWinner() {
  document.querySelectorAll('.cell.winner').forEach(cell => {
    cell.classList.add('winner');
  });
}

function highlightBoard(type) {
  if (type === 'draw') {
    document.querySelectorAll('.cell').forEach(cell => cell.classList.add('winner'));
  }
}

restartBtn.onclick = () => initBoard();
newgameBtn.onclick = () => {
  score = { X: 0, O: 0, draw: 0 };
  updateScores();
  initBoard();
};
modeRadios.forEach(radio => {
  radio.onchange = function() {
    mode = this.value;
    initBoard();
  };
});

function getMode() {
  return Array.from(modeRadios).find(r=>r.checked).value;
}

// INIT
mode = getMode();
initBoard();
updateScores();
boardElem.focus();
document.body.onkeydown = (e) => {
  if (e.key === 'r' || e.key === 'R') {
    restartBtn.click();
  } else if (e.key === 'n' || e.key === 'N') {
    newgameBtn.click();
  }
}