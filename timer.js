function createTimer(now = Date.now) {
  let remaining = 25 * 60 * 1000;
  let deadline = null;
  return {
    setMinutes(minutes) { if (!Number.isInteger(minutes) || minutes < 1 || minutes > 300) return false; remaining = minutes * 60000; deadline = null; return true; },
    start() { if (deadline === null && remaining > 0) deadline = now() + remaining; },
    pause() { if (deadline !== null) { remaining = Math.max(0, deadline - now()); deadline = null; } },
    seconds() { return Math.ceil((deadline === null ? remaining : Math.max(0, deadline - now())) / 1000); },
    running() { return deadline !== null; }
  };
}

if (typeof module !== 'undefined') module.exports = { createTimer };

if (typeof document !== 'undefined') {
  const timer = createTimer();
  const duration = document.querySelector('#duration');
  const display = document.querySelector('#display');
  const start = document.querySelector('#start');
  const pause = document.querySelector('#pause');
  const status = document.querySelector('#status');
  function render() {
    const seconds = timer.seconds();
    if (timer.running() && seconds === 0) { timer.pause(); status.textContent = 'Сессия завершена.'; }
    display.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    start.disabled = timer.running();
    pause.disabled = !timer.running();
    duration.disabled = timer.running();
  }
  duration.addEventListener('input', () => { if (timer.setMinutes(Number(duration.value))) { status.textContent = ''; render(); } });
  start.addEventListener('click', () => {
    if (!duration.reportValidity()) return;
    if (timer.seconds() === 0) timer.setMinutes(Number(duration.value));
    status.textContent = ''; timer.start(); render();
  });
  pause.addEventListener('click', () => { timer.pause(); render(); });
  setInterval(render, 250);
}
