
function EditTool(traceDocument)
{
    this.draggable = null;
    this.dragDiff = [0,0];
}

EditTool.prototype.mouseDown = function(eventInfo)
{
    var event = eventInfo.event;
    var screenloc = [event.offsetX, event.offsetY];

    var draggableList = [];

    for( var i = 0; i < eventInfo.polyTraceDocument.polygons.length; i++ )
    {
        draggableList = draggableList.concat(eventInfo.polyTraceDocument.polygons[i].handles);
    }

    draggableList = eventInfo.polyTraceDocument.images.concat( draggableList );

    for( var i = draggableList.length-1; i >= 0 ; i-- )
    {
        if( draggableList[i].clickIn(screenloc) )
        {
            this.draggable = draggableList[i];
            break;
        }
    }

    if( this.draggable )
    {
        this.draggable.startDrag(event);
    }
}

EditTool.prototype.mouseMove = function(eventInfo)
{
    var event = eventInfo.event;

    if( this.draggable )
    {
        this.draggable.drag(event);
    }
}

EditTool.prototype.doubleClick = function(eventInfo)
{
}

EditTool.prototype.mouseUp = function(eventInfo)
{
    var event = eventInfo.event;

    if( this.draggable )
    {
        this.draggable.finishDrag(event);
        this.draggable = null;
    }
}

EditTool.prototype.manageCursor = function()
{
    document.body.style.cursor = "auto";
}

