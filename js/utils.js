// requestAnimationFrame and cancelAnimationFrame polyfill by Erik MÃ¶ller
// see: http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var v = 0; v < vendors.length && !window.requestAnimationFrame; v++) {
        window.requestAnimationFrame = window[vendors[v]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[v]+'CancelAnimationFrame'] || window[vendors[v]+'CancelRequestAnimationFrame'];
    }
    
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                                       timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };

    window.requestAnimationInterval = function(fn,ms) {
        
        var tick = -1000.0;
        var handle = {};
        
        var callback;
        callback = function(t) {
            handle.value = requestAnimationFrame(callback);            
            if( t-tick > ms ) {
                while( tick < t-ms )
                    tick += ms;
                fn(t);
            }            
        };
        
        handle.value = requestAnimationFrame(callback);
        
        return handle;
        
    };
    
    window.cancelAnimationInterval = function(handle) {
        cancelAnimationFrame(handle.value);        
    };
    
}());

