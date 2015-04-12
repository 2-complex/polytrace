
function PolygonTool(traceDocument)
{
    this.currentPolygon = null;
}

PolygonTool.prototype.mouseDown = function(eventInfo)
{
    if( this.currentPolygon == null )
    {
        this.currentPolygon = new Polygon();
        eventInfo.polyTraceDocument.addPolygon(this.currentPolygon);
        undoManager.push(
            eventInfo.polyTraceDocument.removePolygon, eventInfo.polyTraceDocument, [this.currentPolygon],
            eventInfo.polyTraceDocument.addPolygon, eventInfo.polyTraceDocument, [this.currentPolygon]);
    }

    if( this.currentPolygon.vertices.length > 0 )
    {
        var lastp = this.currentPolygon.vertices[this.currentPolygon.vertices.length - 1].center;
        if( ! (eventInfo.worldLocation[0] == lastp[0] &&
               eventInfo.worldLocation[1] == lastp[1] ) )
        {
            this.currentPolygon.add(eventInfo.worldLocation);
        }
    }
    else
    {
        this.currentPolygon.add(eventInfo.worldLocation);
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

