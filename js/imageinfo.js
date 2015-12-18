
function ImageInfo(img, position)
{
    Draggable.call(this);

    this.img = img;
    this.position = [position[0], position[1]];
}

ImageInfo.prototype = inherit([Draggable]);

ImageInfo.prototype.clickIn = function(screenloc, info)
{
    var canvasLoc = canvasToWorld(screenloc); // WAT?

    var cornerA = this.position;
    var cornerB = [
        this.position[0] + this.img.width,
        this.position[1] + this.img.height];

    return canvasLoc[0] - cornerA[0] > 0 &&
           canvasLoc[1] - cornerA[1] > 0 &&
           canvasLoc[0] - cornerB[0] < 0 &&
           canvasLoc[1] - cornerB[1] < 0;
}

ImageInfo.prototype.draw = function(ctx, info)
{
    var convert = info.convert;
    var corner = convert(matrix4.transformPoint2(info.matrix, this.position));
    var origin = convert(matrix4.transformPoint2(info.matrix, [0,0]));
    var right = convert(matrix4.transformPoint2(info.matrix, [1,0]));
    var up = convert(matrix4.transformPoint2(info.matrix, [0,1]));
    right = [right[0] - origin[0], right[1] - origin[1]];
    up = [up[0] - origin[0], up[1] - origin[1]];

    ctx.save();
    ctx.transform(
        right[0], right[1],
        up[0], up[1],
        corner[0], corner[1]);
    ctx.drawImage(this.img, 0, 0);
    ctx.restore();
}

