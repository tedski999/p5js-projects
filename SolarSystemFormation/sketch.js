const SEED = 0;
const DUST_SIZE = 1;
const START_VELOCITY = 2.5;
const SPAWN_VELOCITY = 0.015;
const GRAVITY = 0.01;
const CAM_SPEED = 10;

var spaceDust = [];
var keysDown = [1000];
var camPos;
var starPos;
var numNewDusts;
var spawnPos;
var mouseDown;


function setup()
{
	createCanvas(600,600);
	rectMode(CENTER);
	ellipseMode(CENTER);
	noStroke();
	fill(255);

	SEED == 0 ? randomSeed(random(9999)) : randomSeed(SEED);
	camPos = createVector(0, 0);
	starPos = createVector(width/2, height/2);
}

function draw()
{
	background(0);
	ellipse(starPos.x + camPos.x, starPos.y + camPos.y, 5);

	// Add dusts
	for (var i = 0; i < numNewDusts; i++)
		spaceDust.push(new SpaceDust(0, 0));
	numNewDusts = 0;

	// Update dusts
	for (var i = 0; i < spaceDust.length; i++)
		spaceDust[i].update();

	// Keyboard control
	if (keysDown[87]) camPos.y += CAM_SPEED;
	if (keysDown[83]) camPos.y -= CAM_SPEED;
	if (keysDown[65]) camPos.x += CAM_SPEED;
	if (keysDown[68]) camPos.x -= CAM_SPEED;
	if (keysDown[78]) numNewDusts += 1;

	if (mouseDown)
	{
		stroke(255);
		line(spawnPos.x, spawnPos.y, mouseX, mouseY);
		noStroke();
	}
}

function SpaceDust(spawnPos, spawnVel)
{
	if (spawnPos != 0)
		this.pos = spawnPos;
	else
		this.pos = createVector(
			random(width),
			random(height));

	if (spawnVel != 0)
		this.velocity = spawnVel;
	else
		this.velocity = createVector(
			random(-START_VELOCITY, START_VELOCITY),
			random(-START_VELOCITY, START_VELOCITY));

	this.update = function ()
	{
		// Collision
		for (var i = 0; i < spaceDust.length; i++) {
			var xDist = Math.abs(this.pos.x - spaceDust[i].pos.x);
			var yDist = Math.abs(this.pos.y - spaceDust[i].pos.y);
			if (xDist + yDist < DUST_SIZE)
			{
				this.velocity.x = (this.velocity.x + spaceDust[i].velocity.x) / 2;
				this.velocity.y = (this.velocity.y + spaceDust[i].velocity.y) / 2;
			}
		}

		// Gravity
		var dist = Math.sqrt(this.pos.x * this.pos.x + this.pos.y * this.pos.y);
		var force = GRAVITY / dist * dist;
		var dir = 2 * Math.PI - Math.atan((this.pos.y - starPos.y) / (this.pos.x - starPos.x));

		if (this.pos.x >= starPos.x)
		{
			this.velocity.x -= Math.cos(dir) * force;
			this.velocity.y += Math.sin(dir) * force;
		} else {
			this.velocity.x += Math.cos(dir) * force;
			this.velocity.y -= Math.sin(dir) * force;
		}

		// Move and draw
		this.pos.x += this.velocity.x;
		this.pos.y += this.velocity.y;
		rect(this.pos.x + camPos.x, this.pos.y + camPos.y, DUST_SIZE, DUST_SIZE);
	}
}

function mousePressed()
{
	mouseDown = true;
	spawnPos = createVector(mouseX, mouseY);
}

function mouseReleased()
{
	spaceDust.push(new SpaceDust(
		createVector(
			spawnPos.x - camPos.x,
			spawnPos.y - camPos.y),
		createVector(
			(spawnPos.x - mouseX) * SPAWN_VELOCITY,
			(spawnPos.y - mouseY) * SPAWN_VELOCITY)
	));
	mouseDown = false;
}

function keyPressed()
{
	keysDown[keyCode] = true;
}

function keyReleased()
{
	keysDown[keyCode] = false;
}
