

function Polygon()
{
    this.vertices = [];
    this.closed = false;
}

Polygon.prototype.draw = function(ctx)
{
    for ( var i=0; i<this.vertices.length; i++ )
    {
        var x = this.vertices[i][0];
        var y = this.vertices[i][1];
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

        var x = this.vertices[0][0];
        var y = this.vertices[0][1];
        ctx.moveTo(x, y);

        for ( var i=1; i<this.vertices.length; i++ )
        {
            var x = this.vertices[i][0];
            var y = this.vertices[i][1];
            ctx.lineTo(x, y);
        }

        if( this.closed )
        {
            var x = this.vertices[0][0];
            var y = this.vertices[0][1];
            ctx.lineTo(x, y);
        }

        ctx.stroke();
    }
}

Polygon.prototype.close = function()
{
    this.closed = true;
}
