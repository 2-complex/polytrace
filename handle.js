
function Handle(position)
{
    Draggable.call(this);

    this.position = position;
}

Handle.prototype = inherit([Draggable]);

Handle.HANDLE_RADIUS = 4;

Handle.prototype.clickIn = function(screenloc)
{
    var canvasLoc = worldToCanvas(this.position);

    var dx = screenloc[0] - canvasLoc[0];
    var dy = screenloc[1] - canvasLoc[1];

    return dx < Handle.HANDLE_RADIUS && dx > -Handle.HANDLE_RADIUS &&
           dy < Handle.HANDLE_RADIUS && dy > -Handle.HANDLE_RADIUS;
}

