const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");

const gravity = 0.25;
const jump = -6;
let birdY = 150;
let birdX = 80;
let velocity = 0;
let pipes = [];
let score = 0;
let gameOver = false;

const birdImg = new Image();
birdImg.src = "https://i.ibb.co/F0D1qjJ/flappy-bird.png"; // Imagem do Flappy Bird original

const bgMusic = document.getElementById("bgMusic");

function resetGame() {
  birdY = 150;
  velocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  restartBtn.style.display = "none";
  gameLoop();
}

function createPipe() {
  const topHeight = Math.random() * 200 + 50;
  const gap = 120;
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
  const birdWidth = 34;
  const birdHeight = 24;

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
  ctx.fillText(`Score: ${score}`, 10, 40);
}

function gameLoop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  velocity += gravity;
  birdY += velocity;

  ctx.drawImage(birdImg, birdX, birdY, 34, 24);

  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    createPipe();
  }

  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= 2;
    drawPipe(pipes[i]);

    if (!pipes[i].passed && pipes[i].x + 50 < birdX) {
      score++;
      pipes[i].passed = true;
    }

    if (checkCollision(pipes[i])) {
      gameOver = true;
      restartBtn.style.display = "block";
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
