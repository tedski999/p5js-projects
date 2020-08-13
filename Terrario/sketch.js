var seed = 979;
var curXPos = 0;
var curYPos = 200;
var v2;
var tiles = [];
var xTilePos = [];
var yTilePos = [];
var surfacePointsX = [];
var surfacePointsY = [];
var drawDist = 100;

var shiftDown = false;
var rightDown = false;
var leftDown = false;
var tileSelected = 0;

var fallSpeed = 0;
var tempFallSpeed = 0;
var jumpSpeed = 0;


function setup () {
  randomSeed(seed);
  createCanvas(400,400);
  textAlign(CENTER);
  rectMode(CENTER);
  background(0);
  fill(255);
  textSize(20);
  text('Generating Terrain...',width/2,height/2);
  fill(150);
  textSize(10);
  text('Seed: ' + seed,width/1.1,height-10);
}

function draw () {
  if (frameCount == 10) {
    Generate();
  }
  if (frameCount > 10) {
    if (frameCount % 2 === 0) {
      checkRight();
      checkLeft();
      checkJump();
      checkFall();
    }
    Update();
  }
}

function Generate () {
  for(var v = 0; v < 200; v++) {
    for(var h = -50; h < 100; h++) {
      tiles.push(new Tile(35,(h*10)-500,(-v*10)-10,round(v/2)));
    }
  }
  var peak = 0;
  for(var xPos = -100; xPos < 50; xPos++) {
    peak += round(random(-1,1));
    if (peak < 1) {
      peak = 1;
    }
    for(var yPos = peak; yPos > 0; yPos--) {
      if (yPos == peak) {
        tiles.push(new Tile(86,xPos*10,(yPos-1)*10,0));
        if (round(random(0,50)) == 1) {
          surfacePointsX.push(xPos*10);
          surfacePointsY.push((yPos-1)*10);
        }
      } else {
        tiles.push(new Tile(79,xPos*10,(yPos-1)*10,0));
      }
    }
  }
  
  var temp = surfacePointsX.length;
  for (var x = 0; x < temp; x++) {
    for (var z = 0; z < tiles.length; z++) {
      if (surfacePointsX[x] == xTilePos[z] && surfacePointsY[x] == yTilePos[z]) {
        deleteTile(z);
        var caveXPos = surfacePointsX[x];
        var caveYPos = surfacePointsY[x];
        var largeCave = round(random(0,3));
        var caveLength = round(random(200,1000));
        for(var c = 0; c < caveLength; c++) {
          randomDir = round(random(0,3));
          for(var b = 0; b < tiles.length; b++) {
            if (randomDir == 3) {
              if (caveXPos == xTilePos[b] && caveYPos-10 == yTilePos[b]) {
                deleteTile(b);
                b += 99999;
                for(var nn = 0; nn < largeCave; nn++) {
                  for(var n = 0; n < tiles.length; n++) {
                    if(caveXPos-((nn+1)*10) == xTilePos[n] && caveYPos == yTilePos[n]) {
                      deleteTile(n);
                      n += 99999;
                    }
                  }
                }
                caveYPos -= 10;
              }
            }
            if (randomDir === 1) {
              if (caveXPos-10 == xTilePos[b] && caveYPos == yTilePos[b]) {
                deleteTile(b);
                b += 99999;
                for(var mm = 0; mm < largeCave; mm++) {
                  for(var m = 0; m < tiles.length; m++) {
                    if(caveYPos-((mm+1)*10) == yTilePos[m] && caveXPos == xTilePos[m]) {
                      deleteTile(m);
                      m += 99999;
                    }
                  }
                }
                caveXPos -= 10;
              }
            }
            if (randomDir == 2) {
              if (caveXPos+10 == xTilePos[b] && caveYPos == yTilePos[b]) {
                deleteTile(b);
                b += 99999;
                for(var ll = 0; ll < largeCave; ll++) {
                  for(var l = 0; l < tiles.length; l++) {
                    if(caveYPos-((ll+1)*10) == yTilePos[l] && caveXPos == xTilePos[l]) {
                      deleteTile(l);
                      l += 99999;
                    }
                  }
                }
                caveXPos += 10;
              }
            }
          }
        }
      }
    }
  }
}

function Tile (character,worldXPos,worldYPos,depth) {
  this.character = character;
  this.worldXPos = worldXPos;
  this.worldYPos = worldYPos;
  this.r = 0;
  this.g = 0;
  this.b = 0;

  xTilePos.push(this.worldXPos);
  yTilePos.push(this.worldYPos);
  
  if (this.character == 79 || this.character == 35) {
    if (round(random(0,depth)-2) <= 0) {
      this.character = 79;
      this.r = 125;
      this.g = 75;
      this.b = 0;
    } else {
      this.character = 35;
      this.r = 150;
      this.g = 150;
      this.b = 150;
    }
  }
  
  if (this.character == 118) {
    this.r = 125;
    this.g = 255;
    this.b = 0;
  }
  
  if (this.character == 86) {
    this.r = 0;
    this.g = 255;
    this.b = 0;
  }
  
  if (this.character == 36) {
    this.r = 200;
    this.g = 200;
    this.b = 0;
  }
  
  this.display = function () {
    fill(this.r,this.g,this.b);
    //text(char(this.character),(curXPos-this.worldXPos)+(width/2),(curYPos-this.worldYPos)+(height/2));
    rect((curXPos-this.worldXPos)+(width/2),(curYPos-this.worldYPos)+(height/2),10,10);
  }
}

function keyPressed () {
  if (keyCode == 16) {
    shiftDown = true;
  }

  if (keyCode == 68) {
    leftDown = true;
  }
  if (keyCode == 65) {
    rightDown = true;
  }
  
  if (keyCode == 87) {
    var jump = false;
    for (var t = 0; t < tiles.length; t++) {
      if (curXPos == xTilePos[t] && curYPos-10 == yTilePos[t]) {
        jump = true;
      }
    }
    if (jump === true) {
      jumpSpeed = 8;
    }
  }
  
  if (keyCode < 48 && keyCode > 58) { tileSelected = keyCode-48; }
}

function keyReleased () {
  if (keyCode == 16) {
    shiftDown = false;
  }
  if (keyCode == 68) {
    leftDown = false;
  }
  if (keyCode == 65) {
    rightDown = false;
  }
}

function mousePressed () {
  if (shiftDown === true) {
    var tileToPlace = 36;
    if (tileSelected == 1) { tileToPlace = 79; }
    if (tileSelected == 2) { tileToPlace = 35; }
    if (tileSelected == 3) { tileToPlace = 36; }
    tiles.push(new Tile(tileToPlace,curXPos-(round((mouseX-(height/2))/10)*10),curYPos-(round((mouseY-(height/2))/10)*10),0));
  } else {
    for (var i = 0; i < tiles.length; i++) {
      if (curXPos-(round((mouseX-(height/2))/10)*10) == xTilePos[i] && curYPos-(round((mouseY-(height/2))/10)*10) == yTilePos[i]) {
        deleteTile(i);
      }
    }
  }
} 

function checkFall () {
  for(var d = 0; d < fallSpeed+1; d++) {
    var fall = true;
    for (var r = 0; r < tiles.length; r++) {
      if (curXPos == xTilePos[r] && curYPos-10 == yTilePos[r]) {
        fall = false;
        fallSpeed = 0;
      }
    }
    if (fall === true) {
      curYPos += -10;
    }
  }
  tempFallSpeed += 1;
  if (tempFallSpeed === 3 && fallSpeed < 8) {
    fallSpeed += 1;
    tempFallSpeed = 0;
  }
}

function checkJump () {
  for(var d = 0; d < jumpSpeed; d++) {
    var jump = true;
    for (var r = 0; r < tiles.length; r++) {
      if (curXPos == xTilePos[r] && curYPos+10 == yTilePos[r]) {
        jump = false;
        jumpSpeed = 0;
      }
    }
    if (jump === true) {
      curYPos += 10;
    }
    jumpSpeed -= 1;
    fallSpeed = -1;
  }
}

function checkLeft () {
  if (leftDown) {
    var left = true;
    var leftUp = true;
    for (var i = 0; i < tiles.length; i++) {
      if (curXPos-10 == xTilePos[i] && curYPos == yTilePos[i]) {
        left = false;
        for (var i2 = 0; i2 < tiles.length; i2++) {
          if (curXPos-10 == xTilePos[i2] && curYPos+10 == yTilePos[i2]) {
            leftUp = false;
          }
        }
      }
    }
    if (left === true) {
      curXPos += -10;
    }
    if (left === false && leftUp === true) {
      curXPos += -10;
      curYPos += 10;
    }
  }
}

function checkRight () {
  if (rightDown) {
    var right = true;
    var rightUp = true;
    for (var o = 0; o < tiles.length; o++) {
      if (curXPos+10 == xTilePos[o] && curYPos == yTilePos[o]) {
        right = false;
        for (var o2 = 0; o2 < tiles.length; o2++) {
          if (curXPos+10 == xTilePos[o2] && curYPos+10 == yTilePos[o2]) {
            rightUp = false;
          }
        }
      }
    }
    if (right === true) {
      curXPos += 10;
    }
    if (right === false && rightUp === true) {
      curXPos += 10;
      curYPos += 10;
    }
  }
}

function deleteTile (id) {
  tiles[id].worldXPos = 99999;
  tiles[id].worldYPos = 99999;
  xTilePos[id] = 99999;
  yTilePos[id] = 99999;
}

function Update () {
  background(0);
  if (leftDown && rightDown) {
    v2 = createVector(curXPos,curYPos);
  }
  for(var s = 0; s < tiles.length; s++) {
    if (tiles[s].worldXPos-curXPos < drawDist && tiles[s].worldXPos-curXPos > -drawDist && tiles[s].worldYPos-curYPos < drawDist && tiles[s].worldYPos-curYPos > -drawDist) {
      tiles[s].display();
    }
  }
  fill(250,240,0);
  text("@",width/2,height/2);
}