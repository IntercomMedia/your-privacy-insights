//- //////////////////////////////////////////////////

//- // Color Scroll Animation

//- //////////////////////////////////////////////////

groundWork.modules.AnimateColor = function AnimateColor(selector, options) {
	
	options = options ? options : {};

	options.animationRatio = options.animationRatio ? options.animationRatio : 1;
	options.threshhold = options.threshhold ? options.threshhold : 200;
	
	var winH = window.innerHeight,
		processed = false,
		elements = document.querySelectorAll(selector),
		last_scroll = 0;
	
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
				threshhold : el.getAttribute('data-threshhold') ? Number(el.getAttribute('data-threshhold')) : options.threshhold
			}
			this.els.push(obj);
		};
		processed = true;
	}
	
	function animateColor() {
		var scrollY = window.scrollY;
		if(!processed) init();
		for (i = 0; i < this.els.length; i++) {
			var el = this.els[i];
			if(scrollY > el.top - winH && scrollY < el.bottom){
				var center_win = scrollY + winH/2,
					start_mod = el.top - winH,
					current_time = scrollY - start_mod,
					start = 0,
					to = 1,
					duration =  winH/2 + el.height/2 - el.threshhold/2,
					dif = duration - current_time;
					
					if(dif < 0 && dif > - el.threshhold) {
						current_time = current_time + dif;
					}else if(dif < - el.threshhold) {
						current_time = current_time - duration - el.threshhold;
						start = 1;
						to = 2;
					}
				var change = Math.linearTween(current_time, start, to, duration);
					
				var h_offset = options.hue ? options.hue - (options.hue * change) : 0,
					s_offset = options.saturation ? options.saturation - (options.saturation * change) : 0,
					l_offset = options.lightness ? options.lightness - (options.lightness * change) : -el.hsla[2] - (-el.hsla[2] * change);
					
				var	H = el.hsla[0] + h_offset,
					S = el.hsla[1] + s_offset,
					L = el.hsla[2] + l_offset,
					A = el.hsla[3],
					dynamic_hsla = "hsla(" + H +", " + S + "%, " + L + "%, " + A + ")";
				el.el.style.backgroundColor = dynamic_hsla;
				if(typeof options.callback == 'function') options.callback(el.el, change);
				if(typeof options.in == 'function' && change <= 1) options.in(el.el, change);
				else if(typeof options.out == 'function' && change > 1) options.out(el.el, change - 1);
				
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