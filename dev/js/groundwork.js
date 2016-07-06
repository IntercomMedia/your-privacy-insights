
/*	======================================
	
	Grooundwork v1.0
	
	Copyright 2016 Groundwork Design Co.

========================================= */

var groundWork = (function(){
	
	//- - - - - - - - - - - - - - - - - - - - - - - -
	//	Extend the Global Enviornment
	//- - - - - - - - - - - - - - - - - - - - - - - -
	
	throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
            requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle("resize", "optimizedResize");  // Use: window.addEventListener('optimizedResize', {Function})
	throttle("scroll", "optimizedScroll");  // Use: window.addEventListener('optimizedSCroll', {Function})
	
	
	//- - - - - - - - - - - - - - - - - - - - - - - -
	//	Math
	//- - - - - - - - - - - - - - - - - - - - - - - -
	
	//t = current time
	//b = start value
	//c = change in value
	//d = duration
	
	
	Math.linearTween = function (t, b, c, d) {
		return c*t/d + b;
	};
		
	Math.easeInOutCirc = function (t, b, c, d) {
			if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
			return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	}
	
	Math.easeInOutQuart = function (t, b, c, d) {
		t /= d/2;
		if (t < 1) return c/2*t*t*t*t + b;
		t -= 2;
		return -c/2 * (t*t*t*t - 2) + b;
	}
	
	Math.easeInOutQuint = function (t, b, c, d) {
		t /= d/2;
		if (t < 1) return c/2*t*t*t*t*t + b;
		t -= 2;
		return c/2*(t*t*t*t*t + 2) + b;
	};
	
	Math.easeInOutExpo = function (t, b, c, d) {
		t /= d/2;
		if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
		t--;
		return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
	};

	
	//- - - - - - - - - - - - - - - - - - - - - - - -
	//	Initialize Ground Work Schema
	//- - - - - - - - - - - - - - - - - - - - - - - -
	
	var gw = {
		trackers : {},
		config : {},
		utils : {
			math : {},
			dom : {},
			events : {},
			fc : {},
		},
		animate : {},
		components : {},
		modules : {}
	};
	
	return gw;
	
})();