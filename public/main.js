//Main.js : Mario Kart
const MAX_SPEEDX = 1;
const MAX_SPEEDY = 1;
const KART_SIZE = 50;
var socket = io();
var canvas=document.getElementById("stage");
var ctx=canvas.getContext("2d");
var colors = document.getElementsByClassName('color');
var cw=canvas.width;
var ch=canvas.height;
var id = setInterval(gameLoop);

var easterEgg = "none";

var velocity = {'x': 0, 'y': 0};
var acceleration = {'x': 0, 'y': 0};

// set canvas to be a tab stop (necessary to give it focus)
canvas.setAttribute('tabindex','0');

// set focus to the canvas
canvas.focus();

// parameters
var x=150;
var y=150;
var color = 'magenta';
var player2X;
var player2Y;
var player2Color;

// draw the rect for the first time
draw();

// listen for keydown events on the document
// the canvas does not trigger key events
document.addEventListener("keydown",handleKeydown);
document.addEventListener("keyup",handleKeyup);

for(var i = 0; i < colors.length; i++) colors[i].addEventListener('click', changeColor);

socket.on('recieved', function(recieved)
{
  player2X = recieved.x;
  player2Y = recieved.y;
  player2Color = recieved.color;
});

function gameLoop()
{
  if (easterEgg == "Fabien est trop handsome !") color = 'pink';
  x += acceleration.x;
  y += acceleration.y;
  if (x < 0) x = 0;
  else if (x + 20 > cw) x = cw - 20;
  if (y < 0) y = 0;
  else if (y + 20> ch) y = ch - 20;
  socket.emit("send", {'x': x, 'y': y, 'color': color});

  draw();
}
// handle key events
function handleKeydown(e){

  switch(e.keyCode){
    case 68: velocity.x = 20; break;  // D
    case 81: velocity.x = -20; break;  // Q
    case 83: velocity.y = 20; break;  // S
    case 90: velocity.y = -20; break;  // Z
  }
  acceleration.x = Math.max(-MAX_SPEEDX, Math.min(MAX_SPEEDX, acceleration.x + velocity.x*1/100));
  acceleration.y = Math.max(-MAX_SPEEDY, Math.min(MAX_SPEEDY, acceleration.y + velocity.y*1/100));
}

function handleKeyup(e) {
  if (e.keyCode == 68 || e.keyCode == 81)
  {
    acceleration.x = 0;
    velocity.x = 0;
  }

  if (e.keyCode == 83 || e.keyCode == 90)
  {
     velocity.y = 0;
     acceleration.y = 0;
  }
}

function changeColor(pEvent)
{
  var name = pEvent.target.className.split(" ");
  color = name[name.length - 1];
}

function drawRect(px, py, pwidth, pheight, pcolor)
{
  ctx.fillStyle=pcolor;
  ctx.fillRect(px,py, pwidth, pheight);
}

function draw(){
  ctx.clearRect(0,0,cw,ch);
  drawRect(x, y, KART_SIZE, KART_SIZE, color);
  drawRect(player2X, player2Y, KART_SIZE, KART_SIZE, player2Color);

}
