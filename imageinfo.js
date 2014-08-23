
function ImageInfo(img, position)
{
    this.img = img;
    this.position = [position[0], position[1]];
}

ImageInfo.prototype.draw = function(ctx, convert)
{
    var pc = convert(this.position);
    ctx.drawImage(this.img, pc[0], pc[1]);
}

