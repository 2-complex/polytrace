
function EditTool(traceDocument)
{
    this.draggable = null;
    this.dragDiff = [0,0];
}

EditTool.prototype.mouseDown = function(eventInfo)
{
    var event = eventInfo.event;
    var screenloc = [event.offsetX, event.offsetY];

    var draggables = eventInfo.polyTraceDocument.getDraggables();

    for( var i = draggables.length-1; i >= 0 ; i-- )
    {
        if( draggables[i].clickIn(screenloc) )
        {
            this.draggable = draggables[i];
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

