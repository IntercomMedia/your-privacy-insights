/*	======================================

		Scroll Hash v1
		
		options :
			navigation 	: String, default ".tab-nav", the selector for the navigation ul element.
			next		: String, default ".tab-next", Selctor for the next button.
			prev		: String, default ".tab-prev", Selctor for the prev button.
		
		methods :
			Tabs.next()
			Tabs.prev()
		datasets :
			data-url : If provided, url content will be loaded into tab when first activated

========================================== */

groundWork.modules.scrollHash = function(selector, speed){
	
	speed = speed || 600;
	// - - - - - - - - - - - - - - - - - - - -
	// Create Handlers
	// - - - - - - - - - - - - - - - - - - - -
	
	function scrollHandler(e) {
		e.preventDefault();
		console.log(e);
		var target = document.querySelector(e.target.getAttribute('href'));
		if(target) {
			history.pushState(e.target.getAttribute('href'), "page 2", e.target.getAttribute('href'));
			groundWork.animate.scrollToCenterOfEl(target, speed);
		}
	}
	
	// - - - - - - - - - - - - - - - - - - - -
	// Add handlers
	// - - - - - - - - - - - - - - - - - - - -
	
	groundWork.listenerManager.bind([selector, function(el) { el.addEventListener('click', scrollHandler)}]);
	
};