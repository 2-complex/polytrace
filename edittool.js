
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
        var l = eventInfo.polyTraceDocument.polygons[i].handles;
        for( var j = 0; j < l.length; j++ )
        {
            draggableList.push( l[j] );
        }
    }

    if( ! this.draggable )
    {
        for ( var i = 0; i < eventInfo.polyTraceDocument.images.length; i++ )
        {
            var imageInfo = eventInfo.polyTraceDocument.images[i];
            draggableList.push( imageInfo );
        }
    }

    for( var i = 0; i < draggableList.length; i++ )
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
        this.draggable.drag(event);
        this.draggable = null;
    }
}

EditTool.prototype.manageCursor = function()
{
    document.body.style.cursor = "auto";
}

