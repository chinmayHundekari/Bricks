var canvas, ctx;
var bricks, paddle, ball;
var leftKeyPressed, rightKeyPressed;

function moveBricks() {}

function checkCollision(b, collided) {
    var inp = 0;
    if (ball.pos.x + ball.size > b.pos.x && ball.pos.x - ball.size < b.pos.x + b.size.x) {
        if (ball.pos.y + ball.size > b.pos.y && ball.pos.y - ball.size < b.pos.y + b.size.y) {
            if (!collided) {
                vecX = ball.pos.x - (b.pos.x + b.size.x / 2);
                vecY = ball.pos.y - (b.pos.y + b.size.y / 2);
                if (vecX > b.size.x / 2 || vecX < -b.size.x / 2) {
                    ball.speed.x = -ball.speed.x;
                } else if (vecY > b.size.y / 2 || vecY < -b.size.y / 2) {
                    ball.speed.y = -ball.speed.y;
                }
            }
            b.alive = false;
            return true;
        }
    }
    return false;
}

function movePaddle() {
    if (leftKeyPressed && paddle.pos.x > 0) {
        paddle.pos.x -= paddle.speed;
    }
    if (rightKeyPressed && paddle.pos.x < canvas.width - paddle.size.x) {
        paddle.pos.x += paddle.speed;
    }
}

function moveBall() {
    if (ball.pos.x + ball.speed.x > canvas.width - ball.size || ball.pos.x + ball.speed.x < ball.size) {
        ball.speed.x = -ball.speed.x;
    }
    if (ball.pos.y + ball.speed.y < ball.size) {
        ball.speed.y = -ball.speed.y;
    } else if (ball.pos.y + ball.speed.y > canvas.height - ball.size - paddle.size.y) {
        if (ball.pos.x > paddle.pos.x - ball.size && ball.pos.x < paddle.pos.x + paddle.size.x + ball.size) {
            ball.speed.y = -ball.speed.y;
        } else {
            document.location.reload();
        }
    }
    ball.pos.x = ball.pos.x + ball.speed.x;
    ball.pos.y = ball.pos.y + ball.speed.y;
}

function move() {
    moveBall();
    movePaddle();
    moveBricks();
}

function drawBrick(b) {
    ctx.beginPath();
    ctx.fillStyle = b.color;
    ctx.rect(b.pos.x, b.pos.y, b.size.x, b.size.y);
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    collided = false;
    for (i = 0; i < bricks.length; i++) {
        b = bricks[i];
        if (b.alive) {
            nowCollided = checkCollision(b, collided);
            if (!nowCollided) {
                drawBrick(b);
            } else {
                collided = true;
            }
        }
    }
}

function drawPaddle() {
    ctx.beginPath();
    ctx.fillStyle = paddle.color;
    ctx.rect(paddle.pos.x, paddle.pos.y, paddle.size.x, paddle.size.y);
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.pos.x, ball.pos.y, ball.size, 0, 2 * Math.PI, false);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function draw() {
    drawBall();
    drawPaddle();
    drawBricks();
}

function play() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    move();
    draw();
}

function keyDown(e) {
    if (e.keyCode == 37) {
        leftKeyPressed = true;
    } else if (e.keyCode == 39) {
        rightKeyPressed = true;
    }
}

function keyUp(e) {
    if (e.keyCode == 37) {
        leftKeyPressed = false;
    } else if (e.keyCode == 39) {
        rightKeyPressed = false;
    }
}

function initPaddle() {
    paddleSizeY = 10;
    paddle = {
        size: {
            x: 50,
            y: paddleSizeY
        },
        pos: {
            x: canvas.width / 2,
            y: canvas.height - paddleSizeY
        },
        speed: 5,
        color: "#FF0000"
    };
    document.addEventListener("keydown", keyDown, false);
    document.addEventListener("keyup", keyUp, false);
}

function initBall() {
    ballSize = 10;
    ball = {
        size: ballSize,
        pos: {
            x: canvas.width / 2,
            y: canvas.height - (ballSize + paddle.size.y)
        },
        speed: {
            x: 1,
            y: -1
        },
        color: "#0000FF"
    };
}

function initBricks() {
    for (i = 0; i < 64; i++) {
        var brick = {
            size: {
                x: 30,
                y: 10
            },
            pos: {
                x: (i % 8) * 31,
                y: Math.floor((i / 8)) * 11
            },
            color: "#00FF00",
            alive: true
        };
        if (i == 0)
            bricks = [brick];
        else
            bricks.push(brick);
    }
}

function initGame() {
    initPaddle();
    initBall();
    initBricks();
}

function init() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    initGame();
    setInterval(play, 10);
}

window.onload = init;