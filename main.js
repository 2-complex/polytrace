var canvas;
var ctx;
var exportButton;
var exportWindow = null;

var lastEvent;
var heldKeys = {};

var images = [];
var polygons = [];
var currentPolygon = null;
var offset = [0, 0];
var scaleFactor = 1.0;

var LOOP_ID = null;
var APP_STATE = null;

var CELLWIDTH = 100;
var CELLHEIGHT = 100;

var dragDown = null;
var dragDiff = [0,0];

// Colors of things
var gridColor = "hsla(0, 0%, 50%, 0.5)";
var polygonStrokeColor = "rgba(0, 255, 50, 1.0)";

$(document).ready(function documentReady ()
{
    canvas = $("#canvas");
    exportButton = $('button.export');

    window.onkeydown = keyDown;
    window.onkeyup = keyUp;

    canvas.on("mousedown", mouseDown);
    canvas.on("mouseup", mouseUp);
    canvas.on("mousemove", mouseMove);
    canvas.on("dblclick", doubleClick);
    canvas.on("mousewheel", mouseWheel);

    $(window).on("resize", resize);

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

    exportButton.on('mousedown', exportJSON);
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

function exportJSON()
{
    if (exportWindow === null)
    {
        exportWindow = $('<div>').addClass('export').appendTo('body');
        var exportData = $('<textarea>').prop('readonly', true).appendTo(exportWindow);
        var closeButton = $('<button>').html('Close').appendTo(exportWindow);

        exportData.val(JSON.stringify(polygons[0].vertices));

        closeButton.on('mouseup', function(){
            exportWindow.remove();
            exportWindow = null;
        });
    }
    else
    {
        exportWindow.remove();
        exportWindow = null;
    }
}


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
    return [scaleFactor * position[0] + offset[0], scaleFactor * position[1] + offset[1]];
}

function canvasToWorld(position)
{
    return [(position[0] - offset[0]) / scaleFactor, (position[1] - offset[1]) / scaleFactor];
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

function resize(event)
{
    canvas.attr('width', window.innerWidth);
    canvas.attr('height', window.innerHeight);

    drawScreen();
}

function mouseDown(event)
{
    if( APP_STATE == 'title' )
    {
        drawScreen();
        cancelAnimationFrame(LOOP_ID);
        APP_STATE = 'mode';
    }
    else if( APP_STATE == 'mode' )
    {
        var v = [event.offsetX, event.offsetY];

        if( event.button == 1 )
        {
            dragDown = offset;
            dragDiff = [offset[0] - v[0], offset[1] - v[1]];
        }
        else
        {
            if( currentPolygon == null )
            {
                currentPolygon = new Polygon();
                polygons.push(currentPolygon);
            }
            currentPolygon.vertices.push(canvasToWorld(v));
        }
    }
    else if( APP_STATE == 'end' )
    {
    }

    drawScreen();
}

function doubleClick()
{
    if( APP_STATE == 'mode' )
    {
        currentPolygon.close();
        currentPolygon = null;
    }

    drawScreen();
}

function mouseWheel(event)
{
    var delta = event.originalEvent.wheelDeltaY;
    scaleFactor *= Math.pow(1.1, delta / 1000.0);

    if( scaleFactor > 10.0 )
    {
        scaleFactor = 10.0;
    }
    if( scaleFactor < 1.0 / 10.0 )
    {
        scaleFactor = 1.0 / 10.0;
    }

    drawScreen();
}

function mouseMove(event)
{
    var v = [event.offsetX, event.offsetY];

    if( dragDown )
    {
        dragDown[0] = dragDiff[0] + v[0];
        dragDown[1] = dragDiff[1] + v[1];

        drawScreen();
    }
}

function mouseUp(event)
{
    dragDown = null;

    drawScreen();
}

function keyDown(event)
{
    if (lastEvent && lastEvent.which == event.which)
    {
        return;
    }

    switch( event.which )
    {
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
        return;

        case 187: // =
            scaleFactor *= 1.1;
        break;

        case 189: // -
            scaleFactor /= 1.1;
        break;

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
            break;
    }

    lastEvent = event;
    heldKeys[event.which] = true;

    drawScreen();
}

function keyUp()
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

