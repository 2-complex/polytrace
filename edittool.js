
function EditTool(traceDocument)
{
    this.dragDown = null;
    this.draggable = null;
    this.dragDiff = [0,0];
}

EditTool.prototype.mouseDown = function(eventInfo)
{
    var event = eventInfo.event;

    var screenloc = [event.offsetX, event.offsetY];

    var list = [];
    for( var i = 0; i < eventInfo.polyTraceDocument.polygons.length; i++ )
    {
        var l = eventInfo.polyTraceDocument.polygons[i].handles;

        for( var j = 0; j < l.length; j++ )
        {
            if( l[j].clickIn(screenloc) )
            {
                this.dragDown = l[j].position;
            }
        }
    }

    if( ! this.draggable )
    {
        var list = [];
        for ( var i = 0; i < eventInfo.polyTraceDocument.images.length; i++ )
        {
            var imageInfo = eventInfo.polyTraceDocument.images[i];

            if( imageInfo.clickIn(screenloc) )
            {
                this.draggable = imageInfo;
            }
        }
    }

    if( this.dragDown )
    {
        var v = canvasToWorld([event.offsetX, event.offsetY]);
        this.dragDiff[0] = this.dragDown[0] - v[0];
        this.dragDiff[1] = this.dragDown[1] - v[1];
    }

    if( this.draggable )
    {
        this.draggable.startDrag(event);
    }
}

EditTool.prototype.mouseMove = function(eventInfo)
{
    var event = eventInfo.event;

    if( this.dragDown )
    {
        var v = canvasToWorld([event.offsetX, event.offsetY]);
        this.dragDown[0] = this.dragDiff[0] + v[0];
        this.dragDown[1] = this.dragDiff[1] + v[1];
    }

    if( this.draggable )
    {
        this.draggable.drag(event);
    }
}

EditTool.prototype.doubleClick = function(eventInfo)
{
    var event = eventInfo.event;
}

EditTool.prototype.mouseUp = function(eventInfo)
{
    var event = eventInfo.event;

    if( this.dragDown )
    {
        var v = canvasToWorld([event.offsetX, event.offsetY]);
        this.dragDown[0] = this.dragDiff[0] + v[0];
        this.dragDown[1] = this.dragDiff[1] + v[1];
        this.dragDown = null;
    }

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

