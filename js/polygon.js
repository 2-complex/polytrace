
Polygon = function()
{
    this.vertices = [];
    this.bezier = [];
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

        var v = convert(matrix4.transformPoint2(info.matrix, this.vertices[0]));
        ctx.moveTo(v[0], v[1]);
        var last_x = v[0];
        var last_y = v[1];

        var i = 1;
        for ( ; i<this.vertices.length; i++ )
        {
            var v = convert(matrix4.transformPoint2(info.matrix, this.vertices[i]));
            var b = convert(matrix4.transformVector2(info.matrix, this.bezier[i-1].back));
            var f = convert(matrix4.transformVector2(info.matrix, this.bezier[i-1].front));
            ctx.bezierCurveTo(last_x + b[0], last_y + b[1], v[0], v[1], v[0] + f[0], v[1] + f[1]);
            last_x = v[0];
            last_y = v[1];
        }

        if( this.closed )
        {
            var v = convert(matrix4.transformPoint2(info.matrix, this.vertices[0]));
            var b = convert(matrix4.transformVector2(info.matrix, this.bezier[i-1].back));
            var f = convert(matrix4.transformVector2(info.matrix, this.bezier[i-1].front));
            ctx.bezierCurveTo(last_x + b[0], last_y + b[1], v[0], v[1], v[0] + f[0], v[1] + f[1]);
        }

        ctx.stroke();
    }

    for ( var i=0; i<this.vertices.length; i++ )
    {
        this.handles[i].draw(ctx, info);
    }
}

Polygon.prototype.add = function(newVertex)
{
    var newVertexCopy = [newVertex[0], newVertex[1]];
    this.vertices.push(newVertexCopy);
    this.handles.push(new Handle(newVertexCopy));

    if( this.vertices.length > 1 )
    {
        var b = [0,0];
        var f = [0,0];
        this.bezier.push({back:b, front:f});
        this.handles.push(new Handle(b));
        this.handles.push(new Handle(f));
    }

}

Polygon.prototype.close = function()
{
    this.closed = true;
    this.bezier.push({back:[0,0], front:[0,0]});
}

