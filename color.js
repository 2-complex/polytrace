
function Color()
{
    if( arguments.length >=3 )
    {
        this.r = Math.max(Math.min(arguments[0],255),0);
        this.g = Math.max(Math.min(arguments[1],255),0);
        this.b = Math.max(Math.min(arguments[2],255),0);
        this.a = arguments[3] ? Math.max(Math.min(arguments[3],1.0),0.0) : 1.0;
    }
    else
    {
        this.r = arguments[0].r;
        this.g = arguments[0].g;
        this.b = arguments[0].b;
        this.a = arguments[0].a;
    }

}

Color.prototype.hex = function()
{
    return '#'+("0"+Math.floor(this.r).toString(16)).substr(-2)
        +("0"+Math.floor(this.g).toString(16)).substr(-2)
        +("0"+Math.floor(this.b).toString(16)).substr(-2);
}

Color.prototype.rgb = function()
{
    return "rgb("+this.r+","+this.g+","+this.b+")";
}

Color.prototype.rgba = function()
{
    return "rgba("+this.r+","+this.g+","+this.b+","+this.a+")";
}

Color.prototype.darken = function(multiplier)
{
    multiplier = multiplier || 0.5;
    return new Color(Math.floor(multiplier*this.r),Math.floor(multiplier*this.g),Math.floor(multiplier*this.b),this.a);
}

Color.prototype.desaturate = function(multiplier)
{

    multiplier = multiplier || 0.5;

    // convert to hsl
    var M = Math.max(this.r,this.g,this.b)/255;
    var m = Math.min(this.r,this.g,this.b)/255;
    var C = M-m;

    var h = Math.atan2(0.5*Math.sqrt(3)*(this.g-this.b),0.5*(2*this.r-this.g-this.b));
    if( h < 0 )
        h += 2*Math.PI;
    var l = 0.5*(M+m);
    var s = C==0 ? 0 : C/(1-Math.abs(2*l-1));

    // desaturate
    s *= multiplier;

    // convert back to rgb
    C = (1-Math.abs(2*l-1))*s;
    var Hprime = 3*h/Math.PI;
    var X = C*(1-Math.abs((Hprime%2)-1));

    var r1, g1, b1;
    if( Hprime < 1 ) {
        r1 = C; g1 = X; b1 = 0;
    } else if( Hprime < 2 ) {
        r1 = X; g1 = C; b1 = 0;
    } else if( Hprime < 3 ) {
        r1 = 0; g1 = C; b1 = X;
    } else if( Hprime < 4 ) {
        r1 = 0; g1 = X; b1 = C;
    } else if( Hprime < 5 ) {
        r1 = X; g1 = 0; b1 = C;
    } else {
        r1 = C; g1 = 0; b1 = X;
    }
    m = l - 0.5*C;

    this.r = (r1+m)*255;
    this.g = (g1+m)*255;
    this.b = (b1+m)*255;

}

Color.from_hsl = function(h,s,l)
{

    // convert back to rgb
    var C = (1-Math.abs(2*l-1))*s;
    var Hprime = 3*h/Math.PI;
    var X = C*(1-Math.abs((Hprime%2)-1));

    var r1, g1, b1;
    if( Hprime < 1 ) {
        r1 = C; g1 = X; b1 = 0;
    } else if( Hprime < 2 ) {
        r1 = X; g1 = C; b1 = 0;
    } else if( Hprime < 3 ) {
        r1 = 0; g1 = C; b1 = X;
    } else if( Hprime < 4 ) {
        r1 = 0; g1 = X; b1 = C;
    } else if( Hprime < 5 ) {
        r1 = X; g1 = 0; b1 = C;
    } else {
        r1 = C; g1 = 0; b1 = X;
    }
    var m = l - 0.5*C;

    return new Color((r1+m)*255,(g1+m)*255,(b1+m)*255)

}

