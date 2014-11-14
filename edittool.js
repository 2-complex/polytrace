
function EditTool(traceDocument)
{
    this.dragDown = null;
    this.dragDiff = [0,0];
}

EditTool.prototype.mouseDown = function(eventInfo)
{
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

    if( ! this.dragDown )
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
                this.dragDown = imageInfo.position;
            }
        }
    }

    if( this.dragDown )
    {
        var v = canvasToWorld([event.offsetX, event.offsetY]);
        this.dragDiff[0] = this.dragDown[0] - v[0];
        this.dragDiff[1] = this.dragDown[1] - v[1];
    }
}

EditTool.prototype.mouseMove = function(eventInfo)
{
    if( this.dragDown )
    {
        var v = canvasToWorld([event.offsetX, event.offsetY]);
        this.dragDown[0] = this.dragDiff[0] + v[0];
        this.dragDown[1] = this.dragDiff[1] + v[1];
    }
}

EditTool.prototype.doubleClick = function(eventInfo)
{
}

EditTool.prototype.mouseUp = function(eventInfo)
{
    if( this.dragDown )
    {
        var v = canvasToWorld([event.offsetX, event.offsetY]);
        this.dragDown[0] = this.dragDiff[0] + v[0];
        this.dragDown[1] = this.dragDiff[1] + v[1];
        this.dragDown = null;
    }
}

EditTool.prototype.manageCursor = function()
{
    document.body.style.cursor = "auto";
}

