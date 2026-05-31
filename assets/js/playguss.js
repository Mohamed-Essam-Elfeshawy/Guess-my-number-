const check = document.querySelector(".btn-check");
const message = document.querySelector(".message");
const again = document.querySelector(".btn-again");
const guessInput = document.querySelector(".guess");
const scoreDisplay = document.querySelector(".score");
const highscoreDisplay = document.querySelector(".highscore");
const numberDisplay = document.querySelector(".number");
const body = document.body;

let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = parseInt(localStorage.getItem("highscore")) || 0;

// Display initial highscore
highscoreDisplay.textContent = highscore;

const setMessage = function (msg, type = "default") {
  message.textContent = msg;
  message.classList.remove("correct", "wrong");
  if (type !== "default") {
    message.classList.add(type);
  }
};

const updateScore = function () {
  scoreDisplay.textContent = score;
  scoreDisplay.classList.remove("warning", "danger");
  
  if (score < 5) {
    scoreDisplay.classList.add("danger");
  } else if (score < 10) {
    scoreDisplay.classList.add("warning");
  }
};

const playGame = function () {
  const guess = Number(guessInput.value);

  if (!guess || guess < 1 || guess > 20) {
    setMessage("⚠️ ENTER A NUMBER BETWEEN 1-20!", "wrong");
    return;
  }

  if (guess === secretNumber) {
    // Correct answer
    setMessage("🎉 CORRECT NUMBER!", "correct");
    numberDisplay.textContent = secretNumber;
    numberDisplay.classList.add("reveal");
    
    if (score > highscore) {
      highscore = score;
      highscoreDisplay.textContent = highscore;
      localStorage.setItem("highscore", highscore);
    }
    
    check.disabled = true;
    guessInput.disabled = true;
    body.classList.add("game-won");
  } else if (guess !== secretNumber) {
    // Wrong answer
    if (score > 1) {
      setMessage(
        guess > secretNumber ? "📈 TOO HIGH!" : "📉 TOO LOW!",
        "wrong"
      );
      guessInput.classList.add("shake");
      setTimeout(() => guessInput.classList.remove("shake"), 400);
      score--;
      updateScore();
    } else {
      setMessage("💀 GAME OVER! You lost!", "wrong");
      body.classList.add("game-over");
      check.disabled = true;
      guessInput.disabled = true;
      score = 0;
      updateScore();
    }
  }

  guessInput.value = "";
};

// Event listeners
check.addEventListener("click", playGame);

guessInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    playGame();
  }
});

again.addEventListener("click", () => {
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  score = 20;
  updateScore();
  
  setMessage("START GUESSING...");
  numberDisplay.textContent = "?";
  numberDisplay.classList.remove("reveal");
  guessInput.value = "";
  guessInput.disabled = false;
  check.disabled = false;
  body.classList.remove("game-won", "game-over");
});

// Initialize display
updateScore();
