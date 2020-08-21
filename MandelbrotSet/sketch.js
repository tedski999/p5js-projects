
//==============
// Controls

// Mandelbrot Set parameters
var startSensitivity = 50;
var maxValue = 100;

// Zooming
var drawScale = 5;
var zoomSpeed = 0.2;

// Panning
var startXPos = 0;
var startYPos = 0;
var panSpeed = 0.1;

//==============
// Variables
var sensitivity;
var xPos;
var yPos;
var img;


//==============
// Functions

function setup()
{
	createCanvas(250, 250);
	img = createImage(width, height);
}

function draw()
{
	// Update position and sensitivity
	xPos = startXPos - drawScale / 2;
	yPos = startYPos - drawScale / 2;
	sensitivity = startSensitivity + Math.log10(1 / drawScale) * 15;

	// Precalculation
	var foo = img.width / drawScale;
	var bar = img.height / drawScale;

	// Perform Mandelbrot Set calculation
	// on every pixel in the image
	for (var x = 0; x < img.width; x++)
	{
		for (var y = 0; y < img.height; y++)
		{

			var tX = xPos + x / foo;
			var tY = yPos + y / bar;
			var sTX = tX;
			var sTY = tY;

			// Default to black
			img.set(x, y, [0, 0, 0, 255]);

			// Repeat to prove it doesn't trail to infinity
			for (var i = 0; i < sensitivity; i++)
			{
				// Calculation
				var temp_tX = (tX*tX - tY*tY)  + sTX;
				tY = (2 * tX * tY) + sTY;
				tX = temp_tX;
				
				// If trailing to (estimated) infinity
				if (tX + tY > maxValue)
				{
					// Vary red colour depending on i
					img.set(x, y, [(i / sensitivity) * 255, 0, 0, 255]);
					break;
				}

			}

		}
	}

	// Center point
	img.set(img.width/2, img.height/2, [255, 255, 255, 255]);

	// Render image
	img.updatePixels();
	image(img, 0, 0);

	// Info text
	textSize(10);
	fill(255);
	text("x" + Math.round(startXPos * 100000) / 100000, 2, img.height - 5);
	text("y" + Math.round(-startYPos * 100000) / 100000, 52, img.height - 5);
	text("z" + Math.round(drawScale * 100000) / 100000, 102, img.height - 5);
	text("s" + Math.round(sensitivity * 100000) / 100000, 152, img.height - 5);

	// Keyboard input
	switch (keyCode)
	{
		case 97:
			startXPos -= (drawScale / 5) * panSpeed;
			break;

		case 119:
			startYPos -= (drawScale / 5) * panSpeed;
			break;

		case 100:
			startXPos += (drawScale / 5) * panSpeed;
			break;

		case 115:
			startYPos += (drawScale / 5) * panSpeed;
			break;

		case 101:
			drawScale += (drawScale / 5) * zoomSpeed;
			break;

		case 113:
			drawScale -= (drawScale / 5) * zoomSpeed;
			break;

		/*
		case 120:
			sensitivity += 10;
			break;

		case 122:
			sensitivity -= 10;
			break;
		*/
	}
}