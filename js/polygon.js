

var polygonStrokeColor = "rgba(0, 255, 50, 1.0)";
var bezierHandleColor = "rgba(0, 100, 100, 1.0)";

Polygon = function()
{
    this.vertices = [];
    this.handles = [];
    this.closed = false;
}

Polygon.prototype.drawSegment = function(convert, info, i)
{
    var n = this.vertices.length;

    var v = convert(matrix4.transformPoint2(info.matrix, this.vertices[(i+1)%n].center));
    var f = convert(matrix4.transformVector2(info.matrix, this.vertices[i].front));
    var b = convert(matrix4.transformVector2(info.matrix, this.vertices[(i+1)%n].back));
    ctx.bezierCurveTo(
        f[0], f[1],
        b[0], b[1],
        v[0], v[1]);
}

Polygon.prototype.draw = function(ctx, info)
{
    var convert = info.convert;

    if( this.vertices.length > 0 )
    {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.fillStyle = polygonStrokeColor;
        ctx.strokeStyle = polygonStrokeColor;

        var v = convert(matrix4.transformPoint2(info.matrix, this.vertices[0].center));
        ctx.moveTo(v[0], v[1]);

        // for ( var i = 0; i < this.vertices.length - (this.closed ? 0 : 1); i++ )
        for ( var i = 0; i < this.vertices.length - 1 ; i++ )
        {
            this.drawSegment(convert, info, i);
        }

        ctx.stroke();
    }

    for ( var i=0; i<this.handles.length; i++ )
    {
        this.handles[i].draw(ctx, info);
    }
}

Polygon.prototype.add = function(v)
{
    var newv = {
        center: [v[0], v[1]],
        front: [v[0], v[1]],
        back: [v[0], v[1]] };

    this.vertices.push(newv);

    this.handles.push(new Handle(newv.center));
    this.handles.push(new BezierHandle(newv.back, newv.center));
    this.handles.push(new BezierHandle(newv.front, newv.center));
}

Polygon.prototype.close = function()
{
    this.closed = true;
}

