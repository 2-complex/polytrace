
function PolyTraceDocument()
{
    this.images = [];
    this.polygons = [];
}

PolyTraceDocument.prototype.draw = function()
{
}

PolyTraceDocument.prototype.close = function()
{
}

PolyTraceDocument.prototype.addImage = function(imageInfo)
{
    this.images.push(imageInfo);
}

PolyTraceDocument.prototype.removeImage = function(imageInfo)
{
    var index = this.images.indexOf(imageInfo);
    this.images.splice(index, 1);
}

PolyTraceDocument.prototype.addPolygon = function(poly)
{
    this.polygons.push(poly);
}

PolyTraceDocument.prototype.removePolygon = function(poly)
{
    var index = this.polygons.indexOf(poly);
    this.polygons.splice(index, 1);
}

