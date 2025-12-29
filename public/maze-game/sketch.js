
let cx;
let cy;
let radius = 100
const level =2;
let cells = [];
let ball;
let ballspeed = 1
let ballradius = 10
let gap = 10;
let circlegap = 80;
let x,y
let won = false;
let prevX = 0
let prevY = 0
let prevZ = 0
let isPhone = false;

class Circle{
  constructor(pos,balllevel, angles, radius) {
    // Creating a new Ball Object
    this.pos=pos
    this.level = balllevel;
    this.angles = angles;
    this.radius = radius;
    
  }
}


class Ball {
  constructor(pos, vel, radius,level) {
    // Creating a new Ball Object
    this.pos = pos;
    this.vel = vel;
    this.radius = radius;
    this.level=level
    
  }
  
  ballAngle(circle){

    angleMode(DEGREES)
    // translate(cx, cy);
    //let angle = atan2(tany,tanx)

    let v1 = createVector(circle.radius,0,0);
    let v2 = createVector(this.pos.x-circle.pos.x,this.pos.y - circle.pos.y , 0);

    let angle = v1.angleBetween(v2);
    if (angle < 0){
      angle  = angle + 360

    }
    return angle
  }
  getLevel(){
    for(let i=0;i<level;i++){
      let c = cells[i]
      let centerDist = p5.Vector.sub(c.pos, this.pos);
      if(centerDist.mag() <= c.radius+2 ){
        return c.level
      }
    }
    return level
  }
  checkLevelPass(circle){
  
  let pass = false
   let ballangle = this.ballAngle(circle);
    angleMode(RADIANS)
  //console.log(ballangle)
  
 
  //console.log("circleRadius:",circleRadius," balldist:",balldist);
  for(let i=0;i<circle.angles.length;i++){
    let gapangle = circle.angles[i]
    //console.log("GapAnglee,",gapangle,"ballangle,",ballangle);
    if(ballangle >gapangle-5 && ballangle < gapangle +gap+5 ){
      //ball is at the same angle
      //now check if it is at the same boundry
      pass = true;
      return pass;
    }
  }
  return pass
  }
  isColliding(circle) {
    //console.log("ball:",ball,"circle:",circle)
  
    if(won || this.level >= level ){
      return;
    }
    let centerDist = p5.Vector.sub(circle.pos, this.pos); // Distance between centers of two balls
    //let dist1 = centerDist.mag() - (this.radius + circle.radius); // Distance between edges of ball and circle
    let dist2  = circle.radius - (this.radius/2 + centerDist.mag() )
    
    let pass = this.checkLevelPass(circle)
    //console.log(pass)
    if(dist2 <=0 && pass){
      //this.level =this.getLevel()
      //console.log(this.level)
      return false
    }
    return  dist2 <=0;
  }

  collide(circle) {
    // Reversing Velocity on Collision
    if (this.isColliding(circle)) {
      this.vel.mult(-1);
    }else{
      
      if(x < this.pos.x){
        this.vel.x  = -1*ballspeed
      }else{
        this.vel.x  = ballspeed
      }
      if(y < this.pos.y){
        
        this.vel.y  = -1*ballspeed
      }else{
        this.vel.y  = ballspeed
      }
    }
  }

  move() {
    // Moving the Ball
    if(won){
      return
    }
    this.pos.add(this.vel); // Move at its velocity
    this.level = this.getLevel() //get the level
    

  }
  //show the ball on the canvas
  render() {
    let black = "black"
    fill(0,0,255); // Set color of ball
    
    
    ellipse(this.pos.x, this.pos.y, this.radius ); // Draw the ball
    
    
    if(this.level >= level){
      let strok = "red"
      strokeWeight(5)
    
      stroke(strok)
      text("You Won",50,50)
    }
  }
}


function touchStarted() {
  if(!permissionGranted){
    //x = mouseX
    //y = mouseY
  }
}


function setCells(){
   for(let i=0;i<level;i++){
    let angles= [];
    let borders = [];
    
    for(let j=0;j<=i+1;j++){
      let a = random(0,360);
      let b = random(0,360)
      
      angles.push(a)
      borders.push(b)
    }
     let r = (radius + circlegap*i)/2
     let pos = createVector(cx, cy)
     let c = new Circle(pos,i,angles,r, borders)
    cells.push(c);
    
  }
}
let permissionButton;
let permissionGranted = false;
//get accelerometer permission
function getAccelerometerPermission(){
  if(!isPhone){
    permissionGranted=true;
    return;
  }
  if(typeof(DeviceOrientationEvent!='undefined') && typeof(DeviceOrientationEvent.requestPermission!= 'function')){
    //ios 13
    permissionButton = createButton("Click to grant accelerometer Permission")
    permissionButton.style("font-size","24px")
    permissionButton.center()
    permissionButton.mousePressed(requestAccess)
    
  }else{
    //non ios 13
    permissionGranted=true;
  }
}
//request access 
function requestAccess(){
  DeviceOrientationEvent.requestPermission()
    .then(permission=>{
    if(permission =='granted'){
      permissionGranted = true;
    }
  })
  if(permissionGranted){
    permissionButton.remove();
  }
}



function getAccelerometerData(){
  // x and y values moved from the centre point
  y = round(600 / 2 + rotationX * 10)
  x = round(600 / 2 + rotationY * 10)
   
}
  
function setup() {
 
  document.addEventListener("gesturestart", function (e) {
    e.preventDefault();
    return false;
  });
  getAccelerometerPermission();
  createCanvas(600, 600);
   cx=width/2;
  cy = height/2;
     x=600/2;
  y = 600/2;
  setCells();
  frameRate(40);
    noStroke();
  background(255);
  

  ballx = cx;
  bally = cy;
  
  let pos = createVector(cx, cy)
  let vel = createVector(ballspeed, ballspeed)
  ball = new Ball(pos,vel,ballradius,0)

}
function drawCircles(){
    let c = color(0, 0, 0);
  
  
  strokeWeight(2)
  stroke(c)
  noFill();
  let drawRadius = radius;
  for(let i=0;i<cells.length;i++){
    
    let c = cells[i]
    arc(c.pos.x,c.pos.y,c.radius*2,c.radius*2,radians(0),radians(360));
   
    
  }

}
function drawcells(){
  let c = color(50, 55, 100);
  let w = "white";
  
  strokeWeight(3)
  stroke(w)

  for(let i=0;i<cells.length;i++){
    let cell = cells[i];
    for(let j=0;j<cell.angles.length;j++){
      let start = cell.angles[j];
      let end = start + gap;      arc(cell.pos.x,cell.pos.y,cell.radius*2,cell.radius*2,radians(start),radians(end),OPEN); 
        noFill();
      
      
    }    
    
  }
   
}

function draw() {
  if(permissionGranted && keyIsPressed == false){
   // getAccelerometerData()
  }
  //getAccelerometerData()
  drawCircles();
  drawcells();
  
  let cell = cells[ball.level]
  ball.collide(cell);
  ball.move();
  ball.render();
  
  
}

function keyPressed() {

  if(key === "ArrowLeft") {
    x = x - 5
  }
  if(key === "ArrowRight") {
    x = x + 5
  }
  if(key === "ArrowUp") {
        y = y -5
  }
  if(key === "ArrowDown") {
        y = y + 5
  }
  console.log(x,y)
}
