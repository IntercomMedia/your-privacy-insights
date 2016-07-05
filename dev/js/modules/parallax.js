groundWork.modules.parallax = function(selector) {
	var self = this;
	
	window.addEventListener('optimizedScroll', parallaxScroll);
	
	function parallaxScroll() {
	    var scrollLeft = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
	    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
	    var items = document.querySelectorAll(selector);
	    for(i=0; i < items.length; i++) {
				items[i].style.transform = 'translateY(' + (scrollTop * 0.2) + 'px)';
			}
	}
}