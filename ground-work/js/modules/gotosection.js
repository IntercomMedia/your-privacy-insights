/* ===========================================
		
		Go to Section
		
=============================================*/

groundWork.modules.GoToSection = function(selector, options){
	var options = {
			container : (options.container ? options.container : document.documentElement || document.body),
			scrolljack : false,
			animate : false, // darken, lighten, custom function
			speed : 1000
		},
		self = this,
		state = -1,
		break_scroll = false,
		click_scroll = false,
		delta 			= 0,
		last_scroll = 0,
		last_delta = 0,
		last_delta_dist = 0,
		scroll_jack = false,
		killTimer = [],
		hideTimer,
		scrollTimer,
		dom = groundWork.utils.dom;
	
	var selector = selector ? selector : '[data-title]';
	
	function scrollTo(tada, to, duration, callback) {
			break_scroll=false;
			clearTimeout(scrollTimer);
	    var start = options.container.scrollTop;
	        change = to - start,
	        currentTime = 0,
	        increment = 20;
	        
	    var animateScroll = function(){        
	        currentTime += increment;
	        var val = Math.easeInOutCirc(currentTime, start, change, duration);
	        options.container.scrollTop = val;
	        if(currentTime < duration && break_scroll==false) {
	            scrollTimer = setTimeout(animateScroll, increment);
	        }
	        else{
		        if (callback) callback();
	        }
	    };
	    animateScroll();
	}
	
	function createTriggers(els) {
		var trigger_array = new Array();
		forEach(els, function(el, index){
			var eloffsetTop = dom.cumulativeOffset(el),
					el_title = el.getAttribute('data-title');
			trigger_array.push({top: eloffsetTop.top, height: el.offsetHeight, title: el_title});
		});
		return trigger_array
	}
	
	function createDots(els){
		var trigger_array = new Array();
		forEach(els, function(el, index){
			var eloffsetTop = dom.cumulativeOffset(el),
				el_title = el.getAttribute('data-title');
			trigger_array.push({top: eloffsetTop.top, height: el.offsetHeight, title: el_title});
			self.list_items[index] = document.createElement('li');
			self.list_items[index].innerHTML = '<a href="#' + el.getAttribute('id') + '"></a><span class="tooltip">'+ el_title +'<span>';
			
			self.list_items[index].addEventListener('click', function(event){
				event.preventDefault();
				var target = event.currentTarget.querySelector('a').getAttribute('href');
				target = document.querySelector(target);
				var offset = dom.cumulativeOffset(target);
				var headerHeight = document.querySelector('.js-header');
				click_scroll = true;
				scrollTo(options.container, offset.top - headerHeight.offsetHeight, 500, function(){
					click_scroll = false;
				});
			});
			
			self.list_items[index].addEventListener('mouseover', function(event){
				dom.removeClass(self.last_item, 'show-title');
			});
			
			self.nav_ul.appendChild(self.list_items[index]);
		});
		if(trigger_array.length > 0) {
			options.container.appendChild(self.nav);
		}
		
		return trigger_array;
	};
	
	// Public
	this.nav = document.createElement('div');
	dom.addClass(this.nav, 'dot-nav');
	this.nav_ul = document.createElement('ul');
	this.nav.appendChild(this.nav_ul);
	this.list_items = [];
	this.last_item = false;
	this.winH = window.innerHeight;
	this.sections = document.querySelectorAll(selector);
	this.triggers = createDots(this.sections);
	
	this.next = function(){
		if(state < self.triggers.length - 1) {
			state ++;
			click_scroll = true;
			scrollTo(options.container, self.triggers[state][0], 500, function(){
				click_scroll = false;
			});
		}else {
			state = self.triggers.length;
			scroll_jack = false;
		}
	};
	
	this.prev = function(){
		if(state > 0) {
			state --;
			click_scroll = true;
			scrollTo(options.container, self.triggers[state][0], 500, function(){
				click_scroll = false;
			});
		}
		else {
			state = -1;
			scroll_jack = false;
		}
	};
		
	function init(){
		options.container.addEventListener('optimizedScroll', function(event){
			var scrollPos = window.scrollY;
			if(scrollPos > self.winH/6) {
				dom.addClass(self.nav, 'is-open');
			}
			else {
				dom.removeClass(self.nav, 'is-open');
				if(self.last_item) {
					dom.removeClass(self.last_item, 'is-active');
				}
			}
			
			clearTimeout(hideTimer);
			
			hideTimer = window.setTimeout(function(){
				dom.removeClass(self.nav, 'is-open');
			}, 1610);
			
			self.triggers.forEach(function(el, index){
				if(scrollPos > el[0] - (self.winH/2) && scrollPos < el[0] + (self.winH/2)){
					if(state == -1 && index == 0 && delta < 0){
						last_delta =0;
						scroll_jack = true;
					}else if (self.last_item !== self.list_items[index]) {
						scroll_jack = true;
						clearTimeout(killTimer[index]);
						if (self.last_item){ 
							dom.removeClass(self.last_item, 'is-active');
						}
						
						dom.addClass(self.list_items[index], 'is-active');

						self.last_item = self.list_items[index];
						state = index;
					}
				}
			});
		});
		
		if (options.scrolljack) {
			options.container.addEventListener("wheel", MouseWheelHandler, false);
		}
		options.container.addEventListener("keydown", keydownHandler);
		window.addEventListener("optimizedResize", resize);

		
		function MouseWheelHandler(event) {
			delta = Math.max(-1, Math.min(1, -event.deltaY));
			if(event.deltaY !== 0 && scroll_jack == true){
				event.preventDefault();
				
				if(Math.abs(event.deltaX) < 2 ) {
									
					if(last_scroll !== delta && click_scroll == true && last_scroll !== 0) {
						break_scroll = true;
					}
					
					if(click_scroll === false &&  Math.abs(event.deltaY) - last_delta > 0) {
						if (delta > 0) {
							self.prev();
						}
						else {
							self.next();
						}
					}
					
					last_scroll = delta;
					last_delta_dist = Math.abs(event.deltaY)-last_delta;
					last_delta = Math.abs(event.deltaY);
				}
			}
		}
			
		function keydownHandler(event){	
	    if (event.keyCode == '38') {
		    break_scroll = true;
		    event.preventDefault();
		    self.prev();
	    }
	    else if (event.keyCode == '40') {
		    break_scroll = true;
	      event.preventDefault();
	      self.next();
	    }
		}
		
		function resize(){
			self.triggers = createTriggers(self.sections);
			self.winH = window.innerHeight;
		}		
	}
	
	if(this.triggers.length > 0) init();
}
