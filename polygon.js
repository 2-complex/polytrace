
function Polygon()
{
    this.vertices = [];
    this.closed = false;
}

Polygon.prototype.draw = function(ctx, convert)
{
    for ( var i=0; i<this.vertices.length; i++ )
    {
        var v = convert(this.vertices[i]);

        var x = v[0]
        var y = v[1];
        var w = 4;
        var h = 4;
        ctx.fillStyle = polygonStrokeColor;
        ctx.strokeStyle = polygonStrokeColor;
        ctx.strokeRect(x-w, y-w, 2*w, 2*h);
    }

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
}

Polygon.prototype.close = function()
{
    this.closed = true;
}

