'use strict';

const check     = document.querySelector('.check');
const again     = document.querySelector('.again');
const message   = document.querySelector('.message');
const numBox    = document.querySelector('.number');
const guessInput = document.querySelector('.guess');
const scoreEl   = document.querySelector('.score');
const hsEl      = document.querySelector('.highscore');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeBtn = document.querySelector('.close');
const applyBtn = document.getElementById('applySettings');
const difficultySelect = document.getElementById('difficulty');
const soundToggle = document.getElementById('soundToggle');
const animationToggle = document.getElementById('animationToggle');
const rangeDisplay = document.getElementById('rangeDisplay');
const attemptsDisplay = document.querySelector('#attempts');

let secretNumber;
let score;
let highscore = localStorage.getItem('highscore') || 0;
let maxScore;
let maxAttempts;
let done = false;
let soundEnabled = true;
let animationsEnabled = true;
let difficulty = 'normal';

// Difficulty settings
const difficulties = {
  easy: { max: 50, attempts: 50 },
  normal: { max: 20, attempts: 20 },
  hard: { max: 100, attempts: 15 },
  insane: { max: 1000, attempts: 10 }
};

hsEl.textContent = String(highscore).padStart(2, '0');

function randomNum(max) {
  return Math.trunc(Math.random() * max) + 1;
}

function setMessage(txt, cls) {
  message.textContent = txt;
  message.className = 'message' + (cls ? ' ' + cls : '');
}

function updateScore() {
  scoreEl.textContent = String(score).padStart(2, '0');
  if (score > maxScore / 2) scoreEl.className = 'score';
  else if (score > maxScore / 4) scoreEl.className = 'score warn';
  else scoreEl.className = 'score danger';
}

function triggerShake(el) {
  if (!animationsEnabled) return;
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'success') {
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'error') {
      oscillator.frequency.value = 400;
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  } catch (e) {
    console.log('Audio not available');
  }
}

function initGame() {
  const settings = difficulties[difficulty];
  maxScore = settings.attempts;
  maxAttempts = settings.attempts;
  secretNumber = randomNum(settings.max);
  score = maxScore;
  done = false;

  numBox.textContent = '?';
  numBox.className = animationsEnabled ? 'number' : 'number no-anim';
  document.body.classList.remove('won', 'lost');

  setMessage('ENTER YOUR GUESS', '');
  updateScore();
  attemptsDisplay.textContent = score;
  rangeDisplay.textContent = `[ RANGE: 1 — ${settings.max} ]`;

  guessInput.value = '';
  guessInput.focus();
  guessInput.min = 1;
  guessInput.max = settings.max;
}

// Settings Modal
settingsBtn.addEventListener('click', () => {
  settingsModal.style.display = 'block';
  difficultySelect.value = difficulty;
  soundToggle.checked = soundEnabled;
  animationToggle.checked = animationsEnabled;
});

closeBtn.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === settingsModal) {
    settingsModal.style.display = 'none';
  }
});

applyBtn.addEventListener('click', () => {
  difficulty = difficultySelect.value;
  soundEnabled = soundToggle.checked;
  animationsEnabled = animationToggle.checked;
  
  if (animationsEnabled) {
    document.body.style.animationDuration = 'auto';
  }
  
  settingsModal.style.display = 'none';
  initGame();
  playSound('success');
});

// CHECK button
check.addEventListener('click', function () {
  if (done) return;

  const guess = Number(guessInput.value);
  const settings = difficulties[difficulty];

  if (!guess || guess < 1 || guess > settings.max) {
    setMessage(`⚠ ENTER NUMBER BETWEEN 1-${settings.max}`, '');
    triggerShake(guessInput);
    playSound('error');
    return;
  }

  if (guess === secretNumber) {
    // WIN
    setMessage('✦ ACCESS GRANTED ✦', 'won');
    numBox.textContent = secretNumber;
    if (animationsEnabled) numBox.classList.add('reveal');
    document.body.classList.add('won');
    playSound('success');

    if (score > highscore) {
      highscore = score;
      localStorage.setItem('highscore', highscore);
      hsEl.textContent = String(highscore).padStart(2, '0');
    }
    done = true;
  } else {
    // WRONG
    score--;
    updateScore();
    attemptsDisplay.textContent = score;
    playSound('error');

    if (score < 1) {
      setMessage('✖ SYSTEM FAILURE', 'lost');
      numBox.textContent = secretNumber;
      if (animationsEnabled) numBox.classList.add('reveal');
      document.body.classList.add('lost');
      done = true;
    } else {
      const isHigh = guess > secretNumber;
      setMessage(isHigh ? '▼ TOO HIGH' : '▲ TOO LOW', isHigh ? 'high' : 'low');
      triggerShake(guessInput);
    }
  }

  guessInput.value = '';
});

// RESTART button
again.addEventListener('click', function () {
  initGame();
  playSound('success');
});

// Allow Enter key
guessInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !done) check.click();
});

// Initialize game on load
initGame();