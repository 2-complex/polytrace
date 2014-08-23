var CANVAS;
var CTX;

var lastEvent;
var heldKeys = {};

var LOOP_ID = null;
var APP_STATE = null;

var GAMEFPS = 10;

var CELLSIZE = 100;
var COLUMNS = 32;
var ROWS = 24;
var CELLWIDTH = 20;
var CELLHEIGHT = 20;

var WHITE     = new Color(255, 255, 255);
var BLACK     = new Color(  0,   0,   0);
var RED       = new Color(255,   0,   0);
var GREEN     = new Color(  0, 255,   0);
var BLUE      = new Color(  0,   0, 255);
var LIGHTBLUE = new Color(150, 150, 255);
var DARKGREEN = new Color(  0, 155,   0);
var DARKBLUE  = new Color(  0,   0, 200);
var LIGHTGRAY = new Color(150, 150, 150);
var GRAY      = new Color(100, 100, 100);
var DARKGRAY  = new Color( 40,  40,  40);


function init()
{
    window.onkeydown = key_down;
    window.onkeyup = key_up;

    window.onmousemove = mouse_move;
    window.onmouseup = mouse_up;
    window.onmousedown = mouse_down;

    CANVAS = document.getElementById("canvas");

    if( CANVAS.getContext )
    {
        CTX = CANVAS.getContext("2d");

        CANVAS.width = window.innerWidth;
        CANVAS.height = window.innerHeight;

        COLUMNS = Math.floor(CANVAS.width/CELLSIZE);
        ROWS = Math.floor(CANVAS.height/CELLSIZE);
        CELLWIDTH = CANVAS.width/COLUMNS;
        CELLHEIGHT = CANVAS.height/ROWS;

        APP_STATE = 'title';
        titleScreen();
    }
}

function clearScreen()
{
    CTX.clearRect(0,0,CANVAS.width,CANVAS.height);
}

function titleScreen()
{
    APP_STATE = 'title';
    LOOP_ID = requestAnimationFrame(titleScreenLoop);
}

function titleScreenLoop(t)
{
    LOOP_ID = requestAnimationFrame(titleScreenLoop);

    clearScreen();

    /***** draw the title text *****/
    CTX.save();

    CTX.textAlign = "center";
    CTX.textBaseline = "middle";
    CTX.font = "80px Arial";
    CTX.translate(CANVAS.width/2, CANVAS.height/2);

    CTX.save();
    var w = 200;
    var h = 100;
    CTX.fillStyle = DARKBLUE.hex();
    CTX.fillRect(-w, -h, 2*w, 2*h);
    CTX.restore();

    CTX.save();
    CTX.fillStyle = BLACK.hex();
    CTX.translate(0, 35);
    CTX.fillText("TRACE", 0,0);
    CTX.restore();

    CTX.save();
    CTX.fillStyle = LIGHTBLUE.hex();
    CTX.translate(0, -35);
    CTX.fillText("POLY", 0,0);
    CTX.restore();

    CTX.fillStyle = GRAY.hex();
    CTX.font = (20*Math.atan(Math.PI*t/1000)+40)+"px Arial";
    CTX.fillText("A tool for drawing a polygon path over an image.", 0,200);

    CTX.restore();
    /***** end draw title text *****/
}

function drawGrid()
{
    clearScreen();

    CTX.save();

    CTX.lineWidth = "2";
    CTX.strokeStyle = DARKGRAY.hex();

    // draw vertical lines
    for(var i=0; i<=COLUMNS; i++ )
    {
        CTX.beginPath();
        CTX.moveTo(i*CELLWIDTH,0);
        CTX.lineTo(i*CELLWIDTH,CELLHEIGHT*ROWS);
        CTX.stroke();
    }

    // draw horizontal lines
    for(var i=0; i<=ROWS; i++ )
    {
        CTX.beginPath();
        CTX.moveTo(0,i*CELLHEIGHT);
        CTX.lineTo(CELLWIDTH*COLUMNS,i*CELLHEIGHT);
        CTX.stroke();
    }

    CTX.restore();
}


function mouse_down(event)
{
    // if we're in the title screen
    if( APP_STATE == 'title' )
    {
        drawGrid();
        cancelAnimationFrame(LOOP_ID);
        APP_STATE = 'mode';
    }
    else if( APP_STATE == 'mode' )
    {

    }
    else if( APP_STATE == 'end' )
    {

    }
}

function mouse_up(event)
{

}

function mouse_move(event)
{

}

function key_down(event)
{
    if (lastEvent && lastEvent.which == event.which)
    {
        return;
    }

    // These will probably be useful later.
    switch( event.which )
    {
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
        case 37: // left
        case 38: // up
        case 39: // right
        case 40: // down
            return;
    }

    lastEvent = event;
    heldKeys[event.which] = true;
}

function key_up()
{
    lastEvent = null;
    delete(heldKeys[event.keyCode]); // Why is this keyCode and not which?
}
