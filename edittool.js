
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
    for ( var i = 0; i < eventInfo.polyTraceDocument.polygons.length; i++ )
    {
        var l = eventInfo.polyTraceDocument.polygons[i].vertices;

        for ( var j = 0; j < l.length; j++ )
        {
            var screenP = worldToCanvas(l[j]);

            var dx = screenloc[0] - screenP[0];
            var dy = screenloc[1] - screenP[1];

            if( dx < Polygon.HANDLE_RADIUS && dx > -Polygon.HANDLE_RADIUS &&
                dy < Polygon.HANDLE_RADIUS && dy > -Polygon.HANDLE_RADIUS )
            {
                this.dragDown = l[j];
            }
        }
    }

    if( ! this.draggable )
    {
        var canvasLoc = canvasToWorld(screenloc);
        var list = [];
        for ( var i = 0; i < eventInfo.polyTraceDocument.images.length; i++ )
        {
            var imageInfo = eventInfo.polyTraceDocument.images[i];

            var cornerA = imageInfo.position;
            var cornerB = [
                imageInfo.position[0] + imageInfo.img.width,
                imageInfo.position[1] + imageInfo.img.height];

            if ( canvasLoc[0] - cornerA[0] > 0 &&
                 canvasLoc[1] - cornerA[1] > 0 &&
                 canvasLoc[0] - cornerB[0] < 0 &&
                 canvasLoc[1] - cornerB[1] < 0 )
            {
                var v = canvasToWorld([event.offsetX, event.offsetY]);
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

