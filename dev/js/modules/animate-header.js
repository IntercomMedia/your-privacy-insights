//- //////////////////////////////////////////////////

//- // Header Scroll Animation

//- //////////////////////////////////////////////////

groundWork.modules.AnimateHeader = function AnimateHeader(id, options) {
	options = options ? options : {};

	if (options.scrollDownThreshold === undefined) {
		options.scrollDownThreshold = 0;
	}

	if (options.scrollUpThreshold === undefined) {
		options.scrollUpThreshold = 0;
	}
	
	if (options.scrollSpeed === undefined) {
		options.scrollSpeed = 1;
	}

	header = document.getElementById(id);
	
	if(!header) return null;
	
	headerHeight = header.offsetHeight;
	negHeaderHeight = (headerHeight * -1);

	var lastTransform = 0;
	var thisTransform = 0;
	var lastScrollY = 0;
	var scrollUpThreshold = options.scrollUpThreshold;
	var scrollDownThreshold = options.scrollDownThreshold;
	var scrollSpeed = options.scrollSpeed;
	var scrollUpTicker = [];
	var tickerSum = 0;

	// Scroll Animation

	function animateHeader(scrollY) {
		scrollDistance = (lastScrollY - scrollY);
		scrollingUp = (scrollDistance > 0);
		scrollingDown = (scrollDistance < 0);

		if (scrollingDown) {
			if (scrollY >= (scrollDownThreshold - (headerHeight / scrollSpeed))) {
				if(scrollDistance > 5) scrollDistance = 10;
				thisTransform = (scrollDistance * scrollSpeed) + lastTransform;
				thisTransform = thisTransform >= negHeaderHeight ? thisTransform : negHeaderHeight;
				header.style.transform = 'translateY(' + thisTransform + 'px)';
			}
			if (thisTransform <= (negHeaderHeight + 1)) {
				scrollUpTicker = [0];
			}

		} else if (scrollingUp) {
			scrollUpTicker.push(scrollDistance);
			for (i = 0; i < scrollUpTicker.length; i++) {
				tickerSum += scrollUpTicker[i];
			}
			if ((lastTransform + (scrollDistance * scrollSpeed)) >= 0) {
				header.style.transform = 'translateY(' + 0 + 'px)';
			} else if (tickerSum >= scrollUpThreshold || scrollY <= scrollDownThreshold || scrollY <= (headerHeight / scrollSpeed)) {
				thisTransform = lastTransform + (scrollDistance * scrollSpeed);
				header.style.transform = 'translateY(' + thisTransform + 'px)';
			}
		};

		lastScrollY = scrollY;
		lastTransform = thisTransform;
		tickerSum = 0;
	};

	// Instantiate

	var last_known_scroll_position = 0;
	var ticking = false;

	window.addEventListener('optimizedScroll', function(e) {
		last_known_scroll_position = window.scrollY;
			window.requestAnimationFrame(function() {
				animateHeader(last_known_scroll_position);
				ticking = false;
			});
		ticking = true;
	});
};