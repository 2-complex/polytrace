
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

            var screenP = canvasToWorld(p);
            var dx = screenloc[0] - screenP[0];
            var dy = screenloc[1] - screenP[1];

            if( dx < 3 && dx > -3 &&
                dy < 3 && dy > -3 )
            {
                this.dragDown = p;
            }
        }
    }
}

EditTool.prototype.mouseMove = function(eventInfo)
{
    if( this.dragDown )
    {
        var v = [event.offsetX, event.offsetY];
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
        var v = [event.offsetX, event.offsetY];
        this.dragDown[0] = this.dragDiff[0] + v[0];
        this.dragDown[1] = this.dragDiff[1] + v[1];
        this.dragDown = null;
    }
}

EditTool.prototype.manageCursor = function()
{
    document.body.style.cursor = "auto";
}

