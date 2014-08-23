var CANVAS;
var CTX;

var lastEvent;
var heldKeys = {};

var images = [];
var polygons = [];
var myPolygon = null;

var LOOP_ID = null;
var APP_STATE = null;

var CELLWIDTH = 100;
var CELLHEIGHT = 100;



// Colors of things
var gridColor = "hsla(0, 0%, 50%, 0.5)";
var polygonStrokeColor = "rgba(0, 255, 50, 1.0)";



function init()
{
    window.onkeydown = key_down;
    window.onkeyup = key_up;

    window.onmousemove = mouse_move;
    window.onmouseup = mouse_up;
    window.onmousedown = mouse_down;
    window.ondblclick = double_click;

    CANVAS = document.getElementById("canvas");

    if( CANVAS.getContext )
    {
        CTX = CANVAS.getContext("2d");

        CANVAS.width = window.innerWidth;
        CANVAS.height = window.innerHeight;

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
    CTX.fillStyle = "#00e";
    CTX.fillRect(-w, -h, 2*w, 2*h);
    CTX.restore();

    CTX.save();
    CTX.fillStyle = "#000";
    CTX.translate(0, 35);
    CTX.fillText("TRACE", 0,0);
    CTX.restore();

    CTX.save();
    CTX.fillStyle = "#0ef";
    CTX.translate(0, -35);
    CTX.fillText("POLY", 0,0);
    CTX.restore();

    CTX.fillStyle = "#555";
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
    var columns = Math.floor(CANVAS.width/CELLWIDTH);
    var rows = Math.floor(CANVAS.height/CELLHEIGHT);

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
        CTX.moveTo(0, i * CELLHEIGHT);
        CTX.lineTo(CANVAS.width, i * CELLHEIGHT);
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
    for ( var i=0; i<polygons.length; i++ )
    {
        polygons[i].draw();
    }
}

function drawScreen()
{
    clearScreen();
    drawImages();
    drawGrid();
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
        if( myPolygon == null )
        {
            myPolygon = new Polygon();
            polygons.push(myPolygon);
        }

        myPolygon.vertices.push([event.offsetX, event.offsetY]);
    }
    else if( APP_STATE == 'end' )
    {
    }

    drawScreen();
}

function double_click()
{
    if( APP_STATE == 'mode' )
    {
        myPolygon.close();
        myPolygon = null;
    }
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


