
function PolygonTool(traceDocument)
{
    this.currentPolygon = null;
}

PolygonTool.prototype.mouseDown = function(eventInfo)
{
    if( this.currentPolygon == null )
    {
        this.currentPolygon = new Polygon();
        eventInfo.polyTraceDocument.polygons.push(this.currentPolygon);
    }

    if( this.currentPolygon.vertices.length > 0 )
    {
        var lastp = this.currentPolygon.vertices[this.currentPolygon.vertices.length - 1];
        if( ! (eventInfo.worldLocation[0] == lastp[0] &&
               eventInfo.worldLocation[1] == lastp[1] ) )
        {
            this.currentPolygon.vertices.push(eventInfo.worldLocation);
        }
    }
    else
    {
        this.currentPolygon.vertices.push(eventInfo.worldLocation);
    }
}

PolygonTool.prototype.mouseMove = function(eventInfo)
{

}

PolygonTool.prototype.doubleClick = function(eventInfo)
{
    this.currentPolygon.close();
    this.currentPolygon = null;
}

PolygonTool.prototype.mouseUp = function(eventInfo)
{
}

PolygonTool.prototype.manageCursor = function()
{
    document.body.style.cursor = "crosshair";
}
