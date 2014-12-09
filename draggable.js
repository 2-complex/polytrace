

function inherit(class_list)
{
    var result = {};
    for( var i = 0; i < class_list.length; i++ )
    {
        var cl = class_list[i];
        for( foo in cl.prototype )
        {
            result[foo] = cl.prototype[foo];
        }
    }

    return result;
}

function Draggable()
{
    this.m = [];
    this.position = [0,0];
    this.dragDiff = [0,0];
}

Draggable.prototype.setPosition = function(x, y)
{
    this.position[0] = x;
    this.position[1] = y;
}

Draggable.prototype.startDrag = function(event)
{
    this.startingPosition = [this.position[0], this.position[1]];

    var v = canvasToWorld([event.offsetX, event.offsetY]);
    this.dragDiff[0] = this.position[0] - v[0];
    this.dragDiff[1] = this.position[1] - v[1];
}

Draggable.prototype.drag = function(event)
{
    var v = canvasToWorld([event.offsetX, event.offsetY]);
    this.position[0] = this.dragDiff[0] + v[0];
    this.position[1] = this.dragDiff[1] + v[1];
}

Draggable.prototype.finishDrag = function(event)
{
    this.drag(event);

    undoManager.push(
        Draggable.prototype.setPosition, this, this.startingPosition,
        Draggable.prototype.setPosition, this, [this.position[0], this.position[1]]);
}

