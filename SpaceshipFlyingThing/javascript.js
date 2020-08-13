
// ==================== VARIABLES ====================

// Constants
const PLAYER_SIZE = 1;
const PLAYER_SPEED = 1;
const SHIP_SIZE = 0.9;
const SHIP_ACCEL = 0.1;
const SHIP_XSPEED = 100;
const SHIP_YSPEED = 40;
const SHIP_XDRAG = 1;
const SHIP_YDRAG = 0.98;
const GROUND_HEIGHT = 320;
const TERRAIN_ROUGHNESS = 10;
const TERRAIN_SCALE = 0.001;

// Textures
var tex_player = new Image(); tex_player.src = 'resources/player.png';
var tex_ship1 = [new Image(), new Image()];
tex_ship1[0].src = 'resources/ship_flying.png';
tex_ship1[1].src = 'resources/ship_landed.png';
var tex_ship2 = [new Image(), new Image()];
tex_ship2[0].src = 'resources/ship2_flying.png';
tex_ship2[1].src = 'resources/ship2_landed.png';
var tex_ship_shadow = new Image(); tex_ship_shadow.src = 'resources/ship_shadow.png';

var tex_ship2_flying = new Image(); tex_ship2_flying.src = 'resources/ship2_flying.png';
var tex_ship2_landed = new Image(); tex_ship2_landed.src = 'resources/ship2_landed.png';

// Variables
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var keysDown = [];

// Objects
var player;
var cam;
var bullets = [];
var ships = [];
var aiPilots = [];
var landingAreas = [];


// ==================== CLASSES ====================

// --- Player Class ---
function Player (_x, _y, _sprite)
{
	// Constructor
	this.x = _x;
	this.y = _y;
	this.sprite = _sprite;

	// Controls
	this.upKey = 87;
	this.downKey = 83;
	this.leftKey = 65;
	this.rightKey = 68;
	this.useKey = 69;

	// Variables
	this.controlable = true;
	this.visible = true;
	this.useKeyPressed = false;
	this.curShip;

	// Update player
	this.Update = function ()
	{
		if (this.controlable)
		{
			if (keysDown[this.upKey])
			{
				if (this.curShip == null)
				{
					if (this.y > GROUND_HEIGHT+40)
					{
						if (keysDown[this.rightKey] || keysDown[this.leftKey]) this.y -= PLAYER_SPEED*0.7;
						else this.y -= PLAYER_SPEED;
					}
				}
				else
				{
					this.curShip.yVel -= SHIP_ACCEL - (this.curShip.yVel / -SHIP_YSPEED);
				}
			}

			if (keysDown[this.downKey])
			{
				if (this.curShip == null)
				{
					if (keysDown[this.rightKey] || keysDown[this.leftKey]) this.y += PLAYER_SPEED*0.7;
					else this.y += PLAYER_SPEED;
				}
				else
				{
					this.curShip.yVel += SHIP_ACCEL - (this.curShip.yVel / SHIP_YSPEED);
				}
			}

			if (keysDown[this.rightKey])
			{
				if (this.curShip == null)
				{
					if (keysDown[this.upKey] || keysDown[this.downKey]) this.x += PLAYER_SPEED*0.7;
					else this.x += PLAYER_SPEED;
				}
				else
				{
					this.curShip.xVel += SHIP_ACCEL - (this.curShip.xVel / SHIP_XSPEED);
				}
			}

			if (keysDown[this.leftKey])
			{
				if (this.curShip == null)
				{
					if (keysDown[this.upKey] || keysDown[this.downKey]) this.x -= PLAYER_SPEED*0.7;
					else this.x -= PLAYER_SPEED;
				}
				else
				{
					this.curShip.xVel -= SHIP_ACCEL - (this.curShip.xVel / -SHIP_XSPEED);
				}
			}

			if (keysDown[this.useKey])
			{
				if (!this.useKeyPressed)
				{
					this.useKeyPressed = true;

					if (this.curShip == null)
					{
						this.visible = false;
						this.curShip = ships[0];
						this.curShip.pilot = this;
						this.curShip.flying = true;
						this.curShip.yVel -= 0.5;
					}
					else
					{
						if (this.curShip.y >= GROUND_HEIGHT && this.curShip.xVel < 1)
						{
							this.x = this.curShip.x + 50;
							this.y = this.curShip.y + 50;
							this.visible = true;
							this.curShip.flying = false
							this.curShip.xVel = 0;
							this.curShip.yVel = 0;
							this.curShip.pilot = null;
							this.curShip = null;
						}
					}
				}
			}
			else
				this.useKeyPressed = false;
		}

		if (this.curShip != null)
		{
			this.x = this.curShip.x + 50;
			this.y = this.curShip.y + 50;
		}
	}

	// Draws to frame
	this.Draw = function ()
	{
		if (this.visible)
		{
			ctx.beginPath();
			ctx.drawImage(
				this.sprite,
				this.x - cam.x - PLAYER_SIZE/2,
				this.y - cam.y - PLAYER_SIZE/2,
				this.sprite.width * PLAYER_SIZE,
				this.sprite.height * PLAYER_SIZE);
		}
	}
}

// --- Camera Class ---
function Camera ()
{
	this.x = 0;
	this.y = 0;
	this.target;
	this.walkSpaceX = 125;
	this.walkSpaceY = 50;

	// Follow target
	this.Update = function ()
	{
		if (this.target.x - this.x - canvas.width/2 > this.walkSpaceX)
			this.x = this.target.x - this.walkSpaceX - canvas.width/2;
		if (this.target.x - this.x - canvas.width/2 < -this.walkSpaceX)
			this.x = this.target.x + this.walkSpaceX - canvas.width/2;

		if (this.target.y - this.y - canvas.height/2 > this.walkSpaceY)
			this.y = this.target.y - this.walkSpaceY - canvas.height/2;
		if (this.target.y - this.y - canvas.height/2 < -this.walkSpaceY)
			this.y = this.target.y + this.walkSpaceY - canvas.height/2;
	}
}

// --- Ship Class ---
function Ship (_x, _y, _sprites)
{
	// Constructor
	this.x = _x;
	this.y = _y;
	this.sprites = _sprites;

	// Variables
	this.sprite = this.sprites[1];
	this.xScale = 1;
	this.flying = false;
	this.xVel = 0;
	this.yVel = 0;
	this.pilot;

	// Update ship
	this.Update = function ()
	{

		if (this.flying)
		{
			this.sprite = this.sprites[0];

			this.xVel = this.xVel * SHIP_XDRAG;
			this.yVel = this.yVel * SHIP_YDRAG;

			if (this.xVel > 0)
				this.xScale = 1;
			else if (this.xVel < 0)
				this.xScale = -1;

			if (this.y >= GROUND_HEIGHT)
			{
				this.xVel = this.xVel / 1.05;
				this.y = GROUND_HEIGHT;
			}

			this.x += this.xVel;
			this.y += this.yVel;
		}
		else
			this.sprite = this.sprites[1];
	}

	// Draws to frame
	this.Draw = function ()
	{
		ctx.beginPath();
		ctx.drawImage(
			tex_ship_shadow,
			this.x - cam.x,
			GROUND_HEIGHT - cam.y - this.sprite.height + 80,
			this.sprite.width * SHIP_SIZE,
			this.sprite.height * SHIP_SIZE);
		ctx.fillStyle = "black";
		ctx.fill();

		ctx.beginPath();
		if (this.xScale == 1)
			ctx.drawImage(
				this.sprite,
				this.x - cam.x - SHIP_SIZE/2,
				this.y - cam.y - SHIP_SIZE/2 - this.sprite.height + 60,
				this.sprite.width * SHIP_SIZE,
				this.sprite.height * SHIP_SIZE);
		else
		{
			ctx.save();
			ctx.translate(this.x - cam.x + 100, this.y - cam.y - SHIP_SIZE/2 - this.sprite.height + 60);
			ctx.scale(-1, 1);
			ctx.drawImage(
				this.sprite,
				0, 0,
				this.sprite.width * SHIP_SIZE,
				this.sprite.height * SHIP_SIZE);
			ctx.restore();
		}
	}
}

// --- AI Pilot Class ----
function AIPilot (_sprite, _ship)
{
	this.sprite = _sprite;
	this.ship = _ship;
	this.targetX = this.ship.x;
	this.cruiseHeight = 0;
	this.percentageSpeed = 0;
	this.restTime = 0;

	this.x = 0;
	this.y = 0;
	this.targetXWalk = 0;
	this.targetYWalk = 0;
	this.readyToFly = true;

	this.Update = function ()
	{
		if (this.readyToFly)
		{
			this.ship.flying = true;

			if (this.targetX - this.ship.x > 400)
			{
				this.ship.xVel += SHIP_ACCEL - (this.ship.xVel / SHIP_XSPEED / this.percentageSpeed);
				if (this.ship.y > GROUND_HEIGHT - this.cruiseHeight)
					this.ship.yVel -= SHIP_ACCEL - (this.ship.yVel / -SHIP_YSPEED);
			}
			else if (this.targetX - this.ship.x < -400)
			{
				this.ship.xVel -= SHIP_ACCEL - (this.ship.xVel / -SHIP_XSPEED / this.percentageSpeed);
				if (this.ship.y > GROUND_HEIGHT - this.cruiseHeight)
					this.ship.yVel -= SHIP_ACCEL - (this.ship.yVel / -SHIP_YSPEED);
			}
			else
			{
				this.ship.xVel = this.ship.xVel / 1.015;
				this.ship.yVel += SHIP_ACCEL - (this.ship.yVel / SHIP_YSPEED);
				if (this.ship.y >= GROUND_HEIGHT)
				{
					this.ship.flying = false;
					this.ship.xVel = 0;
					this.targetX = landingAreas[Math.floor(Math.random() * landingAreas.length)].x;
					this.cruiseHeight = Math.round(Math.random() * 300) + 100;
					this.percentageSpeed = Math.random() * 0.25 + 0.75;
					this.restTime = Math.round(Math.random() * 500) + 100;
					this.targetXWalk = this.ship.x + 50;
					this.targetYWalk = this.ship.y + 50;
					this.readyToFly = false;
				}
			}

			this.x = this.ship.x + 50;
			this.y = this.ship.y + 50;
		}
		else
		{
			this.restTime--;
			if (this.restTime <= 0)
			{
				this.targetXWalk = this.ship.x + 50;
				this.targetYWalk = this.ship.y + 50;
			}

			if (this.y < this.targetYWalk)
				this.y += PLAYER_SPEED * 0.75;
			if (this.y > this.targetYWalk)
				this.y -= PLAYER_SPEED * 0.75;
			if (this.x < this.targetXWalk)
				this.x += PLAYER_SPEED * 0.75;
			if (this.x > this.targetXWalk)
				this.x -= PLAYER_SPEED * 0.75;

			if (Math.abs(this.y - this.targetYWalk) < 1 && Math.abs(this.x - this.targetXWalk) < 1)
			{
				this.targetXWalk = this.ship.x + 50 + Math.random() * 500 - 250;
				this.targetYWalk = this.ship.y + 50 + Math.random() * 200;

				if (this.restTime <= 0)
					this.readyToFly = true;
			}
		}
	}

	this.Draw = function ()
	{
		if (!this.readyToFly)
		{
			ctx.beginPath();
			ctx.drawImage(
				this.sprite,
				this.x - cam.x - PLAYER_SIZE/2,
				this.y - cam.y - PLAYER_SIZE/2,
				this.sprite.width * PLAYER_SIZE,
				this.sprite.height * PLAYER_SIZE);
		}
	}
}

function LandingArea ()
{
	this.x = Math.random() * 50000 - 25000;

	this.Draw = function ()
	{
		ctx.beginPath();
		ctx.rect(this.x - 350 - cam.x, GROUND_HEIGHT - cam.y + 20, 700, 50);
		ctx.fillStyle = "lightgrey";
		ctx.fill();
	}
}

// ==================== FUNCTIONS ====================

// --- Sets Up Game ---
function Start ()
{
	noise.seed(Math.random());
	player = new Player(400 + Math.random() * 200, GROUND_HEIGHT + 70 + Math.random() * 100, tex_player);
	ships.push(new Ship(200 + Math.random() * 500, GROUND_HEIGHT, tex_ship1));

	for (var i = 1; i < 10; i++)
		landingAreas.push(new LandingArea());

	for (var i = 1; i < 20; i++)
	{
		ships.push(new Ship(Math.random() * 10000 - 5000, GROUND_HEIGHT, tex_ship2));
		aiPilots.push(new AIPilot(tex_player, ships[i]));
	}

	cam = new Camera();
	cam.target = player;
}

// --- Main Loop ---
function Update ()
{
	// Updates player
	player.Update();

	// Update AI pilots
	for (var i = aiPilots.length - 1; i >= 0; i--)
		aiPilots[i].Update();

	// Update ships
	for (var i = ships.length - 1; i >= 0; i--)
		ships[i].Update();

	// Update camera
	cam.Update();

	// Draws frame
	Draw();
}

// --- Draws Frame to Canvas ---
function Draw ()
{
	// Clear
	ctx.beginPath();
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Ground
	for (var x = -10; x < canvas.width + 10; x += 10)
	{
		var y = TerrainHeight(x + cam.x - (cam.x % 10));
		ctx.beginPath();
		ctx.rect(x - cam.x % 10, y - cam.y + 200, 11, 10);
		ctx.fillStyle = "grey";
		ctx.fill();
		ctx.beginPath();
		ctx.rect(x - cam.x % 10, y - cam.y + 210, 11, 2000);
		ctx.fillStyle = "darkgrey";
		ctx.fill();
	}

	// Landing areas
	for (var i = 0; i < landingAreas.length; i++)
		landingAreas[i].Draw();

	// Ships
	for (var i = ships.length - 1; i >= 0; i--)
		ships[i].Draw();

	// AI pilots
	for (var i = aiPilots.length - 1; i >= 0; i--)
		aiPilots[i].Draw();

	// Player
	player.Draw();
}

function TerrainHeight (x)
{
	return Math.round(noise.simplex2(x * TERRAIN_SCALE, 0) * TERRAIN_ROUGHNESS) * 10;
}

// --- Keyboard Input (Down) ---
document.addEventListener('keydown', function (e)
{
	// Stops scrolling with arrows and space bar
	if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1)
		e.preventDefault();

	keysDown[e.keyCode] = true;
});

// --- Keyboard Input (Up) ---
document.addEventListener('keyup', function (e)
{
	keysDown[e.keyCode] = false;
});

// ==================== ON LOAD ====================

Start();
setInterval(Update, 10);