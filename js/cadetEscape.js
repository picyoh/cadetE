let canvas;
let ctx;
let gameObjects;
const g = 9.81;
const restitution = 0.2;

let timeStamp = Math.round(Date.now() / 1000);
let secondsPassed = 0;
let oldTimeStamp = 0;

window.onload = init;

class GameObject
{
  constructor (context, x, y, vx, vy, m, color){
    this.context = ctx;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.m = m;
    this.color = color;

    this.isColliding = false;
    this.mapContact = false;

  }
}

class Ball extends GameObject
{
  constructor (context, x, y, vx, vy, m, color){
    super(context, x, y, vx, vy, m, color);

    this.radius = this.m * 12;
  }

  draw(){

    this.context.beginPath();
    this.context.moveTo(this.x, this.y);
    this.context.lineTo(this.x + this.radius, this.y);
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.context.strokeStyle = this.isColliding?'red': this.color;
    this.context.stroke();
    /*
    this.context.fillStyle = this.isColliding?'red': this.color;
    this.context.fill();
    */
  }

  update(secondsPassed){

    this.vy += (this.m * g * secondsPassed) / 2;
    this.x += this.vx * secondsPassed;
    this.y += this.vy * secondsPassed;

    let radian = Math.atan2(this.vy, this.vx);


  }
}

class Bump extends GameObject
{
  constructor (context, x, y, vx, vy, m, color){
    super(context, x, y, vx, vy, m, color);

    this.radius = this.m * 12;
  }

  draw(){

    this.context.beginPath();
    /*
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    */
    this.context.fillStyle = this.isColliding?'red': this.color;
    this.context.fill();
  }

  update(secondsPassed){

    this.vy += (g * secondsPassed) / 2;
    this.x += this.vx * secondsPassed;
    this.y += this.vy * secondsPassed;

    let radian = Math.atan2(this.vy, this.vx);

  }
}

class Map extends GameObject
{
  constructor (context, x, y, radius, arcLength, n){
    super(context);
    this.vx = 0;
    this.vy = 0;
    this.m = 10;
    this.context = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.arcLength = arcLength;
    this.n = n;

    this.isColliding = false;
  }
}

class Curve extends Map
{
  constructor (context, x, y, radius, arcLength, clockwise){
    super(context);

    this.x = x;
    this.y = y;
    this.radius = radius;
    this.arcLength = arcLength;
    this.clockwise = clockwise;

  }

  draw(){

    let startAngle = (1 - this.arcLength) * Math.PI;
    let endAngle = (this.arcLength) * Math.PI;
    let clockwise = true;

    let offsety = (Math.sin(this.arcLength * Math.PI)) * this.radius;
    let offsetx = Math.sqrt((this.radius ** 2) - (offsety * offsety));

    let diff = this.radius - offsetx;
    let yscnd = this.y + 2 * offsety;
    let canvasBottom = canvas.height;
    let xMax = (this.n * offsetx) + (this.n * this.radius) - ((this.n - 1) * diff);



    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, clockwise);
    this.context.closePath();
    this.context.stroke();
  }

  update(){

  }
}

function init(){

  canvas = document.createElement("canvas");
  canvas.width = window.innerWidth - 10;
  canvas.height = window.innerHeight - 2 * document.querySelector('header').clientHeight;
  canvas.id = "cadetEscape";
  ctx = canvas.getContext('2d');
  let section = document.querySelector('section');
  section.appendChild(canvas);

  createWorld();

  window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp){

  secondsPassed = (timeStamp - oldTimeStamp) / 200;
  oldTimeStamp = timeStamp;

//update

  for (let i = 0; i < gameObjects.length; i++) {
    gameObjects[i].update(secondsPassed);
  }

//collision friction

  detectCollisions(gameObjects);
  detectEdgeCollision(gameObjects);

//clear

  ctx.clearRect(0, 0, canvas.width, canvas.height);

//draw

  for (let i = 0; i < gameObjects.length; i++) {
    gameObjects[i].draw();
  }

  window.requestAnimationFrame(gameLoop);
}

function createWorld() {
  gameObjects = [

    new Ball(ctx, 150, 350, -40, 10, 2, 'black'),
    new Ball(ctx, 250, 350, -30, 20, 4, 'black'),
    new Ball(ctx, 350, 350, -20, 30, 3, 'black'),
    // new Ball(ctx, 450, 350, -10, 40, 2, 'black'),
    // new Ball(ctx, 550, 350, 10, -40, 2, 'black'),
    // new Ball(ctx, 650, 350, 20, -30, 3, 'black'),
    // new Ball(ctx, 750, 350, 30, -20, 2, 'black'),
    // new Ball(ctx, 850, 350, 40, -10, 4, 'black'),
    // new Ball(ctx, 150, 550, 40, 10, 2, 'black'),
    // new Ball(ctx, 250, 550, 30, 20, 4, 'black'),
    // new Ball(ctx, 350, 550, 0, 30, 3, 'black'),
    // new Ball(ctx, 450, 550, 10, 40, 2, 'black'),
    // new Ball(ctx, 550, 550, 10, -40, 2, 'black'),
    // new Ball(ctx, 650, 550, 20, -30, 3, 'black'),
    // new Ball(ctx, 750, 550, 30, -20, 2, 'black'),
    // new Ball(ctx, 850, 550, 40, -10, 4, 'black'),
    // new Ball(ctx, 150, 150, -40, 10, 2, 'black'),
    // new Ball(ctx, 250, 150, -30, 20, 4, 'black'),
    // new Ball(ctx, 350, 150, -20, 30, 3, 'black'),
    // new Ball(ctx, 450, 150, -10, 40, 2, 'black'),
    // new Ball(ctx, 550, 150, 10, -40, 2, 'black'),
    // new Ball(ctx, 650, 150, 20, -30, 3, 'black'),
    // new Ball(ctx, 750, 150, 30, -20, 2, 'black'),
    // new Ball(ctx, 850, 150, 40, -10, 4, 'black')
    
    new Bump(ctx, 550, 350, -20, -20, 2, 'blue'),
    new Curve(ctx, 150, 600, 150, 0.15, false),
    new Curve(ctx, 450, 600, 150, 0.15, true),
    new Curve(ctx, 750, 600, 150, 0.15, true),
    new Curve(ctx, 1050, 600, 150, 0.15, true),
    new Curve(ctx, 1350, 600, 150, 0.15, true),
    new Curve(ctx, 1650, 600, 150, 0.15, true)
  ],
  map = [

    */
  ];
}

function detectCollisions(){
  let obj1;
  let obj2;

  for (let i = 0; i < gameObjects.length; i++) {

    gameObjects[i].isColliding = false;

  }

  for (let i = 0; i < gameObjects.length; i++) {

    obj1 = gameObjects[i];

    for (let j = i + 1; j < gameObjects.length; j++){

      obj2 = gameObjects[j];

      if (circleIntersect(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.radius)){

        obj1.isColliding = true;
        obj2.isColliding = true;
        /*
        let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
        let distance = Math.sqrt( (obj2.x - obj1.x) **2 + (obj2.y - obj1.y) **2 );
        let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
        let vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
        let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
        let impulse = 2 * speed / (obj1.m + obj2.m);
        console.log(speed);

        if (speed < 0){

          break;
        }

        obj1.vx -= (impulse * obj2.m * vCollisionNorm.x);
        obj1.vy -= (impulse * obj2.m * vCollisionNorm.y);
        obj2.vx += (impulse * obj1.m * vCollisionNorm.x);
        obj2.vy += (impulse * obj1.m * vCollisionNorm.y);

        */


        let masses = obj1.m + obj2.m;

        obj1.vx = ( ( (obj1.m - obj2.m) / masses) * obj1.vx) + ( ( (2 * obj2.m) / masses) * obj2.vx);
        obj1.vy = ( ( (obj1.m - obj2.m) / masses) * obj1.vy) + ( ( (2 * obj2.m) / masses) * obj2.vy);

        obj2.vx = -( ( (2 * obj1.m) / masses) * obj1.vx) + ( ( (obj2.m - obj1.m) / masses) * obj2.vx);
        obj2.vy = -( ( (2 * obj1.m) / masses) * obj1.vy) + ( ( (obj2.m - obj1.m) / masses) * obj2.vy);

        let radiusSum = obj1.radius + obj2.radius;
        let collisionAngle = Math.atan((obj2.y - obj1.y) / (obj2.x - obj1.x));
        let xObj2 = Math.cos(collisionAngle) * (radiusSum);
        let yObj2 = Math.sin(collisionAngle) * (radiusSum);

          if((obj1.x > obj2.x) && (obj1.y > obj2.y)){
          //entre 0 et 3/2pi

          let xOri = obj2.x + xObj2;
          let yOri = obj2.y + yObj2;
          let vDiffx = xOri - obj1.x;
          let vDiffy = yOri - obj1.y;

          obj1.x = xOri;
          obj1.y = yOri;
          obj1.vx += vDiffx;
          obj1.vy += vDiffy;

          } else if((obj1.x < obj2.x) && (obj1.y > obj2.y)){
          //entre 3/2pi et pi

          let xOri = obj2.x - xObj2;
          let yOri = obj2.y - yObj2;
          let vDiffx = xOri - obj1.x;
          let vDiffy = yOri - obj1.y;

          obj1.x = xOri;
          obj1.y = yOri;
          obj1.vx += vDiffx;
          obj1.vy += vDiffy;

          } else if((obj1.x < obj2.x) && (obj1.y < obj2.y)){
          //entre pi et pi/2

          let xOri = obj2.x - xObj2;
          let yOri = obj2.y - yObj2;
          let vDiffx = xOri - obj1.x;
          let vDiffy = yOri - obj1.y;

          obj1.x = xOri;
          obj1.y = yOri;
          obj1.vx += vDiffx;
          obj1.vy += vDiffy;

          } else if((obj1.x > obj2.x) && (obj1.y < obj2.y)){
          //entre pi/2 et 0

          let xOri = obj2.x + xObj2;
          let yOri = obj2.y + yObj2;
          let vDiffx = xOri - obj1.x;
          let vDiffy = obj1.y - yOri;

          obj1.x = xOri;
          obj1.y = yOri;
          obj1.vx += vDiffx;
          obj1.vy += vDiffy;
          }
      }
    }
  }
}

function circleIntersect(x1, y1 ,r1, x2, y2, r2) {

  let squareDistance = (x1-x2) **2 + (y1-y2) **2;
  let squareRadiusSum = (r1 + r2) **2;

  return squareDistance <= squareRadiusSum

}


function detectEdgeCollision(){
  let obj;
  for (let i =0; i < gameObjects.length; i++) {

    obj = gameObjects[i];

    if (obj.x < obj.radius){
      //gauche
      obj.vx = Math.abs(obj.vx) * restitution;
      obj.x = obj.radius;
    } else if(obj.x > canvas.width - obj.radius){
      //droite
      obj.vx = -Math.abs(obj.vx) * restitution;
      obj.x = canvas.width - obj.radius;
    }

    if (obj.y < obj.radius){
      //haut
      obj.vy = Math.abs(obj.vy) * restitution;
      obj.y = obj.radius;
    } else if(obj.y > canvas.height - obj.radius){
      //bas
      obj.vy = -Math.abs(obj.vx) * restitution;
      obj.y = canvas.height - obj.radius;
    }
  }
}

//dessin map a revoir
//detection map?
//hitbox / dessin pour map?
//friction
//adapter controls


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
