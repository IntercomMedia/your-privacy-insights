groundWork.modules.parallax = function(selector, options) {
	// - - - - - - - - - - - - - - - - - - -
	// Set defaults
	// - - - - - - - - - - - - - - - - - - - 
	
	var defaults = {
		intensity : 0.2
	};
	
	options = typeof options == 'object' ? options : defaults;
	options.intensity = options.intensity ? options.intensity : defaults.intensity;
	
	// - - - - - - - - - - - - - - - - - - -
	// Init
	// - - - - - - - - - - - - - - - - - - - 
	
	var elements = document.querySelectorAll(selector),
		els = [],
		winH = window.innerHeight,
		processed = false;
		
	function init(){
		els = [];
		winH = window.innerHeight;
		for(i=0; i < elements.length; i++){
			var el = elements[i];
			var top = groundWork.utils.dom.cumulativeOffset(el).top,
				center = top + el.offsetHeight/2,
				obj = {
					el : el,
					top : top,
					bottom : top + el.offsetHeight,
					center : center,
					height : el.offsetHeight,
					intensity : el.getAttribute('data-intensity') ? Number(el.getAttribute('data-intensity')) : options.intensity
				}
			els.push(obj);
		};
		processed = true;
	}
	
	
	
	function parallaxScroll() {
		if(processed == false) init();
		
	    var scrollLeft = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
	    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
	    for(i=0; i < els.length; i++) {
		    var el = els[i],
		    	offset = (scrollTop + winH/2) - el.center;
		    console.log(offset);
			el.el.style.transform = 'translateY(' + Number(offset * el.intensity) + 'px)';
		}
	}
	
	
	window.addEventListener('optimizedScroll', parallaxScroll);
	window.addEventListener('optimizedResize', init);
}