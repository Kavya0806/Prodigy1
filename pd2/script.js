let interval;
let startTime = 0;
let elapsedTime = 0;
let running = false;
let lapTimes = [];

const hoursSpan = document.getElementById('hours');
const minutesSpan = document.getElementById('minutes');
const secondsSpan = document.getElementById('seconds');
const millisecondsSpan = document.getElementById('milliseconds');
const lapList = document.getElementById('lapList');

function updateDisplay(time) {
  const ms = Math.floor((time % 1000) / 10);
  const s = Math.floor((time / 1000) % 60);
  const m = Math.floor((time / (1000 * 60)) % 60);
  const h = Math.floor((time / (1000 * 60 * 60)) % 24);

  hoursSpan.textContent = h.toString().padStart(2, '0');
  minutesSpan.textContent = m.toString().padStart(2, '0');
  secondsSpan.textContent = s.toString().padStart(2, '0');
  millisecondsSpan.textContent = ms.toString().padStart(2, '0');
}

function startStopwatch() {
  if (!running) {
    running = true;
    startTime = Date.now() - elapsedTime;
    interval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      updateDisplay(elapsedTime);
    }, 10);
  }
}

function pauseStopwatch() {
  if (running) {
    running = false;
    clearInterval(interval);
  }
}

function resetStopwatch() {
  running = false;
  clearInterval(interval);
  elapsedTime = 0;
  lapTimes = [];
  updateDisplay(0);
  renderLaps();
}

function lapStopwatch() {
  if (!running) return;
  lapTimes.push(elapsedTime);
  renderLaps();
}

function renderLaps() {
  lapList.innerHTML = '';
  lapTimes.forEach((lap, idx) => {
    const li = document.createElement('li');
    li.textContent = `Lap ${idx + 1}: ${formatTime(lap)}`;
    lapList.appendChild(li);
  });
}

function formatTime(time) {
  const ms = Math.floor((time % 1000) / 10);
  const s = Math.floor((time / 1000) % 60);
  const m = Math.floor((time / (1000 * 60)) % 60);
  const h = Math.floor((time / (1000 * 60 * 60)) % 24);
  return (
    h.toString().padStart(2, '0') + ':' +
    m.toString().padStart(2, '0') + ':' +
    s.toString().padStart(2, '0') + '.' +
    ms.toString().padStart(2, '0')
  );
}

// Button event listeners
document.getElementById('start').onclick = startStopwatch;
document.getElementById('pause').onclick = pauseStopwatch;
document.getElementById('reset').onclick = resetStopwatch;
document.getElementById('lap').onclick = lapStopwatch;

// Initialize display
updateDisplay(0);