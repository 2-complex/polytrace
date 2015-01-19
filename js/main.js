var body;
var canvas;
var ctx;
var exportButton;
var moveButton;
var editButton;
var undoButton;
var redoButton;
var exportWindow = null;

var lastEvent;
var heldKeys = {};

var offset = [0, 0];
var scaleFactor = 1.0;
var rotation = 0.0;

var LOOP_ID = null;
var APP_STATE = null;

var cellSize = 100;

var polyTraceDocument = new PolyTraceDocument();
var polygonTool = new PolygonTool();
var handTool = new HandTool();
var editTool = new EditTool();

var selectedTool = polygonTool;
var tempTool = null;

var undoManager = new UndoManager();

var math = o3djs.math;
var matrix4 = o3djs.math.matrix4;


function currentTool()
{
    return tempTool || selectedTool;
}

// Colors of things
var gridColor = "hsla(0, 0%, 50%, 0.5)";
var polygonStrokeColor = "rgba(0, 255, 50, 1.0)";

$(document).ready(function documentReady ()
{
    body = $('body');
    canvas = $("#canvas");
    exportButton = $('button.export');

    polyButton = $('button.poly');
    handButton = $('button.hand');
    editButton = $('button.edit');
    undoButton = $('button.undo');
    redoButton = $('button.redo');

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

    polyButton.on('mousedown', function() {selectedTool = polygonTool;} );
    handButton.on('mousedown', function() {selectedTool = handTool;});
    editButton.on('mousedown', function() {selectedTool = editTool;} );

    undoButton.on('mousedown', function() {undoManager.undo(); drawScreen();});
    redoButton.on('mousedown', function() {undoManager.redo(); drawScreen();});
});

function loadImage(file)
{
    var reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = function()
    {
        var source = this.result;
        var img = new Image();
        img.onload = function()
        {
            var newImageInfo = new ImageInfo(img, [100,100]);
            polyTraceDocument.addImage(newImageInfo);
            undoManager.push(
                polyTraceDocument.removeImage, polyTraceDocument, [newImageInfo],
                polyTraceDocument.addImage, polyTraceDocument, [newImageInfo]);
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

        exportData.val( polyTraceDocument.serialize() );

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

function getViewMatrix()
{
    var c = Math.cos(rotation);
    var s = Math.sin(rotation);
    return [
        [scaleFactor * c, scaleFactor * s, 0, 0],
        [-scaleFactor * s, scaleFactor * c, 0, 0],
        [0, 0, 1, 0],
        [offset[0], offset[1], 0, 1]
    ];
}

function worldToCanvas(position)
{
    return matrix4.transformPoint(
        getViewMatrix(),
        [position[0], position[1], 0]).slice(0,2);
}

function canvasToWorld(position)
{
    return matrix4.transformPoint(
        matrix4.inverse(getViewMatrix()),
        [position[0], position[1], 0]).slice(0,2);
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
    var corners = [
        canvasToWorld([0, 0]),
        canvasToWorld([0, canvas.height()]),
        canvasToWorld([canvas.width(), 0]),
        canvasToWorld([canvas.width(), canvas.height()])
    ];

    var worldLeft = corners[0][1];
    var worldBottom = corners[0][1];
    var worldRight = corners[0][0];
    var worldTop = corners[0][1];

    for( var i = 0; i < corners.length; i++ )
    {
        worldLeft = Math.min(worldLeft, corners[i][0]);
        worldRight = Math.max(worldRight, corners[i][0]);
        worldBottom = Math.min(worldBottom, corners[i][1]);
        worldTop = Math.max(worldTop, corners[i][1]);
    }

    worldLeft = Math.floor( worldLeft / cellSize ) * cellSize;
    worldRight = (Math.floor( worldRight / cellSize ) + 1) * cellSize;

    worldBottom = Math.floor( worldBottom / cellSize ) * cellSize;
    worldTop = (Math.floor( worldTop / cellSize ) + 1) * cellSize;

    var columns = (worldRight - worldLeft) / cellSize;
    var rows = (worldTop - worldBottom) / cellSize;

    ctx.save();

    ctx.lineWidth = "1";
    ctx.strokeStyle = gridColor;


    // draw 'vertical' lines
    for( var i = 1; i <= columns; i++ )
    {
        ctx.beginPath();

        var A = worldToCanvas([worldLeft + i * cellSize, worldBottom]);
        var B = worldToCanvas([worldLeft + i * cellSize, worldTop]);

        ctx.moveTo(A[0], A[1]);
        ctx.lineTo(B[0], B[1]);

        ctx.stroke();
    }

    // draw 'horizontal' lines
    for( var i = 1; i <= rows; i++ )
    {
        ctx.beginPath();

        var A = worldToCanvas([worldLeft, worldBottom + i * cellSize]);
        var B = worldToCanvas([worldRight, worldBottom + i * cellSize]);

        ctx.moveTo(A[0], A[1]);
        ctx.lineTo(B[0], B[1]);

        ctx.stroke();
    }

    ctx.restore();
}

function getDrawList()
{
    return [].concat(
        polyTraceDocument.images,
        polyTraceDocument.polygons);
}

function draw(drawList)
{
    for ( var i=0; i<drawList.length; i++ )
    {
        drawList[i].draw(ctx, worldToCanvas);
    }
}

function drawScreen()
{
    clearScreen();
    draw( getDrawList() );
    drawGrid();
    manageCursor();
}

function manageCursor()
{
    var tool = currentTool();

    if( APP_STATE == 'title' )
    {
        document.body.style.cursor = "auto";
    }
    else if( tool )
    {
        tool.manageCursor();
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
            tempTool = handTool;
        }

        currentTool().mouseDown({
            polyTraceDocument : polyTraceDocument,
            worldLocation : canvasToWorld(v),
            event : event,
            offset : offset});
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
        currentTool().doubleClick({
            polyTraceDocument : polyTraceDocument,
            event : event});
    }

    drawScreen();
}

function preserveCenterDo(modifier, args)
{
    var beforeMiddle = canvasToWorld([canvas.width() / 2, canvas.height() / 2]);

    modifier.apply({}, args);

    var afterMiddle = canvasToWorld([canvas.width() / 2, canvas.height() / 2]);
    var nudge = [ afterMiddle[0] - beforeMiddle[0], afterMiddle[1] - beforeMiddle[1] ];

    var c = Math.cos(rotation);
    var s = Math.sin(rotation);

    offset[0] += scaleFactor * ( c * nudge[0] - s * nudge[1] );
    offset[1] += scaleFactor * ( s * nudge[0] + c * nudge[1] );
}

function zoomInternal(mult)
{
    scaleFactor *= mult;
    if( scaleFactor > 10.0 )
    {
        scaleFactor = 10.0;
    }
    if( scaleFactor < 1.0 / 10.0 )
    {
        scaleFactor = 1.0 / 10.0;
    }
}

function zoom(mult)
{
    preserveCenterDo(zoomInternal, [mult]);
}

function rotateInternal(theta)
{
    rotation += theta;
}

function rotate(theta)
{
    preserveCenterDo(rotateInternal, [theta]);
}

function mouseWheel(event)
{
    var delta = event.originalEvent.wheelDeltaY;
    zoom(Math.pow(1.1, delta / 1000.0));
    drawScreen();
}

function mouseMove(event)
{
    var v = [event.offsetX, event.offsetY];

    currentTool().mouseMove({
        polyTraceDocument : polyTraceDocument,
        worldLocation : canvasToWorld(v),
        event : event});

    drawScreen();
}

function mouseUp(event)
{
    var v = [event.offsetX, event.offsetY];

    currentTool().mouseUp({
        polyTraceDocument : polyTraceDocument,
        worldLocation : canvasToWorld(v),
        event : event});

    tempTool = null;
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
            zoom(1.1);
        break;

        case 189: // -
            zoom(1.0/1.1);
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

        case 190: //.
            rotate(Math.PI / 12);
            break;

        case 188: //,
            rotate(-Math.PI / 12);
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

