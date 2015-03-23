

var handleColor = "rgba(0, 255, 50, 1.0)";

function Handle(position)
{
    Draggable.call(this);
    this.position = position;
}

Handle.prototype = inherit([Draggable]);

Handle.RADIUS = 4;

Handle.prototype.clickIn = function(screenloc)
{
    var canvasLoc = worldToCanvas(this.position);

    var dx = screenloc[0] - canvasLoc[0];
    var dy = screenloc[1] - canvasLoc[1];

    return dx < Handle.RADIUS && dx > -Handle.RADIUS &&
           dy < Handle.RADIUS && dy > -Handle.RADIUS;
}

Handle.prototype.draw = function(ctx, info)
{
    var convert = info.convert;
    var v = convert(matrix4.transformPoint2(info.matrix, this.position));

    var x = v[0]
    var y = v[1];
    var w = Handle.RADIUS;
    var h = Handle.RADIUS;

    ctx.fillStyle = handleColor;
    ctx.strokeStyle = handleColor;
    ctx.strokeRect(x-w, y-w, 2*w, 2*h);
}

