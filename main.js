var canvas;
var ctx;

var lastEvent;
var heldKeys = {};

var images = [];
var polygons = [];
var myPolygon = null;
var offset = [0, 0];

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
    
    canvas.on('dragover', function(e){
		e.stopPropagation();
		e.preventDefault();    
    });

    canvas.on('dragenter', function(e){
		e.stopPropagation();
		e.preventDefault();    
    });

    canvas.on('drop', function(e){
		if(e.originalEvent.dataTransfer){
            if(e.originalEvent.dataTransfer.files.length) {
                e.preventDefault();
                e.stopPropagation();
				
				loadImage(e.originalEvent.dataTransfer.files[0]);
            }   
        }
    });    
});

function loadImage(file)
{
	var reader = new FileReader();

	reader.readAsDataURL(file);
	
	reader.onloadend = function(){
		var source = this.result;

		var img = new Image();
		img.onload = function()
		{
			images.push(new ImageInfo(img, [100,100]));
			drawScreen();
		}
		img.src = source; // triggers the load
	};
}

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


function worldToCanvas(position)
{
    return [position[0] + offset[0], position[1] + offset[1]];
}

function canvasToWorld(position)
{
    return [position[0] - offset[0], position[1] - offset[1]];
}

function drawLine(p, q)
{
    var pw = worldToCanvas(p);
    var qw = worldToCanvas(q);

    ctx.beginPath();
    ctx.moveTo(pw[0], pw[1]);
    ctx.lineTo(qw[0], qw[1]);
    ctx.stroke();
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
        drawLine( [i * CELLWIDTH, 0], [i * CELLWIDTH, canvas.height()] );
    }

    // draw horizontal lines
    for(var i = 1; i <= rows; i++ )
    {
        drawLine( [0, i * CELLHEIGHT], [canvas.width(), i * CELLHEIGHT] );
    }

    ctx.restore();
}

function drawImages()
{
    for ( var i=0; i<images.length; i++ )
    {
        images[i].draw(ctx, worldToCanvas);
    }
}

function drawPolygons()
{
    for ( var i=0; i<polygons.length; i++ )
    {
        polygons[i].draw(ctx, worldToCanvas);
    }
}

function drawScreen()
{
    clearScreen();
    drawImages();
    drawGrid();
    drawPolygons();
	manageCursor();
}

function manageCursor()
{
    if( APP_STATE == 'title' )
    {
		document.body.style.cursor = "auto";
    }
    else if( APP_STATE == 'mode' )
    {
		document.body.style.cursor = "crosshair";
    }
    else if( APP_STATE == 'end' )
    {
    }
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

        var clickPosition = [event.offsetX, event.offsetY];
        myPolygon.vertices.push(canvasToWorld(clickPosition));
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
            offset[0] -= 30;
            break;
        case 38: // up
            offset[1] -= 30;
            break;
        case 39: // right
            offset[0] += 30;
            break;
        case 40: // down
            offset[1] += 30;
            return;
    }
    
    lastEvent = event;
    heldKeys[event.which] = true;

    drawScreen();
}

function key_up(event)
{
    lastEvent = null;

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
        case 32: // space
            return;
    }

    delete(heldKeys[event.keyCode]); // Why is this keyCode and not which?
}

