'use strict';

const check     = document.querySelector('.check');
const again     = document.querySelector('.again');
const message   = document.querySelector('.message');
const numBox    = document.querySelector('.number');
const guessInput = document.querySelector('.guess');
const scoreEl   = document.querySelector('.score');
const hsEl      = document.querySelector('.highscore');

let secretNumber = randomNum();
let score = 20;
let highscore = 0;
let done = false;

function randomNum() {
  return Math.trunc(Math.random() * 20) + 1;
}

function setMessage(txt, cls) {
  message.textContent = txt;
  message.className = 'message' + (cls ? ' ' + cls : '');
}

function updateScore() {
  scoreEl.textContent = String(score).padStart(2, '0');
  if (score > 10) scoreEl.className = 'score';
  else if (score > 5) scoreEl.className = 'score warn';
  else scoreEl.className = 'score danger';
}

function triggerShake(el) {
  el.classList.remove('shake');
  void el.offsetWidth; // reflow
  el.classList.add('shake');
}

// CHECK button
check.addEventListener('click', function () {
  if (done) return;

  const guess = Number(guessInput.value);

  if (!guess || guess < 1 || guess > 20) {
    setMessage('⚠ INVALID INPUT', '');
    triggerShake(guessInput);
    return;
  }

  if (guess === secretNumber) {
    // WIN
    setMessage('✦ ACCESS GRANTED ✦', 'won');
    numBox.textContent = secretNumber;
    numBox.classList.add('reveal');
    document.body.classList.add('won');

    if (score > highscore) {
      highscore = score;
      hsEl.textContent = String(highscore).padStart(2, '0');
    }
    done = true;
  } else {
    // WRONG
    score--;
    updateScore();

    if (score < 1) {
      setMessage('✖ SYSTEM FAILURE', 'lost');
      numBox.textContent = secretNumber;
      numBox.classList.add('reveal');
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
  secretNumber = randomNum();
  score = 20;
  done = false;

  numBox.textContent = '?';
  numBox.className = 'number';
  document.body.classList.remove('won', 'lost');

  setMessage('ENTER YOUR GUESS', '');
  updateScore();

  guessInput.value = '';
  guessInput.focus();
});

// Allow Enter key
guessInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') check.click();
});