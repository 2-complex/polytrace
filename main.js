var CANVAS;
var CTX;

var lastEvent;
var heldKeys = {};

var images = [];
var handles = [[100,100]];

var LOOP_ID = null;
var APP_STATE = null;

// var CELLSIZE = 100;
// var COLUMNS = 32;
// var ROWS = 24;
var CELLWIDTH = 100;
var CELLHEIGHT = 100;


// Colors of things
var gridColor = LIGHTGRAY.hex();

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

//         COLUMNS = Math.floor(CANVAS.width/CELLSIZE);
//         ROWS = Math.floor(CANVAS.height/CELLSIZE);
//         CELLWIDTH = CANVAS.width/COLUMNS;
//         CELLHEIGHT = CANVAS.height/ROWS;

        APP_STATE = 'title';
        titleScreen();
    }

    var input = document.getElementById('input');
    input.addEventListener('change', handleFiles, false);
}

function clearScreen()
{
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
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

function handleFiles(e)
{
    var url = URL.createObjectURL(e.target.files[0]);
    var img = new Image();
    img.onload = function()
    {
        images.push(img);
    }
    img.src = url; // triggers the load
}

function drawGrid()
{
	var columns = Math.floor(CANVAS.width/CELLWIDTH),
        rows = Math.floor(CANVAS.height/CELLHEIGHT);

    CTX.save();

    CTX.lineWidth = "2";
    CTX.strokeStyle = gridColor;

    // draw vertical lines
    for(var i = 1; i <= columns ; i++ )
    {
        CTX.beginPath();
        CTX.moveTo(i * CELLWIDTH, 0);
        CTX.lineTo(i * CELLWIDTH, CANVAS.height);
        CTX.stroke();
    }

    // draw horizontal lines
    for(var i = 1; i <= rows; i++ )
    {
        CTX.beginPath();
        CTX.moveTo(0,i*CELLHEIGHT);
        CTX.lineTo(CANVAS.width,i*CELLHEIGHT);
        CTX.stroke();
    }

    CTX.restore();
}

function drawImages()
{
    for ( var i=0; i<images.length; i++ )
    {
        CTX.drawImage(images[i], 100, 100);
    }
}

function drawPolygons()
{
    for ( var i=0; i<handles.length; i++ )
    {
        var x = handles[i][0];
        var y = handles[i][1];
        var w = 4;
        var h = 4;
        CTX.fillStyle = GREEN.hex();
        CTX.strokeStyle = GREEN.hex();
        CTX.strokeRect(x-w, y-w, 2*w, 2*h);
    }

    CTX.beginPath();

    CTX.lineWidth = 2;
    CTX.strokeStyle = GREEN.hex();
    if ( handles.length > 0 )
    {
        var x = handles[0][0];
        var y = handles[0][1];
        CTX.moveTo(x, y);
}

    for ( var i=1; i<handles.length; i++ )
    {
        var x = handles[i][0];
        var y = handles[i][1];
        CTX.lineTo(x, y);
    }

    CTX.stroke();
}

function drawScreen()
{
    clearScreen();
    drawGrid();

    drawImages();
    drawPolygons();
}

function mouse_down(event)
{
    if( APP_STATE == 'title' )
    {
        drawScreen();
        cancelAnimationFrame(LOOP_ID);
        APP_STATE = 'mode';
    }
    else if( APP_STATE == 'mode' )
    {
        handles.push([event.clientX, event.clientY]);
    }
    else if( APP_STATE == 'end' )
    {
    }

    drawScreen();
}

function mouse_move(event)
{
    drawScreen();
}

function mouse_up(event)
{
    drawScreen();
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


