//- //////////////////////////////////////////////////

//- // Color Scroll Animation

//- //////////////////////////////////////////////////

groundWork.modules.AnimateColor = function AnimateColor(selector, options) {
	
	options = options ? options : {};

	options.animationRatio = options.animationRatio ? options.animationRatio : 1;
	options.margin = options.margin ? options.margin : 200;
	
	var winH = window.innerHeight,
		processed = false,
		elements = document.querySelectorAll(selector);
	
	this.els = [];
	
	function init(){
		this.els = [];
		for(i=0; i < elements.length; i++){
			var el = elements[i];
			el.style.backgroundColor = '';
			var top = groundWork.utils.dom.cumulativeOffset(el).top,
				center = top + el.offsetHeight/2,
				bg_color = getComputedStyle(el).getPropertyValue("background-color");
				var rgba =  bg_color.split("(")[1].split(")")[0].split(","),
				hsla = rgbaToHsla(rgba[0], rgba[1], rgba[2], rgba[3]);
			var obj = {
				el : el,
				top : top,
				bottom : top + el.offsetHeight,
				center : center,
				height : el.offsetHeight,
				hsla : hsla,
				margin : el.getAttribute('data-offset') ? Number(el.getAttribute('data-offset')) : options.margin
			}
			console.log(top, window.scrollY);
			this.els.push(obj);
			processed = true;
		};
	}
	
	function animateColor() {
		var scrollY = window.scrollY;
		if(!processed) init();
		for (i = 0; i < this.els.length; i++) {
			var el = this.els[i];
			if(scrollY > el.top - winH && scrollY < el.bottom){
				var center_win = scrollY + winH/2,
					change = (Math.abs(el.center - center_win)  - el.margin) / (winH - el.height/2 - el.margin/2);
					console.log(groundWork.utils.dom.cumulativeOffset(el.el).top);
				change = change < 0 ? 0 : change;
				var h_offset = options.hue ? options.hue * change : 0,
					s_offset = options.saturation ? options.saturation * change : 0,
					l_offset = options.lightness ? options.lightness * change: -el.hsla[2] * change;
					
				var	H = el.hsla[0] + h_offset,
					S = el.hsla[1] + s_offset,
					L = el.hsla[2] + l_offset,
					A = el.hsla[3],
					dynamic_hsla = "hsla(" + H +", " + S + "%, " + L + "%, " + A + ")";
					
				el.el.style.backgroundColor = dynamic_hsla;
				console.log(L,(el.hsla[2]) * change,  change);
				if(typeof options.callback == 'function') options.callback(el.el, change);
				
			}
		}
	}
	
	var animateColor = animateColor.bind(this);
	var init = init.bind(this);
	
	// RGBA To HSLA Color Conversion
	
	function rgbaToHsla(r, g, b, a){
		r /= 255, g /= 255, b /= 255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;

		if(max == min) {
			h = s = 0; // achromatic
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch(max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}
		h = h * 360;
		s = s * 100;
		l = l * 100;
		if (a === undefined) {
			var a = 1;
		}
		return [h, s, l, a];
	};
	
	window.addEventListener('optimizedScroll', animateColor);
	window.addEventListener('optimizedResize', init);
	
};