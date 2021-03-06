//Main.js : Mario Kart
const MAX_SPEEDX = 400;
const MAX_SPEEDY = 400;
const KART_SIZE = 50;
const SPEED = 500;

var sfx = new Audio('LEEROY JENKINS!!! .mp3');
var theme = new Audio('Tuvan Throat Singing.mp3');
theme.play();

var socket = io();
var canvas=document.getElementById("stage");
var ctx=canvas.getContext("2d");
var colors = document.getElementsByClassName('color');
var lifep1 = document.getElementsByClassName('lifep1');
var lifep2 = document.getElementsByClassName('lifep2');
var cw=canvas.width;
var ch=canvas.height;
var deltaTime;
var id = setInterval(gameLoop);
var id2 = setInterval(damagingDelay, 3000);

var easterEgg = "none";

var velocity = {'x': 0, 'y': 0};
var acceleration = {'x': 0, 'y': 0};

// set canvas to be a tab stop (necessary to give it focus)
canvas.setAttribute('tabindex','0');

// set focus to the canvas
canvas.focus();

// parameters
//Player1
var life = 3;
var x=Math.floor(Math.random()*(cw+1));
var y=Math.floor(Math.random()*(ch+1));
var color = 'magenta';
//player2X
var player2Life = 3;
var player2X;
var player2Y;
var player2Color;
var canBeDamaged = false;

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
  life = recieved.life;
});

function gameLoop()
{
  if(life <= 0 ) win("player2");
  else if (player2Life <= 0) win("player1");
  tick();
  if (easterEgg == "Fabien est trop handsome !") color = 'pink';
  move();
  collision();
  if (x < 0) x = 0;
  else if (x + KART_SIZE > cw) x = cw - KART_SIZE;
  if (y < 0) y = 0;
  else if (y + KART_SIZE> ch) y = ch - KART_SIZE;
  socket.emit("send", {'x': x, 'y': y, 'color': color, 'life': player2Life});

  draw();
}

function move () {
    var newAccel = {
      'x': acceleration.x += velocity.x * deltaTime,
      'y': acceleration.y += velocity.y * deltaTime
    }

    x += deltaTime * (acceleration.x + newAccel.x) / 2 ;
    y += deltaTime * (acceleration.y + newAccel.y) / 2 ;

    acceleration.x = newAccel.x;
    acceleration.y = newAccel.y;
}

function win(winner)
{
  document.removeEventListener("keydown", handleKeydown);
  document.removeEventListener("keyUp", handleKeyup);
  clearInterval(id);
  clearInterval(id2);
  console.log("Win"+winner);
}

function collision() {
  if (x + KART_SIZE > player2X && x < player2X + KART_SIZE && y < player2Y + KART_SIZE && y > player2Y && canBeDamaged)
  {
    sfx.play();
    canBeDamaged = false;
    if(player2Life > 0) player2Life--;
    else win();
  }
}

function damagingDelay()
{
  canBeDamaged  = true;
}

// handle key events
function handleKeydown(e){

  switch(e.keyCode){
    case 68: velocity.x = SPEED; break;  // D
    case 81: velocity.x = -SPEED; break;  // Q
    case 83: velocity.y = SPEED; break;  // S
    case 90: velocity.y = -SPEED; break;  // Z
  }
  acceleration.x = Math.max(-MAX_SPEEDX, Math.min(MAX_SPEEDX, acceleration.x + velocity.x*deltaTime));
  acceleration.y = Math.max(-MAX_SPEEDY, Math.min(MAX_SPEEDY, acceleration.y + velocity.y*deltaTime));
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
function renderHeart()
{
  for (var i = 0; i < lifep1.length; i++)
    lifep1[i].style.display = "none";
  for (i = 0; i < lifep2.length; i++)
    lifep2[i].style.display = "none";
  for (i = 0; i < life; i++)
    lifep1[i].style.display = "inline-block";
  for (i = 0; i < player2Life; i++)
    lifep2[i].style.display = "inline-block";
}

function draw(){

  ctx.clearRect(0,0,cw,ch);
  renderHeart();
  drawRect(x, y, KART_SIZE, KART_SIZE, color);
  drawRect(player2X, player2Y, KART_SIZE, KART_SIZE, player2Color);

}

//DeltaTime
var lastUpdate = Date.now();

function tick() {
    var now = Date.now();
    deltaTime = (now - lastUpdate)/1000;
    lastUpdate = now;
}
