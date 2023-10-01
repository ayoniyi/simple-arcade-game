let canvas;
let canvasContext;
let ballX = 50;
let ballY = 50;
let ballSpeedX = 10;
let ballSpeedY = 4;

let playerScore = 0;
let AIScore = 0;

let showWinScreen = false;

let paddle1Y = 250;
let paddle2Y = 250;
const paddle_height = 100;
const paddle_thickness = 10;
const paddle_centre = paddle_height / 2;
const winning_score = 3;

const calculateMousePos = (event) => {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;
  let mouseX = event.clientX - rect.left - root.scrollLeft;
  let mouseY = event.clientY - rect.top - root.scrollTop;

  return {
    x: mouseX,
    y: mouseY,
  };
};

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");
  const framesPerSecond = 30;
  setInterval(function () {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);

  canvas.addEventListener("mousemove", function (event) {
    let mousePos = calculateMousePos(event);
    paddle1Y = mousePos.y - paddle_height / 2;
  });
};

const ballReset = (outcome) => {
  if (playerScore >= winning_score || AIScore >= winning_score) {
    //alert("Someone won");
    showWinScreen = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  if (outcome === "lose") {
    const speech = new SpeechSynthesisUtterance();
    const voices = window.speechSynthesis.getVoices();
    console.log(voices);
    speech.text = "You are very very very bad at this aren't you?";
    speech.volume = 1;
    speech.rate = 0.4;
    speech.pitch = 1;
    //speech.lang = "en-US";
    speech.voice = voices[49];
    window.speechSynthesis.speak(speech);
    alert("You missed!");
  } else {
    alert("You won!");
  }
};

const AIMovement = () => {
  let paddle2YCenter = paddle2Y + paddle_height / 2;
  if (paddle2YCenter < ballY - 35) {
    //paddle2Y = paddle2Y + 6
    paddle2Y += 6;
  } else if (paddle2YCenter > ballY + 35) {
    //paddle2Y = paddle2Y - 6
    paddle2Y -= 6;
  }
};

const moveEverything = () => {
  // if(showWinScreen){
  //     return
  // }
  AIMovement();
  // reflecting the ball
  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;
  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + paddle_height) {
      ballSpeedX = -ballSpeedX;

      // make game more complex
      let deltaY = ballY - (paddle1Y + paddle_height / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      AIScore++;
      ballReset("lose");
    }
    //ballSpeedX = -ballSpeedX;
  }
  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + paddle_height) {
      ballSpeedX = -ballSpeedX;

      // make game more complex
      let deltaY = ballY - (paddle2Y + paddle_centre);
      ballSpeedY = deltaY * 0.35;
    } else {
      playerScore++;
      ballReset("win");
    }
    //ballSpeedX = -ballSpeedX;

    //ballSpeedX = -ballSpeedX;
  }

  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
};

const drawNet = () => {
  for (var i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "white");
  }
};

const drawEverything = () => {
  //console.log(ballX);
  colorRect(0, 0, canvas.width, canvas.height, "black");

  drawNet();

  // the left player paddle
  canvasContext.fillStyle = "white";
  canvasContext.fillRect(0, paddle1Y, paddle_thickness, paddle_height);

  // the right AI paddle
  canvasContext.fillStyle = "white";
  canvasContext.fillRect(
    canvas.width - 10,
    paddle2Y,
    paddle_thickness,
    paddle_height
  );

  //draw a small rectangle as ball
  //canvasContext.fillRect(ballX, 100, 10, 10);
  // draw ball manually
  //   canvasContext.arc(ballX, 100, 10, 0, Math.PI * 2, true);
  //   canvasContext.fill();
  // draw the ball
  colorCircle(ballX, ballY, 9, "white");

  canvasContext.fillText(`Player score ${playerScore}`, 100, 100);
  canvasContext.fillText(`AI score ${AIScore}`, canvas.width - 100, 100);
};

const colorCircle = (centerX, centerY, radius, drawColor) => {
  canvasContext.fillStyle = drawColor;
  //canvasContext.fillRect(ballX, 100, 10, 10);
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
};

const colorRect = (leftX, topY, width, height, drawColor) => {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
};
