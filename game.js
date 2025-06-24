const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const restartBtn = document.getElementById("restartBtn");
const gameOverScreen = document.getElementById("gameOverScreen");
const bgMusic = document.getElementById("bgMusic");

const gravity = 0.25;
const jump = -6;

let birdX = canvas.width * 0.2;
let birdY = canvas.height / 2;
let velocity = 0;
let pipes = [];
let score = 0;
let gameOver = false;

const birdImg = new Image();
birdImg.src = "https://i.ibb.co/GF1bh5N/flappy-bird.png";

const birdWidth = 40;
const birdHeight = 30;

function resetGame() {
  birdX = canvas.width * 0.2;
  birdY = canvas.height / 2;
  velocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  gameOverScreen.style.display = "none";
  gameLoop();
}

function createPipe() {
  const topHeight = Math.random() * (canvas.height / 2);
  const gap = canvas.height * 0.2;
  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: canvas.height - topHeight - gap
  });
}

function drawPipe(pipe) {
  ctx.fillStyle = "green";
  ctx.fillRect(pipe.x, 0, 50, pipe.top);
  ctx.fillRect(pipe.x, canvas.height - pipe.bottom, 50, pipe.bottom);
}

function checkCollision(pipe) {
  if (
    birdX + birdWidth > pipe.x &&
    birdX < pipe.x + 50 &&
    (birdY < pipe.top || birdY + birdHeight > canvas.height - pipe.bottom)
  ) {
    return true;
  }
  if (birdY + birdHeight > canvas.height || birdY < 0) {
    return true;
  }
  return false;
}

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "32px Arial";
  ctx.fillText(`Score: ${score}`, 20, 50);
}

function gameLoop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  velocity += gravity;
  birdY += velocity;

  birdImg.onload = () => {
  bgMusic.volume = 0.5;
  gameLoop();
};

  ctx.drawImage(birdImg, birdX, birdY, birdWidth, birdHeight);

  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
    createPipe();
  }

  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= 3;
    drawPipe(pipes[i]);

    if (!pipes[i].passed && pipes[i].x + 50 < birdX) {
      score++;
      pipes[i].passed = true;
    }

    if (checkCollision(pipes[i])) {
      gameOver = true;
      gameOverScreen.style.display = "block";
      return;
    }
  }

  drawScore();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !gameOver) {
    velocity = jump;
  }
});

restartBtn.addEventListener("click", resetGame);

birdImg.onload = () => {
  bgMusic.volume = 0.5;
  gameLoop();
};
