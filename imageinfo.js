
function ImageInfo(img, position)
{
    Draggable.call(this);

    this.img = img;
    this.position = [position[0], position[1]];
}

ImageInfo.prototype = inherit([Draggable]);

ImageInfo.prototype.draw = function(ctx, convert)
{
    var pc = convert(this.position);
    var pd = convert([
        this.position[0] + this.img.width,
        this.position[1] + this.img.height]);

    ctx.drawImage(this.img, pc[0], pc[1], pd[0] - pc[0], pd[1] - pc[1]);
}

