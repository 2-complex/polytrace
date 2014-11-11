
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
            var p = l[j];

            var screenP = worldToCanvas(p);
            var dx = screenloc[0] - screenP[0];
            var dy = screenloc[1] - screenP[1];

            if( dx < Polygon.HANDLE_RADIUS && dx > -Polygon.HANDLE_RADIUS &&
                dy < Polygon.HANDLE_RADIUS && dy > -Polygon.HANDLE_RADIUS )
            {
                this.dragDown = p;
            }
        }
    }
/*
    if( ! this.dragDown )
    {
        var list = [];
        for ( var i = 0; i < eventInfo.polyTraceDocument.images.length; i++ )
        {
            var imageInfo = eventInfo.polyTraceDocument.images;

            if ( screenloc[0] - cornerA[0] > 0 &&
                 screenloc[1] - cornerA[1] > 0 &&


            var cornerA = canvasToWorld([
                imageInfo.position[0] + imageInfo.img.width,
                imageInfo.position[1] + imageInfo.img.height]);
        }
    }
    */
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

