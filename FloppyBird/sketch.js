var yPos = 200;
var yVelocity = 0;
var jumpForce = 40;
var gravity = 1.75;
var gap = 75;
var gameSpeed = 1;
var score = -1;

var lineXPos = 0;
var lineYPos = 0;


function setup () {
  createCanvas(250, 400);
}

function draw () {
  background(0);
  fill(0);
  stroke(0, 255, 0);
  line(0,350,250,350);
  
  //push();
  rectMode(CENTER);
  //translate(50, yPos);
  //rotate(yVelocity);
  rect(50, yPos, 10, 10);
  yPos -= yVelocity/10;
  yVelocity -= gravity;
  //pop();
  
  if (yPos >= 345) {
    yPos = 345;
    yVelocity = 0;
    jumpForce = 0;
    gameSpeed = 0;
    textSize(32);
    fill(0, 255, 0);
    text('GAME OVER', 20, 385);
  }
  
  if ((yPos > lineYPos-5 || yPos < lineYPos-(gap-5)) && (lineXPos >= 45 && lineXPos <= 55)) {
    yVelocity = jumpForce;
    jumpForce = 0;
    background(255);
  }
  
  if (lineXPos < 0) {
    lineXPos = width;
    lineYPos = random(120,330);
    gameSpeed += 0.1;
    score += 1;
  }
  line(lineXPos, 350, lineXPos, lineYPos);
  line(lineXPos, 0, lineXPos, lineYPos-gap);
  lineXPos -= gameSpeed;
  
  textSize(32);
  fill(0, 255, 0);
  text(score, 110, 50);
}

function keyPressed () {
  if (keyCode == 32 && jumpForce != 0) {
    yVelocity = jumpForce;
  }
}