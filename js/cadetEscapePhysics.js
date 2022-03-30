let canvas;
let ctx;
let gameObjects;
const g = 9.81;
const restitution = 0.80;

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

    this.isCollinding = false;

  }
}

class Circle extends GameObject
{
  constructor (context, x, y, vx, vy, m, color){
    super(context, x, y, vx, vy, m, color);

    this.radius = this.m * 12;
  }

  draw(){

    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.context.fillStyle = this.isCollinding?'red': this.color;
    this.context.fill();
  }

  update(secondsPassed){

    this.vy += (g * secondsPassed) / 2;
    this.x += this.vx * secondsPassed;
    this.y += this.vy * secondsPassed;

    let radian = Math.atan2(this.vy, this.vx);

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

    new Circle(ctx, 50, 150, 50, -30, 5, 'green'),
    new Circle(ctx, 150, 350, 70, 20, 4, 'yellow'),
    new Circle(ctx, 20, 250, 70, -10, 3, 'purple'),
    new Circle(ctx, 250, 150, 50, -10, 1, 'grey'),
    new Circle(ctx, 10, 25, 20, 20, 2, 'blue'),
    new Circle(ctx, 500, 50, -50, -30, 4, 'green'),
    new Circle(ctx, 550, 350, -70, 20, 4, 'yellow'),
    new Circle(ctx, 820, 250, -70, -10, 3, 'purple'),
    new Circle(ctx, 750, 150, -50, -10, 1.5, 'grey'),
    new Circle(ctx, 800, 25, -20, 10, 2, 'blue')

  ];
}

function detectCollisions(){
  let obj1;
  let obj2;

  for (let i = 0; i < gameObjects.length; i++) {

    gameObjects[i].isCollinding = false;

  }

  for (let i = 0; i < gameObjects.length; i++) {

    obj1 = gameObjects[i];

    for (let j = i + 1; j < gameObjects.length; j++){

      obj2 = gameObjects[j];

      if (circleIntersect(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.radius)){

        obj1.isCollinding = true;
        obj2.isCollinding = true;

        let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
        let distance = Math.sqrt( (obj2.x - obj1.x) **2 + (obj2.y - obj1.y) **2 );
        let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
        let vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj1.vy};
        let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
        let impulse = 2 * speed / (obj1.m + obj2.m);

        if (speed < 0){
          break;
        } else if (speed >= 0){
          obj1.vx -= (impulse * obj2.m * vCollisionNorm.x);
          obj1.vy -= (impulse * obj2.m * vCollisionNorm.y);
          obj2.vx += (impulse * obj1.m * vCollisionNorm.x);
          obj2.vy += (impulse * obj1.m * vCollisionNorm.y);
        }
      }
    }
  }
}

function circleIntersect(x1, y1 ,r1, x2, y2, r2) {

  let squareDistance = (x1-x2) **2 + (y1-y2) **2;

  return squareDistance <= ((r1 + r2) **2)

}


function detectEdgeCollision(){
  let obj;
  for (let i =0; i < gameObjects.length; i++) {

    obj = gameObjects[i];

    if (obj.x < obj.radius){
      obj.vx = Math.abs(obj.vx) * restitution;
      obj.x = obj.radius;
    } else if(obj.x > canvas.width - obj.radius){
      obj.vx = -Math.abs(obj.vx) * restitution;
      obj.x = canvas.width - obj.radius;
    }

    if (obj.y < obj.radius){
      obj.vy = Math.abs(obj.vy) * restitution;
      obj.y = obj.radius;
    } else if(obj.y > canvas.height - obj.radius){
      obj.vy = -Math.abs(obj.vx) * restitution;
      obj.y = canvas.height - obj.radius;
    }
  }
}
