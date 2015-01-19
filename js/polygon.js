
Polygon = function()
{
    this.vertices = [];
    this.handles = [];
    this.closed = false;
}

Polygon.prototype.draw = function(ctx, info)
{
    var convert = info.convert;

    if( this.vertices.length > 0 )
    {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = polygonStrokeColor;

        var v = convert(this.vertices[0]);
        ctx.moveTo(v[0], v[1]);

        for ( var i=1; i<this.vertices.length; i++ )
        {
            var v = convert(this.vertices[i]);
            ctx.lineTo(v[0], v[1]);
        }

        if( this.closed )
        {
            var v = convert(this.vertices[0]);
            ctx.lineTo(v[0], v[1]);
        }

        ctx.stroke();
    }

    for ( var i=0; i<this.vertices.length; i++ )
    {
        this.handles[i].draw(ctx, convert);
    }
}

Polygon.prototype.add = function(newVertex)
{
    var newVertexCopy = [newVertex[0], newVertex[1]];
    this.vertices.push(newVertexCopy);
    this.handles.push(new Handle(newVertexCopy));
}

Polygon.prototype.close = function()
{
    this.closed = true;
}

