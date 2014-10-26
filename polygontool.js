
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
    this.currentPolygon.vertices.push(eventInfo.worldLocation);
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

