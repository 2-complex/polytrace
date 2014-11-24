
function ImageInfo(img, position)
{
    Draggable.call(this);

    this.img = img;
    this.position = [position[0], position[1]];
}

ImageInfo.prototype = inherit([Draggable]);

ImageInfo.prototype.clickIn = function(screenloc)
{
    var canvasLoc = canvasToWorld(screenloc);

    var cornerA = this.position;
    var cornerB = [
        this.position[0] + this.img.width,
        this.position[1] + this.img.height];

    return canvasLoc[0] - cornerA[0] > 0 &&
           canvasLoc[1] - cornerA[1] > 0 &&
           canvasLoc[0] - cornerB[0] < 0 &&
           canvasLoc[1] - cornerB[1] < 0;
}

ImageInfo.prototype.draw = function(ctx, convert)
{
    var pc = convert(this.position);
    var pd = convert([
        this.position[0] + this.img.width,
        this.position[1] + this.img.height]);

    ctx.drawImage(this.img, pc[0], pc[1], pd[0] - pc[0], pd[1] - pc[1]);
}

