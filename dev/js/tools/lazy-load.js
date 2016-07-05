groundWork.lazyLoad = (function(){
	var dom = groundWork.utils.dom;
	
	var lazyLoad = function(selector, options) {
		var els = document.querySelectorAll("img[data-src]");
		// load images that have entered the viewport
		[].forEach.call(els, function (item) {
			if (dom.isElementInViewport(item)) {
				console.log('Lazied');
				item.setAttribute("src",item.getAttribute("data-src"));
				item.removeAttribute("data-src");  
				dom.addClass(item.parentNode, 'loading');
				window.setTimeout(function(){
					dom.removeClass(item.parentNode, 'loading');
					dom.addClass(item.parentNode, 'loaded');
				}, 300);
			}
		});
		
		// if all the images are loaded, stop calling the handler
		if (els.length == 0) {
			window.removeEventListener("DOMContentLoaded", lazyLoad);
			window.removeEventListener("load", lazyLoad);
			window.removeEventListener("optimizedResize", lazyLoad);
			window.removeEventListener("optimizedScroll", lazyLoad);
		}
	}
	
	if(groundWork.config.lazy_load == true) {
		window.removeEventListener("DOMContentLoaded", lazyLoad);
		window.removeEventListener("load", lazyLoad);
		window.removeEventListener("optimizedResize", lazyLoad);
		window.removeEventListener("optimizedScroll", lazyLoad);
	}
	
	return lazyLoad;
})();