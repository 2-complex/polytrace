
var bezierHandleColor = "rgba(0, 100, 100, 1.0)";

function BezierHandle(position, center)
{
    Draggable.call(this);
    this.position = position;
    this.center = center;
}

BezierHandle.prototype = inherit([Draggable]);

BezierHandle.RADIUS = 4;

BezierHandle.prototype.clickIn = function(screenloc)
{
    var canvasLoc = worldToCanvas(this.position);

    var dx = screenloc[0] - canvasLoc[0];
    var dy = screenloc[1] - canvasLoc[1];

    return dx < BezierHandle.RADIUS && dx > -BezierHandle.RADIUS &&
           dy < BezierHandle.RADIUS && dy > -BezierHandle.RADIUS;
}

BezierHandle.prototype.draw = function(ctx, info)
{
    var convert = info.convert;
    var v = convert(matrix4.transformPoint2(info.matrix, this.position));
    var c = convert(matrix4.transformPoint2(info.matrix, this.center));

    var x = v[0]
    var y = v[1];
    var w = BezierHandle.RADIUS;
    var h = BezierHandle.RADIUS;

    ctx.fillStyle = bezierHandleColor;

    ctx.strokeStyle = bezierHandleColor;
    ctx.strokeRect(x-w, y-w, 2*w, 2*h);

    ctx.beginPath();
    ctx.strokeStyle = bezierHandleColor;
    ctx.moveTo(c[0], c[1]);
    ctx.lineTo(v[0], v[1]);
    ctx.stroke();
}

