
function Node()
{
    Draggable.call(this);

    this.position = [0,0];
    this.rotation = 0;
    this.scaleFactor = 1;
    this.children = [];

    this.positionHandle = new Handle(this.position);
}

Node.prototype = inherit([Draggable]);

Node.prototype.getMatrix = function()
{
    return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
}

Node.prototype.add = function(drawable)
{
    this.children.push(drawable);
}

Node.prototype.remove = function(drawable)
{
    var index = this.children.indexOf(drawable);
    this.children.splice(index, 1);
}

Node.prototype.draw = function(ctx, info)
{
    this.positionHandle.draw(ctx, info);

    for( var i = 0; i < this.children.length; i++ )
    {
        this.children[i].draw(ctx, info);
    }
}

Node.prototype.getMatrix = function()
{
    var c = Math.cos(this.rotation);
    var s = Math.sin(this.rotation);
    return [
        [this.scaleFactor * c, this.scaleFactor * s, 0, 0],
        [-this.scaleFactor * s, this.scaleFactor * c, 0, 0],
        [0, 0, 1, 0],
        [this.position[0], this.position[1], 0, 1]
    ];
}

Node.prototype.zoom = function(factor)
{
    this.scaleFactor *= factor;
    if( this.scaleFactor > 10.0 )
    {
        this.scaleFactor = 10.0;
    }
    if( this.scaleFactor < 1.0 / 10.0 )
    {
        this.scaleFactor = 1.0 / 10.0;
    }
}

Node.prototype.rotate = function(theta)
{
    this.rotation += theta;
}

Node.prototype.getDraggables = function()
{
    return [this.positionHandle];
}

Node.prototype.setPosition = function(x, y)
{
    this.position[0] = x;
    this.position[1] = y;
}

Node.prototype.startDrag = function(event)
{
    this.startingPosition = [this.position[0], this.position[1]];

    var v = canvasToWorld([event.offsetX, event.offsetY]);
    this.dragDiff[0] = this.position[0] - v[0];
    this.dragDiff[1] = this.position[1] - v[1];
}

Node.prototype.drag = function(event)
{
    var v = canvasToWorld([event.offsetX, event.offsetY]);
    this.position[0] = this.dragDiff[0] + v[0];
    this.position[1] = this.dragDiff[1] + v[1];
}

Node.prototype.finishDrag = function(event)
{
    this.drag(event);

    undoManager.push(
        Node.prototype.setPosition, this, this.startingPosition,
        Node.prototype.setPosition, this, [this.position[0], this.position[1]]);
}

