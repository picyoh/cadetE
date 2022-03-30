//DOM
const header = document.querySelector('header');
const body = document.querySelector('body');
const footer = document.querySelector('footer');
//ball
var ball;
var ballPos = [];
//map
var map;
var mapPath;
var mapArray = [];
//controls
var isPressed = false;
var upPressed = false;
var leftPressed = false;
var rightPressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


var world = {
  canvas : document.createElement("canvas"),
  start: function() {
    this.canvas.width = window.innerWidth - 100;
    this.canvas.height = window.innerHeight - 2 * document.querySelector('header').clientHeight;
    this.context= this.canvas.getContext("2d");
    this.canvas.id = "cadetEscape";
    document.querySelector('section').appendChild(this.canvas);
    this.interval = setInterval(updateWorld, 40);
  },
  stop: function(){
    clearInterval(this.interval);
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function Ball(x, y, radius, color) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.gravity = 1;
    this.gravitySpeed = 0;
    this.bounce = 0.2;
    this.groundContact= false;
    let ballStartAngle = 0;
    let ballEndAngle = 2 * Math.PI;

    this.update = function() {

      ctx = world.context;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, ballStartAngle, ballEndAngle);
      ctx.fill();
    }

    this.newPos = function() {

      this.gravitySpeed += this.gravity;
      this.x += this.speedX;
      this.y += this.speedY + this.gravitySpeed;
      ballPos = [];
      ballPos.push(this.x);
      ballPos.push(this.y);
      ballPos.push(this.radius);

      this.hitGround();
      this.friction();
    }

    this.hitGround = function() {

      var groundHeight = world.canvas.height - this.radius;

      if (this.y > groundHeight) {
        this.groundContact = true;
        this.x = this.x;
        this.y = groundHeight;
        this.speedX = this.speedX;
        this.gravitySpeed = -(this.gravitySpeed) * this.bounce;
      } else if (this.y < groundHeight){
        this.groundContact = false;
      }
/*
      if(){
      //sortir donnée ballpos dans var

        let rb = ballPos[2];
        let xb = ballPos[0] + rb;
        let yb = ballPos[1] + rb;

        //sortir les valeurs par 4 du tableau
        for (let a = 0; a < (mapArray.length) /4 ; a++){
          let xm = mapArray[a];
          let ym = mapArray[a + 1];
          let rMap = mapArray[a + 2];
          let checkClock = mapArray[a + 3];
          console.log(rMap);

        //comparer x,y ball avec les x,y consécutifs
          let squareDistance = (xb - xm) * (xb - xm) + (yb - ym) * (yb - ym);
          let radiusDiffSquare = ((rb + rMap ) * (rb + rMap));

          if (checkClock == true){
            if (squareDistance >= radiusDiffSquare){
              this.y = y;
            }
          }else if (checkClock == false){
            if (squareDistance <= radiusDiffSquare){
              console.log("false");
            }
          }
        }
      }
      */
    }

    this.friction = function() {

      if ((this.groundContact == true) && (isPressed == false)) {
        if(this.speedX > 0){

          this.speedX *= 100;
          this.speedX -= 10;
          this.speedX = Math.round(ball.speedX);
          this.speedX /= 100;

        } else if (this.speedX < 0){

          this.speedX *= 100;
          this.speedX += 10;
          this.speedX = Math.round(ball.speedX);
          this.speedX /= 100;

        }
      }
    }
  }

function Curve(radius, arcLength, n) {

    let offsety = (Math.sin(arcLength * Math.PI)) * radius;
    let offsetx = Math.sqrt((radius * radius) - (offsety * offsety));
    let x = radius;
    let y = 4 * radius;
    this.radius = radius;
    let startAngle = (1 - arcLength) * Math.PI;
    let endAngle = (arcLength) * Math.PI;
    let clockwise = true;
    let diff = radius - offsetx;
    let yscnd = y + 2 * offsety;
    let canvasBottom = world.canvas.height;
    let xMax = (n * offsetx) + (n * radius) - (3 * diff);

    this.update = function(){

      ctx = world.context;
      mapPath = new Path2D();
      mapPath.arc(x, y, radius, Math.PI, endAngle, true);
      mapArray = [];
      mapArray.push(x);
      mapArray.push(y);
      mapArray.push(radius);
      mapArray.push(clockwise);
      clockwise = false;

      for (let i = 1; i < n; i++) {

        let j = i + 1;
        let k = i - 1;

        if(i%2 == 0){

          let xscnd = (i * x) + (j * offsetx) - (k * diff);

          mapArray.push(xscnd);
          mapArray.push(y);
          mapArray.push(radius);
          mapArray.push(clockwise);

          mapPath.arc(xscnd, y, radius, startAngle, endAngle, true);
          clockwise = false;

        }else{

          let xscnd = (i * x) + (j * offsetx) - (k * diff);

          mapArray.push(xscnd);
          mapArray.push(yscnd);
          mapArray.push(radius);
          mapArray.push(clockwise);

          mapPath.arc(xscnd, yscnd, radius, -startAngle, -endAngle, false);
          clockwise = true;

        }
      }

      mapPath.lineTo(xMax, canvasBottom);
      mapPath.lineTo(0, canvasBottom);
      mapPath.lineTo(0, y);
      mapPath.closePath();
      ctx.fillStyle = "black";
      ctx.stroke(mapPath);

    }
  }

//controls
function keyDownHandler(e){
  if(e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
    isPressed = true;
    moveleft();
  } else if(e.key == "Right" || e.key == "ArrowRight"){
    rightPressed = true;
    isPressed = true;
    moveright();
  }
}

function keyUpHandler(e){
  if(e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
    isPressed = false;
  } else if(e.key == "Right" || e.key == "ArrowRight"){
    rightPressed = false;
    isPressed= false;
  }
}
/*
function moveup() {
  ball.speedY -= 1;
}

function movedown() {
  ball.speedY += 1;
}
*/
function moveleft() {
  ball.speedX *= 100;
  ball.speedX -= 10;
  ball.speedX = Math.round(ball.speedX);
  ball.speedX /= 100;

}

function moveright() {
  ball.speedX *= 100;
  ball.speedX += 10;
  ball.speedX = Math.round(ball.speedX);
  ball.speedX /= 100;

}

function updateWorld() {
    world.clear();
    ball.newPos();
    ball.update();
    map.update();

}

function startGame() {
    //creer monde
    world.start();
    //creer map
    map = new Curve(150, 0.15, 6);
    //creer bille
    ball = new Ball(100, 100, 30, "black");
}

/*

if (ctx.isPointInPath(mapPath, this.x + radius, this.y + radius)){
  this.y = this.y - radius;
  console.log("yes!");
}
*/
