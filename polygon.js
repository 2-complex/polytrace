

function Polygon()
{
    this.vertices = [];
    this.closed = false;
}

Polygon.prototype.draw = function()
{
    for ( var i=0; i<this.vertices.length; i++ )
    {
        var x = this.vertices[i][0];
        var y = this.vertices[i][1];
        var w = 4;
        var h = 4;
        CTX.fillStyle = polygonStrokeColor;
        CTX.strokeStyle = polygonStrokeColor;
        CTX.strokeRect(x-w, y-w, 2*w, 2*h);
    }

    if( this.vertices.length > 0 )
    {
        CTX.beginPath();

        CTX.lineWidth = 2;
        CTX.strokeStyle = polygonStrokeColor;

        var x = this.vertices[0][0];
        var y = this.vertices[0][1];
        CTX.moveTo(x, y);

        for ( var i=1; i<this.vertices.length; i++ )
        {
            var x = this.vertices[i][0];
            var y = this.vertices[i][1];
            CTX.lineTo(x, y);
        }

        if( this.closed )
        {
            var x = this.vertices[0][0];
            var y = this.vertices[0][1];
            CTX.lineTo(x, y);
        }

        CTX.stroke();
    }
}

Polygon.prototype.close = function()
{
    this.closed = true;
}
