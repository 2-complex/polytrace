var canvas;
var ctx;
var input;

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

$(document).ready(function documentReady ()
{
	canvas = $("#canvas");
	input = $("#input");

    window.onkeydown = key_down;
    window.onkeyup = key_up;

	canvas.on("mousedown", mouse_down);
	canvas.on("mouseup", mouse_up);
	canvas.on("mousemove", mouse_move);
	canvas.on("dblclick", double_click);

    if( canvas[0].getContext )
    {
        ctx = canvas[0].getContext("2d");

		canvas.attr('width', window.innerWidth);
		canvas.attr('height', window.innerHeight);

        APP_STATE = 'title';
        titleScreen();
    }

	input.change(handleFiles);
});

$(window).resize(function(){
	canvas.attr('width', window.innerWidth);
	canvas.attr('height', window.innerHeight);
	drawScreen();
});

function clearScreen()
{
    ctx.clearRect(0, 0, canvas.width(), canvas.height());
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
    ctx.save();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "80px Arial";
    ctx.translate(canvas.width()/2, canvas.height()/2);

    ctx.save();
    var w = 200;
    var h = 100;
    ctx.fillStyle = "#00f";
    ctx.fillRect(-w, -h, 2*w, 2*h);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "#000";
    ctx.translate(0, 35);
    ctx.fillText("TRACE", 0,0);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "#0ef";
    ctx.translate(0, -35);
    ctx.fillText("POLY", 0,0);
    ctx.restore();

    ctx.fillStyle = "#555";
    ctx.font = (20*Math.atan(Math.PI*t/1000)+40)+"px Arial";
    ctx.fillText("A tool for drawing a polygon path over an image.", 0,200);

    ctx.restore();
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
    var columns = Math.floor(canvas.width()/CELLWIDTH);
    var rows = Math.floor(canvas.height()/CELLHEIGHT);

    ctx.save();

    ctx.lineWidth = "2";
    ctx.strokeStyle = gridColor;

    // draw vertical lines
    for(var i = 1; i <= columns ; i++ )
    {
        ctx.beginPath();
        ctx.moveTo(i * CELLWIDTH, 0);
        ctx.lineTo(i * CELLWIDTH, canvas.height());
        ctx.stroke();
    }

    // draw horizontal lines
    for(var i = 1; i <= rows; i++ )
    {
        ctx.beginPath();
        ctx.moveTo(0, i * CELLHEIGHT);
        ctx.lineTo(canvas.width(), i * CELLHEIGHT);
        ctx.stroke();
    }

    ctx.restore();
}

function drawImages()
{
    for ( var i=0; i<images.length; i++ )
    {
        ctx.drawImage(images[i], 100, 100);
    }
}

function drawPolygons()
{
    for ( var i=0; i<polygons.length; i++ )
    {
        polygons[i].draw(ctx);
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


