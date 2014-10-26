
function PolygonTool(traceDocument)
{
    this.currentPolygon = null;
}

PolygonTool.prototype.mouseDown = function(polyTraceDocument, worldLocation)
{
    if( this.currentPolygon == null )
    {
        this.currentPolygon = new Polygon();
        polyTraceDocument.polygons.push(this.currentPolygon);
    }
    this.currentPolygon.vertices.push(worldLocation);
}

PolygonTool.prototype.doubleClick = function(polyTraceDocument, worldLocation)
{
    this.currentPolygon.close();
    this.currentPolygon = null;
}

PolygonTool.prototype.mouseUp = function()
{
    this.currentPolygon.close();
}

