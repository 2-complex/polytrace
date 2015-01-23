
function PolyTraceDocument()
{
    this.images = [];
    this.polygons = [];

    this.rootNode = new Node();
}

PolyTraceDocument.prototype.draw = function(ctx, info)
{
    this.rootNode.draw(ctx, info);
}

PolyTraceDocument.prototype.close = function()
{
}

PolyTraceDocument.prototype.serialize = function()
{
    return JSON.stringify( {'polygons' : this.polygons, 'images' : []} );
}


PolyTraceDocument.prototype.addImage = function(imageInfo)
{
    this.images.push(imageInfo);
    this.rootNode.add(imageInfo);
}

PolyTraceDocument.prototype.removeImage = function(imageInfo)
{
    var index = this.images.indexOf(imageInfo);
    this.images.splice(index, 1);
    this.rootNode.remove(imageInfo);
}

PolyTraceDocument.prototype.addPolygon = function(poly)
{
    this.polygons.push(poly);
    this.rootNode.add(poly);
}

PolyTraceDocument.prototype.removePolygon = function(poly)
{
    var index = this.polygons.indexOf(poly);
    this.polygons.splice(index, 1);
    this.rootNode.remove(poly);
}

PolyTraceDocument.prototype.getDraggables = function()
{
    var draggableList = [];

    for( var i = 0; i < this.polygons.length; i++ )
    {
        draggableList = draggableList.concat(this.polygons[i].handles);
    }

    return this.images.concat( draggableList, this.rootNode.getDraggables() );
}

