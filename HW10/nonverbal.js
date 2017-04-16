
// Copyright 2011 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var canvas;
var context;
var images = {};

var totalResources = 8;
var numResourcesLoaded = 0;
var fps = 30; //When all the images are ready we start a timer using setInterval that will call the redraw function 30 times a second.

var charX = 245;
var charY = 185;
var breathInc = 0.1;
var breathDir = 1;
var breathAmt = 0;
var breathMax = 2;
var breathInterval = setInterval(updateBreath, 1000 / fps);
var maxEyeHeight = 14;  //Eye height when our character eyes are wide open
var curEyeHeight = maxEyeHeight; //Current eye height while blinking
var curEyeColor = "black"
var eyeOpenTime = 0; //Milliseconds since last blink
var timeBtwBlinks = 4000; //Milliseconds between blinks
var blinkUpdateTime = 200;   //Milliseconds before updating blink status                  
var blinkTimer = setInterval(updateBlink, blinkUpdateTime);//Calls the updateBlink function every blinkUpdateTime milliseconds
var fpsInterval = setInterval(updateFPS, 1000);
var numFramesDrawn = 0;
var curFPS = 0;
var jumping = false;

function updateFPS() {
	
	curFPS = numFramesDrawn;
	numFramesDrawn = 0;
}
function prepareCanvas(canvasDiv, canvasWidth, canvasHeight)
{
	// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d"); // Grab the 2d canvas context
	// Note: The above code is a workaround for IE 8and lower. Otherwise we could have used:
	//     context = document.getElementById('canvas').getContext("2d");
	
	canvas.width = canvas.width; // clears the canvas 
	context.fillText("loading...", 40, 140);
	
	loadImage("lefthand");
	loadImage("leg");
	loadImage("body");
	loadImage("righthand");
	loadImage("head");		
	loadImage("lefthand-jump");
	loadImage("leg-jump");
	loadImage("righthand-jump");
    loadImage("ad");
}

function loadImage(name) {

  images[name] = new Image();
  images[name].onload = function() { 
	  resourceLoaded();
  }
  images[name].src = "images/" + name + ".png";
}

function resourceLoaded() {

  numResourcesLoaded += 1;
  if(numResourcesLoaded === totalResources) {
  
	setInterval(redraw, 1000 / fps);
  }
}

function redraw() {

  var x = charX;
  var y = charY;
  var jumpHeight = 45;
  
  canvas.width = canvas.width; // clears the canvas 

  // Draw shadow
  context.drawImage(images["ad"], x - 290, y - 123);
  if (jumping) {
	drawEllipse(x + 50, y + 29, 100 - breathAmt, 4);
  } else {
	drawEllipse(x + 50, y + 29, 160 - breathAmt, 6);
  }
  
  if (jumping) {
	y -= jumpHeight;
  }

  if (jumping) {
	context.drawImage(images["lefthand-jump"], x + 115, y - 78 - breathAmt);
  } else {
	context.drawImage(images["lefthand"], x + 115, y - 63 - breathAmt);
  }
  
  if (jumping) {
	context.drawImage(images["leg-jump"], x - 25, y- 20);
  } else {
	context.drawImage(images["leg"], x, y - 25);
  }
	
  context.drawImage(images["body"], x - 25, y - 66);
  context.drawImage(images["head"], x - 33, y - 123- breathAmt);

  
  if (jumping) {
	context.drawImage(images["righthand-jump"], x - 70, y - 75 - breathAmt);
  } else {
	context.drawImage(images["righthand"], x - 50, y - 60 - breathAmt);
  }
	
  drawEllipse(x + 47, y - 90 - breathAmt, 8, curEyeHeight, curEyeColor); // Left Eye
  drawEllipse(x + 58, y - 90 - breathAmt, 8, curEyeHeight, curEyeColor); // Right Eye
}

function drawEllipse(centerX, centerY, width, height, color) {

  context.beginPath();
  
  context.moveTo(centerX, centerY - height/2);
  
  context.bezierCurveTo(
	centerX + width/2, centerY - height/2,
	centerX + width/2, centerY + height/2,
	centerX, centerY + height/2);

  context.bezierCurveTo(
	centerX - width/2, centerY + height/2,
	centerX - width/2, centerY - height/2,
	centerX, centerY - height/2);
 
  context.fillStyle = color;
  context.fill();
  context.closePath();	
}

function setEyeColor(color) {
    curEyeColor = color
}
// increases or decreases the breath amount
function updateBreath() { 
//update the variable breathAmt which we will use to represent the constant breathing-rise and fall of the head and arms		
//update the variable breathAmt which we will use to represent the constant breathing-rise and fall of the head and arms		
  if (breathDir === 1) {  // breath in
	breathAmt -= breathInc;
	if (breathAmt < -breathMax) {
	  breathDir = -1;
	}
  } else {  // breath out
	breathAmt += breathInc;
	if(breathAmt > breathMax) {
	  breathDir = 1;
	}
  }
}

function setBreathInc(inc) {
    breathInc = inc;
}

function updateBlink() { 
				
  eyeOpenTime += blinkUpdateTime;
	
  if(eyeOpenTime >= timeBtwBlinks){
	blink();
  }
}

function setTimeBetweenBlinks(duration) {
    timeBtwBlinks = duration
}

function blink() {

  curEyeHeight -= 1;
  if (curEyeHeight <= 0) {
	eyeOpenTime = 0;
	curEyeHeight = maxEyeHeight;
  } else {
	setTimeout(blink, 10);
  }
}

function jump() {
	
  if (!jumping) {
	jumping = true;
	setTimeout(land, 500);
  }

}
function land() {
	
  jumping = false;

}