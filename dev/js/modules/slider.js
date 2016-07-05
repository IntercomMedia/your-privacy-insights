/*	======================================

	Slider Constructor

========================================== */


groundWork.modules.ContentSlider = function(id, options){
	
	if(!document.getElementById(id)) return null;
	
	// -------------------------
	// Cache GroundWork Methods
	// -------------------------
	
	var addClass = groundWork.utils.dom.addClass;
	var removeClass = groundWork.utils.dom.removeClass;
	var lazyLoad = groundWork.lazyLoad;
	
	
	// -------------------------
	// Options
	// -------------------------
	
	options = options ? options : {};
	
	if (options.slidesShown === undefined) {
	    options.slidesShown = 2;
	}
	
	if (options.slidesScroll === undefined) {
		options.slidesScroll = 1;
	}
	
	if (options.mobileShown === undefined) {
		options.mobileShown = 1;
	}
	
	if (options.navigation === undefined) {
		options.navigation = true;
	}
	if (options.style === undefined) {
		options.style = 'default';
	}
	
	if (options.auto === undefined) {
		options.auto = false;
	}
	
	if (options.prev === undefined) {
		options.prev = false;
	}
	
	if (options.next === undefined) {
		options.next = false;
	}
	
	if (options.customNav === undefined) {
		options.customNav = false;
	}
	
	// -------------------------
	// Private Variables
	// -------------------------
	
	var self = this,
			orig_slidesShown = options.slidesShown,
			orig_slidesScroll = options.slidesScroll,
			current_slide = 0,
			last_slide = 0,
			click_scroll = false,
			break_scroll = false,
			last_scroll = 0,
			last_delta = 0,
			last_delta_dist = 0,
			over_slider = false,
			swipedir,
	    touchX,
	    touchY,
	    distX,
	    distY,
	    auto_timer,
	    scroll_timer;
	
	// -------------------------
	// Public Properties
	// -------------------------
	
	this.target = document.getElementById(id);
	this.parent = this.target.parentNode;
	this.children = this.target.querySelectorAll('.slide');
	this.counter = this.parent.querySelector('.counter');
	this.elwidth = this.target.offsetWidth;
	this.markers = [];


	if(this.children.length > 1) {
		
		// -------------------------
		// Initialize Slider
		// -------------------------
		
		(this.init = function(){
			self.target.querySelector('.content-slider-inner').style.width = (self.children.length * 100)/options.slidesShown + '%';
			
			
			if(options.navigation == true && !self.nav) {
				self.nav = document.createElement('div');
				addClass(self.nav, 'navi-arrows ' + 'navi-' + options.style);
				
				// Buttons
				self.next_button = document.createElement('button');
				self.prev_button = document.createElement('button');
				
				addClass(self.next_button, 'btn-circle-small');
				addClass(self.prev_button, 'btn-circle-small');
				self.next_button.innerHTML = '<i class="icon"></i>';
				self.prev_button.innerHTML = '<i class="icon"></i>';
				
				self.next_button.addEventListener('click', function(event) {
					self.next();
				});
				
				self.prev_button.addEventListener('click',  function(event) {
					self.prev();
				});
				
				// Counter Markers
				self.place_container = document.createElement('div');
				addClass(self.place_container, 'place-container');
				
				self.place_nav = document.createElement('ul');
				addClass(self.place_nav, 'place-nav');
				
				self.place_container.appendChild(self.place_nav);
				
				if(options.style == 'default'){
					self.counter = document.createElement('div');
					addClass(self.counter, 'counter');
					self.counter.innerHTML = 1;
					self.place_container.appendChild(self.counter);
				}
				
				// Create li numberd for each slide
				for(i=0; i < self.children.length / options.slidesScroll; i++) {
					if(i <= self.children.length - options.slidesShown){ 
						self.markers[i] = document.createElement('li');
						self.markers[i].innerHTML = '<a href="#"> ' + Number(i + 1) + '</a>';
						self.markers[i].setAttribute('data-slide', i);
						self.markers[i].addEventListener('click', function(event){
							var slide = Number(event.currentTarget.getAttribute('data-slide'));
							event.preventDefault();
							self.goTo(slide * options.slidesScroll);
						});
						self.place_nav.appendChild(self.markers[i]);
					}
				}
				
				addClass(self.place_nav, 'place-nav');
				
				// Compile nav and place below target slider
				self.nav.appendChild(self.prev_button);
				self.nav.appendChild(self.place_container);
				self.nav.appendChild(self.next_button);
				self.parent.appendChild(self.nav);
				
			}
		})();
		
		// -------------------------
		// Core Methods
		// -------------------------
		
		this.activate = function(speed){
			var speed = speed || 300;
			var scrollTo = self.children[current_slide].offsetLeft;
			
			// Set classes for Active Slides
			for (i=0; i < options.slidesShown ; i ++) {
					if(self.children[current_slide + i]){
						removeClass(self.children[current_slide + i], 'is-back');
						addClass(self.children[current_slide + i], 'is-active-slide');
					}
			}
			
			// Set the markers
			if(options.navigation) {
				if(self.markers[current_slide/options.slidesScroll] && self.markers[last_slide]) {
					addClass(self.markers[current_slide/options.slidesScroll], 'is-active');
					removeClass(self.markers[last_slide], 'is-active');
				}
			}
			
			//Scroll Slider
			self.scrollTo(scrollTo, 400, function(){
					click_scroll = false;
			});
			last_slide = current_slide/options.slidesScroll;
			
			
			
			if(options.navigation && current_slide + 1 > self.children.length - options.slidesShown) {
				self.next_button.setAttribute('disabled', 'disabled');
			}
			else if (options.navigation){
				self.next_button.removeAttribute('disabled');
			}
			
			if(options.navigation && current_slide == 0) {
				self.prev_button.setAttribute('disabled', 'disabled');
			}else if(options.navigation){
				self.prev_button.removeAttribute('disabled');
			}
			
			if(self.counter) self.counter.innerHTML = Math.ceil(current_slide/options.slidesScroll + 1);
		}
		
		this.scrollTo = function(to, duration, callback) {
		    if(options.auto) {
			    window.clearTimeout(auto_timer);
		    }
		    break_scroll = false;
		    clearTimeout(scroll_timer);
		    var element = self.target;
		    var start = element.scrollLeft,
		        change = to - start,
		        currentTime = 0,
		        increment = 20;
		        
		    var animateScroll = function(){      
		        currentTime += increment;
		        var val = Math.easeInOutCirc(currentTime, start, change, duration);
		        element.scrollLeft = val;
		        if(currentTime < duration && break_scroll === false) {
		            scroll_timer = setTimeout(animateScroll, increment);
		        }
		        else{
			        if (callback) {
				        callback();
				    }
		        }
		    	lazyLoad();
		    };
			animateScroll();
			
			if(options.auto) {
				autoSlide(options.auto);
		    }
		}
		
		this.next = function(speed){
			if(current_slide + options.slidesScroll < self.children.length - options.slidesShown) {
				click_scroll = true;
				current_slide = current_slide + options.slidesScroll;
				
				for (i=1; i < options.slidesScroll + 1 ; i ++) {
					removeClass(self.children[current_slide - i], 'is-active-slide');
					removeClass(self.children[current_slide - i], 'in-back');
					addClass(self.children[current_slide - i], 'is-back');
				}
				
				self.activate(speed);
			}else {
				current_slide = current_slide + (self.children.length - options.slidesShown - current_slide);
				click_scroll = true;
				for (i=1; i < options.slidesScroll + 1 ; i ++) {
					if(self.children[current_slide - i]) {
						removeClass(self.children[current_slide - i], 'is-active-slide');
						removeClass(self.children[current_slide - i], 'in-back');
						addClass(self.children[current_slide - i], 'is-back');
					}
				}
				self.activate(speed);
			}
		};
		
		this.prev = function(speed){
			if(current_slide >= options.slidesScroll && current_slide % options.slidesScroll == 0) {
				click_scroll = true;
				if(options.navigation) self.next_button.removeAttribute('disabled');
				for (i=0; i < options.slidesShown ; i ++) {
					if(self.children[current_slide + i]) {
						removeClass(self.children[current_slide + i], 'is-active-slide');
					}
				}
				current_slide = current_slide - options.slidesScroll;
				addClass(self.children[current_slide], 'in-back');
				
				self.activate(speed);
			}
			else {
				click_scroll = true;
				if(options.navigation) self.next_button.removeAttribute('disabled');
				for (i=0; i < options.slidesShown ; i ++) {
					if(self.children[current_slide + i]){
						removeClass(self.children[current_slide + i], 'is-active-slide');
					}
				}
				addClass(self.children[current_slide], 'in-back');
				
				current_slide = current_slide - (current_slide % options.slidesScroll);
				self.activate(speed);
			}
		};
		
		this.goTo = function(slide){
				click_scroll = true;
				for (i=0; i < options.slidesShown ; i ++) {
					if(self.children[current_slide + i]) {
						removeClass(self.children[current_slide + i], 'is-active-slide');
					}
				}
				current_slide = slide;
				
				self.activate();
		};
		
		// -------------------------
		// Auto slide option
		// -------------------------
		
		if(options.auto) {
			autoSlide(options.auto);
			self.target.addEventListener('mouseover', function(){
				window.clearTimeout(auto_timer);
			});
			self.target.addEventListener('mouseleave', function(){
				autoSlide(options.auto);
			});
			if(options.navigation == true) {
				self.nav.addEventListener('mouseover', function(){
					window.clearTimeout(auto_timer);
				});
				self.nav.addEventListener('mouseleave', function(){
				  autoSlide(options.auto);
				});
			}
		}
		
		function autoSlide(time) {
			window.clearTimeout(auto_timer);
			auto_timer = window.setTimeout(function(){
			  if(current_slide + options.slidesScroll < self.children.length){
				 self.next();
			  }else{
				 self.goTo(0); 
			  }
			  autoSlide(time);
			}, time);
		}
	 
		// -------------------------
		// Next button slide option
		// -------------------------
		
		if(options.next) {
		  var next_element = document.querySelector(options.next);
		  if(next_element) next_element.addEventListener('click', self.next);
		}
		
		// -------------------------
		// Prev button slide option
		// -------------------------
		if(options.prev) {
				var prev_element = document.querySelector(options.prev);
				if(prev_element) prev_element.addEventListener('click', self.prev);;
		}
		
		// -------------------------
		// Custom nav option
		// -------------------------
		
		if(options.customNav) {
		  var nav_items = document.querySelectorAll(options.customNav +' [data-slide-to]');
		  forEach(nav_items, function(element){
			  element.addEventListener('click', customNavigation);
		  });
		}
		// Function for custom nav button clicks
		function customNavigation(event){
			var element = document.querySelector(event.dataset.slideTo);
			if(element) {
				slide = element.dataset.slide ? Number(slide.dataset.slide) : false;
				if(slide) self.goTo(slide); 
			}
		}
		
		//---------------------------------
		// Resize
		//---------------------------------
		
		window.addEventListener("optimizedResize", self.resize);
		
		(this.resize = function(){
			var winW = window.innerWidth;
			if(winW < 724) {
				options.slidesShown = options.mobileShown;
				options.slidesScroll = 1;
				self.init();
				self.target.querySelector('.content-slider-inner').style.width = (self.children.length * 100)/options.slidesShown + '%';
			}
			else{
				options.slidesShown = orig_slidesShown;
				options.slidesScroll = orig_slidesScroll;
				self.init();
				self.target.querySelector('.content-slider-inner').style.width = (self.children.length * 100)/options.slidesShown + '%';
			}
			break_scroll = true;
			self.activate();
		})();
		
		//---------------------------------
		// Keyboard
		//---------------------------------
		
		document.addEventListener("keydown", keydownHandler);
		
		function keydownHandler(event){		
			if(over_slider == true) {
			    if (event.keyCode == '37') {
				    self.prev();
			    }
			    else if (event.keyCode == '39') {
			        self.next();
		    	}
	    	}
		}
		
		//---------------------------------
		// Mouse handlers
		//---------------------------------
		
		this.parent.addEventListener('mouseover', function(){
			over_slider = true;
		});
		this.parent.addEventListener('mouseleave', function(){
			over_slider = false;
		});
		
		this.parent.addEventListener("wheel", MouseWheelHandler, false);
		
		function MouseWheelHandler(event) {
			var deltaX = event.wheelDeltaX ? event.wheelDeltaX * -1 : event.deltaX;
			var deltaY = event.wheelDeltaY ? event.wheelDeltaY * -1: event.deltaY;
			if(Math.abs(deltaX) - Math.abs(deltaY) > 0){
				event.preventDefault();
				
				var delta = Math.max(-1, Math.min(1, -deltaX));
				
				if(last_scroll !== delta && click_scroll == true && last_scroll !== 0) {
					break_scroll = true;
				}
				
				if(click_scroll === false && (Math.abs(deltaX)-last_delta) > 0) {
					if (delta > 0) {
						self.prev();
					}
					else {
						self.next();
					}
				}
				
				last_scroll = delta;
				last_delta_dist = Math.abs(deltaX - last_delta);
				last_delta = Math.abs(deltaX);
			}
			if(click_scroll == true) {
				event.preventDefault();
			}
		}
		
		
		//---------------------------------
		// Touch handlers
		//---------------------------------
		
		self.parent.addEventListener('touchstart', function(e){
	    	var touchobj = e.changedTouches[0];
			swipedir = 'none';
			dist = 0;
			touchX = touchobj.screenX;
			touchY = touchobj.screenY;
		}, false);
	
		self.parent.addEventListener('touchmove', function(e){
		var touchobj = e.changedTouches[0];
		var movementY = Math.abs(touchobj.screenY-touchY);
		var movementX = Math.abs(touchobj.screenX-touchX);
		var dir = touchobj.screenX > touchX ? 1 : -1;
		
		if(dir !== swipedir) break_scroll = true;
		
		if(click_scroll === false && movementY < movementX) {
		  e.preventDefault();
		  
		  self.target.scrollLeft += -(touchobj.pageX - touchX) * 1.2;
		  
		  var measure = self.target.offsetWidth/options.slidesShown * options.slidesScroll;
				var place 	= measure * current_slide;
				var scroll 	= self.target.scrollLeft - place;
				
				scroll = scroll/measure;
				
				if(scroll > 0.33) {
					self.next();
				}
				
				if(scroll < -0.33) {
					self.prev();
				}
		}
		
		swipedir = touchobj.screenX > touchX ? 1 : -1;
		touchY = touchobj.screenY;
		touchX = touchobj.screenX;
		}, false);
		
		    
		self.parent.addEventListener('touchend', function(e){
			var measure = self.target.offsetWidth/options.slidesShown * options.slidesScroll;
			var place 	= measure * current_slide;
			var scroll 	= self.target.scrollLeft - place;
			scroll = scroll/measure;
			
			if(scroll < 0.33) {
				self.activate();
			}
		},false);
		
		//---------------------------------
		// Start Slider
		//---------------------------------

		self.activate();
		
	}
}