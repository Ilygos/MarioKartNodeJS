//Main.js : Mario Kart
var canvas = document.getElementById('stage');
var charactersZone = document.getElementById('Characters');
var context = canvas.getContext('2d');
document.addEventListener("keydown",move,false);

var id = setInterval(gameLoop);
var cw=canvas.width;
var ch=canvas.height;

// set canvas to be a tab stop (necessary to give it focus)
canvas.setAttribute('tabindex','0');

// set focus to the canvas
canvas.focus();

// create an x & y indicating where to draw the rect
var x=150;
var y=150;

// draw the rect for the first time
draw();

// listen for keydown events on the document
// the canvas does not trigger key events
document.addEventListener("keydown",handleKeydown,false);

// handle key events
function handleKeydown(e){

  // if the canvas isn't focused,
  // let some other element handle this key event
  if(e.target.id!=='canvas'){return;}

  // change x,y based on which key was down
  switch(e.keyCode){
    case 87: x+=20; break;  // W
    case 65: x-=20; break;  // A
    case 83: y+=20; break;  // S
    case 68: y-=20; break;  // D
  }

  // redraw the canvas
  draw();
}

// clear the canvas and redraw the rect in its new x,y position
function draw(){
  ctx.clearRect(0,0,cw,ch);
  ctx.fillRect(x,y,20,20);
}
