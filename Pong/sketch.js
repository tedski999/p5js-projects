// A simple pong replica by Ted Johnson - 25/11/15

// 0 - 2 players
// 1 - 1 bot vs 1 player
// 2 - 2 bots
var ai = 2;

var ballSpeed = 10;
var paddelSpeed = 5;

var players = [];
var balls = [];

var player1Score = 0;
var player2Score = 0;

var stepsToPlayer = 0;
var preBallY = 0;
var preBallYVelocity = 0;
var stepsToPlayerPre = 0;
var preBallYPre = 0;
var preBallYVelocityPre = 0;
var preHeight = 0;
var preHeightLeft = 0;

function setup() {
  createCanvas(600,400);
  background(0);
  rectMode(CENTER);
  ellipseMode(CENTER);
  fill(255);
  noStroke();
  textSize(50);
  textAlign(CENTER);
  preHeight = height/2;
  preHeightLeft = height/2;
  players.push(new Player(20));
  players.push(new Player(width-20));
  balls.push(new Ball());
}

function draw() {
  background(0);
  rect(width/2,height/2,5,height);
  text(player1Score,(width/2)-40,50);
  text(player2Score,(width/2)+40,50);
  if (ai == 1 || ai == 2) {
    if (balls[0].xPos > width-35  && balls[0].xVelocityCUR < 0) {
      preHeight = PredictBall(balls[0].yPos,balls[0].yVelocity,2);
    }
    if (balls[0].xPos < 35 && balls[0].xVelocityCUR > 0) {
      preHeight = PredictBall(balls[0].yPos,balls[0].yVelocity,1);
    }
    if (players[1].yPos < preHeight-10 || players[1].yPos > preHeight ) {
      if (preHeight > players[1].yPos) {
        players[1].curSpeed = paddelSpeed;
      }
      if (preHeight < players[1].yPos) {
        players[1].curSpeed = -paddelSpeed;
      }
    } else {
      players[1].curSpeed = 0;
    }
    //rect(width-35,preHeight,10,10);
  }
  if (ai == 2 || ai == 3) {
    if (balls[0].xPos < 35 && balls[0].xVelocityCUR > 0) {
      preHeightLeft = PredictBall(balls[0].yPos,balls[0].yVelocity,2);
    }
    if (balls[0].xPos > width-35 && balls[0].xVelocityCUR < 0) {
      preHeightLeft = PredictBall(balls[0].yPos,balls[0].yVelocity,1);
    }
    if (players[0].yPos < preHeightLeft-10 || players[0].yPos > preHeightLeft+10 ) {
      if (preHeightLeft > players[0].yPos) {
        players[0].curSpeed = paddelSpeed;
      }
      if (preHeightLeft < players[0].yPos) {
        players[0].curSpeed = -paddelSpeed;
      }
    } else {
      players[0].curSpeed = 0;
    }
    //rect(35,preHeightLeft,10,10);
  }
  for (var i = 0; i < balls.length; i++) {
    balls[i].update();
  }
  players[0].update();
  players[1].update();
}

function Ball () {
  this.xPos = width/2;
  this.yPos = height/2;
  this.xVelocitySTRT = ballSpeed;
  this.xVelocityCUR = -ballSpeed;
  this.yVelocity = random(-0.5,0.5);
  
  this.update = function () {
    if (this.yPos < 5) {
      this.yVelocity = -this.yVelocity>0 ? -this.yVelocity : this.yVelocity;
    }
    if (this.yPos > height-5) {
      this.yVelocity = -this.yVelocity>0 ? this.yVelocity : -this.yVelocity;
    }
    if ((this.xPos < 25 && this.xPos > 5) && (this.yPos < players[0].yPos+30 && this.yPos > players[0].yPos-30)) {
      this.xVelocityCUR = this.xVelocitySTRT;
      this.yVelocity += (this.yPos-players[0].yPos)/8;
    }
    if ((this.xPos > width-25 && this.xPos < width-5) && (this.yPos < players[1].yPos+30 && this.yPos > players[1].yPos-30)) {
      this.xVelocityCUR = -this.xVelocitySTRT;
      this.yVelocity += (this.yPos-players[1].yPos)/8;
    }

    if (this.xPos < 0) {
      this.xVelocityCUR = -ballSpeed;
      this.yVelocity = random(-0.5,0.5);
      this.xPos = width/2;
      this.yPos = height/2;
      player2Score += 1;
      players[0].yPos = height/2;
      players[1].yPos = height/2;
      preHeight = height/2;
      preHeightLeft = height/2;
    }
    if (this.xPos > width) {
      this.xVelocityCUR = ballSpeed;
      this.yVelocity = random(-0.5,0.5);
      this.xPos = width/2;
      this.yPos = height/2;
      player1Score += 1;
      players[0].yPos = height/2;
      players[1].yPos = height/2;
      preHeight = height/2;
      preHeightLeft = height/2;
    }
    /*if (this.xPos < 0) {
      this.xVelocityCUR = ballSpeed;
      balls.push(new Ball());
    }
    if (this.xPos > width) {
      this.xVelocityCUR = -ballSpeed;
      balls.push(new Ball());
    }*/
    
    this.xPos += this.xVelocityCUR;
    this.yPos += this.yVelocity;
    rect(this.xPos,this.yPos,10,10);
  }
}

function Player (x) {
  this.xPos = x;
  this.yPos = height/2;
  this.curSpeed = 0;
  
  this.update = function () {
    if (this.yPos < 30) {
      this.yPos += paddelSpeed;
    }
    if (this.yPos > height-30) {
      this.yPos += -paddelSpeed;
    }
    this.yPos += this.curSpeed;
    rect(this.xPos,this.yPos,10,60);
  }
}

function keyPressed () {
  if (ai > 1) {
  } else {
    if (keyCode == 87) {
      players[0].curSpeed = -paddelSpeed;
    }
    if (keyCode == 83) {
      players[0].curSpeed = paddelSpeed;
    }
  }
  
  if (ai > 0) {
  } else {
    if (keyCode == 73) {
      players[1].curSpeed = -paddelSpeed;
    }
    if (keyCode == 75) {
      players[1].curSpeed = paddelSpeed;
    }
  }
}

function keyReleased () {
  if (ai > 1) {
  } else {
    if (keyCode == 87 && players[0].curSpeed == -paddelSpeed) {
      players[0].curSpeed = 0;
    }
    if (keyCode == 83 && players[0].curSpeed == paddelSpeed) {
      players[0].curSpeed = 0;
    }
  }
  
  if (ai > 0) {
  } else {
    if (keyCode == 73 && players[1].curSpeed == -paddelSpeed) {
      players[1].curSpeed = 0;
    }
    if (keyCode == 75 && players[1].curSpeed == paddelSpeed) {
      players[1].curSpeed = 0;
    }
  }
}

function PredictBall (yPos,ballVelocity,steps) {
    stepsToPlayerPre = (((width-25)-25)/ballSpeed)*steps;
    preBallYPre = yPos;
    preBallYVelocityPre = ballVelocity;

    for (var i = 0; i < stepsToPlayerPre; i++) {
      if (preBallYPre < 5 || preBallYPre > height-5) {
        preBallYVelocityPre = -preBallYVelocityPre;
      }
      preBallYPre += preBallYVelocityPre;
    }
    return preBallYPre;
}
