/*	======================================

		DOM Manipulation helpers

========================================= */

function scrollTo(element, to, duration, callback) {
    var start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20,
        timer;
        
    var animateScroll = function(){        
        currentTime += increment;
        var val = Math.easeInOutCirc(currentTime, start, change, duration);
        element.scrollTop = val;
        if(currentTime < duration) {
            timer = setTimeout(animateScroll, increment);
        }
        else{
	        if (callback) callback();
        }
    };
    animateScroll();
}

function scrollToSection(element, duration, callback) {
	var top = cumulativeOffset(element);
	var headerHeight = document.querySelector('.js-header');
	top = top.top - headerHeight.offsetHeight;
	var scrollBody = typeof document.body.scrollTop == "number" ? document.body : document.documentElement;
	scrollTo(scrollBody, top, duration, callback);
}

function scrollToContainer(element, container, duration, callback) {
	var top = element.offsetTop;
	scrollTo(container, top, duration, callback);
}

			
function toggleClass(args)  {
	args.preventDefault();
	var element 		= args.currentTarget,
		target 			= document.querySelector(element.getAttribute('href')),
		toggle_class 	= element.getAttribute('data-toggle') ? element.getAttribute('data-toggle') : 'is-active';
	
	if(hasClass(target, toggle_class)) {
		target.classList.remove(toggle_class);
	} else {
		target.classList.add(toggle_class);
	}
};

(function() {
    var throttle = function(type, name, obj) {
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
    throttle("resize", "optimizedResize");
})();


//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutCirc = function (t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
};

var cumulativeOffset = function(element) {
    var top = 0, left = 0;
    do {
        top += element.offsetTop  || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while(element);

    return {
        top: top,
        left: left
    };
};


/*	======================================

		Utilities

========================================= */


// Function for looping through DOM arrays
function forEach(array, callback, done) {
	for (i =0; i < array.length; i++) {
		callback(array[i], i);
		if(i == array.length - 1 && done) {
			done();
		}
	}
}

// Helper functions for class handling
function hasClass(element, className) {
	if (typeof element == 'object') {
	  if (element.classList)
	    return element.classList.contains(className)
	  else
	    return !!element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
	}
}

function addClass(element, className) {
	if (typeof element == 'object') {
		className = className.split(' ');
		if(className.length > 1) {
			for(i=0; i < className.length; i++) {
			
				if (element.classList) {
			    	element.classList.add(className[i])
			    
				}else if (!hasClass(element, className[i])) {
					element.className += " " + className[i]
				}
			}
		}else {
			if (element.classList) {
		    	element.classList.add(className[0])
		    
			}else if (!hasClass(element, className[0])) {
				element.className += " " + className[0]
			}
		}
	}
}

function removeClass(element, className) {
	if (typeof element == 'object') {
	  if (element.classList)
	    element.classList.remove(className)
	  else if (hasClass(element, className)) {
	    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
	    element.className=el.className.replace(reg, ' ');
	  }
	}
}


/*	======================================

		Sticky Constructor

========================================= */


var Sticky = function Sticky(element, options) {
	var self = this;
	this.elements = document.querySelectorAll(element);
	var headerHeight = document.querySelector('.js-header');
	document.addEventListener('scroll', makeSticky);
	
	function makeSticky(event) {
		forEach(self.elements, function(element, index){
			if(!element.classList.contains('stickied')) {
				item_offset = cumulativeOffset(element);
			}
			
				
			var scroll_pos = document.documentElement.scrollTop || document.body.scrollTop;

			if(element.hasAttribute('data-contain')){
				var container = document.getElementById((element.getAttribute('data-contain')));
				var container_offset = cumulativeOffset(container);
				stop = container_offset.top + container.offsetHeight - element.offsetHeight;
				
				if(scroll_pos > container_offset.top && scroll_pos < stop) {
					element.style.width = element.offsetWidth + 'px';
					element.classList.add('stickied');
					element.style.top = container_offset.top + 'px';
				}
				else {
					element.classList.remove('stickied');
					element.style.top = '';
					element.style.bottom = container_offset.top +  container.outerHeight + 'px';
				}
			}
			
			else {
				
				var offset_top = element.getAttribute('data-offset') ? element.getAttribute('data-offset') : 0;
				var start_top = element.hasAttribute('data-header-start') ? headerHeight.offsetHeight : 0;
				
				
				if(element.hasAttribute('data-header-offset')) offset_top = offset_top + headerHeight.offsetHeight;
				
				if(item_offset.top < scroll_pos + offset_top - start_top ) {
					element.style.width = element.offsetWidth + 'px';
					element.classList.add('stickied');
					element.style.top = offset_top + 'px';
				}
				else {
					element.classList.remove('stickied');
					element.style.top = '';
					element.style.width = ''
				}
			}
		});
	}
}

/* ===========================================

		Modal Panel Constructor

=============================================*/

		
var ModalPanel = function ModalPanel() {
	// local
	var self = this,
			closeTimer,
			changeTimer,
			callCount = 0,
			goodtogo = true,
			body = document.body,
			open = false,
			panel = document.createElement("div"),
			content = '<button class="btn-circle-s js-no-return close-panel close">x</button><div class="content"></div>';
			panel.classList.add('modal-panel');
			panel.setAttribute('id', 'modal-panel');
			panel.innerHTML = content;
			body.appendChild(panel);
			var panel_content = panel.querySelector('.content');
	
	function killPanel() {
		closeTimer = setTimeout(function(){ 
			open = false;
		}, 300);
	};
	
	// Public
	this.open = function(content, done, buttons) {
		clearTimeout(changeTimer);
		if(open) {
			this.changeContent(content, done);
		}
		else {
			open = true;
			clearTimeout(closeTimer);
			panel_content.innerHTML = content;
						
			if(buttons) {
				var action_buttons = document.createElement('div');
				action_buttons.classList.add('action-btns');
				
				var button = [];
				for(i=0; i < buttons.length; i++) {
					button[i] = document.createElement(buttons[i].tag);
					button[i].classList.add(buttons[i].classes);
					button[i].addEventListener('click', buttons[i].action);
					button[i].innerHTML = buttons[i].label;
					action_buttons.appendChild(button[i]);
				}
				panel_content.appendChild(action_buttons);
			}
			
			panel.style.display = 'block';
			panel.classList.remove('close');
			panel.classList.add('open');
			panel.style.marginLeft = (-(panel.offsetWidth/2) + 'px');
			panel.style.marginTop = (-(panel.offsetHeight/2) + 'px');
			body.classList.add('card-open');
			bindMine.bind();
			if(done) done();
		}
		window.setTimeout(function(){
			goodtogo = true;
		}, 300);
	};
	
	this.changeContent = function(content, done) {//Record history
		clearTimeout(changeTimer);
		clearTimeout(closeTimer);
		panel_content.classList.add('change-out');
		changeTimer = setTimeout(function(){
			panel_content.classList.remove('change-out');
			panel_content.innerHTML = content;
			panel_content.classList.add('change-in');
			bindMine.bind();
			if(done) done();
		}, 300);
	};
	
	// Closes panel and removes content
	this.close = function() {		
		panel.classList.add('close');
		panel.classList.remove('open');
		body.classList.remove('card-open');
		
		killPanel();
	};
}


/*	======================================

		Loader Constructor

========================================== */


var Loader = function Loader(){
	// local
	var self = this,
	loader,
	closeTimer,
	body = document.body,
	spinner = '<div class="spinner-loader"></div>';
	loader = document.createElement("div");
	loader.classList.add('loader');
	loader.innerHTML = spinner;
	body.appendChild(loader);
	loader.style.display = 'none';
	
	this.loading = false;
	
	function killLoader() {
		clearTimeout(closeTimer);
		closeTimer = setTimeout(function(){ 
			loader.style.display = 'none';
			loader.classList.remove('open');
		}, 300);
	}
	
	// Public Methods
	this.open  = function() {
		self.loading = true;
		loader.style.display = 'block';
		loader.classList.remove('close');
		loader.classList.add('open');
		loader.style.marginLeft = (-(loader.offsetWidth/2) + 'px');
		loader.style.marginTop = (-(loader.offsetHeight/2) + 'px');
		body.classList.add('loading');
	};
	
	this.close = function() {// Closes the loader
		self.loading = false;
		loader.classList.add('close');
		body.classList.remove('loading');	
		killLoader();
	}
}



/*	======================================

		Notification Constructor

========================================== */



var NotifyEm = function NotifyEm(options) {
	// Private
	var self = this,
		node,
		body = document.querySelector('body'),
		offsetX = {},
		dragging = false,
		winW = window.innerWidth,
		closeTimer,
		killTimer;
	
	this.open = false;
		
	node = document.createElement("div")
	node.classList.add('notify-em');
	node.style.display = 'none';
	body.appendChild(node);		
	node.addEventListener('mousedown', self.dragStart);
	node.addEventListener('mouseup', self.dragStop);
	
	node.addEventListener('mouseup', function(){
		event.stopPropagation();
	});
	
	document.addEventListener('mouseup', function(){
		if(self.open == true) {
			self.closeAlert();
		}
	});
	
	function killNoti() {
		clearTimeout(killTimer);
		killTimer = setTimeout(function(){ 
			node.style.display = 'none';
			node.style.opacity = '1';
			node.classList.remove('close');
		}, 300);
	}
	
	// Public
	this.sendAlert = function(content, stay) {
		clearTimeout(closeTimer);
		node.innerHTML = content;
		node.style.display = 'block';
		node.classList.add('open');
		node.style.marginLeft = (-(node.offsetWidth/2) + 'px');
		node.style.marginTop = (-(node.offsetHeight/2) + 'px');
		if(stay > 0) {
			closeTimer = setTimeout(this.closeAlert, stay);
		}
	}
	
	this.sendDialog = function(message, options){

		button1 = options.button1 ? '<button class="btn-1 " id="notify-action-1">' + options.button1.text + '</a>' : '';
		button2 = options.button2 ? '<button class="btn-2" id="notify-action-2">' + options.button2.text + '</a>' : '';
		content = '<p>' + message + '</p>' + '<div class="action-buttons">' + button1 + button2 + '</div>';
		node.innerHTML = content;
		
		if(options.button1) {
			document.getElementById('notify-action-1').addEventListener('click', options.button1.action);
		}
		
		if(options.button2) {
			document.getElementById('notify-action-2').addEventListener('click', options.button1.action2);
		}
		
		node.style.display = 'block';
		node.classList.add('open');
		node.style.marginLeft = (-(node.offsetWidth/2) + 'px');
		node.style.marginTop = (-(node.offsetHeight/2) + 'px');
	}
	
	this.sendField = function(message, options){
		field = document.createElement('input');
		field.setAttribute('placeholder', options.field);
		field.setAttribute('type', 'input');
		
		field.addEventListener('keyup', function(event){
			if (event.which == 13 || event.keyCode == 13) {
				//code to execute here
				node.addEventListener('mousedown', self.dragStart);
				node.addEventListener('mouseup', self.dragStop);
				options.action(field);
				
				self.closeAlert();
			}
		});
		
		field.addEventListener('mouseup', function(event){
			event.stopPropagation();
		});
		
		button = document.createElement('button');
		button.innerHTML = options.button;
		
		title = document.createElement('div');
		title.classList.add('title');
		title.innerHTML = message;
		
		node.innerHTML = '';
		node.appendChild(title);
		node.appendChild(field);
		node.appendChild(button);
		
		button.addEventListener('click', function(){
			options.action(field);
			self.closeAlert();
		});
		
		node.style.display = 'block';
		node.classList.add('open');
		node.style.marginLeft = (-(node.offsetWidth/2) + 'px');
		node.style.marginTop = (-(node.offsetHeight/2) + 'px');
		
		self.open = true;
	}
	
	this.closeAlert = function() {
		node.classList.remove('open');
		node.classList.add('close');
		self.open = false;
		killNoti();
	}
	
	this.dragStart = function(event) {
		winW = body.offsetWidth;
		offsetX.width 	= event.target.offsetWidth;
		offsetX.mouse = event.clientX - event.target.offsetLeft;
		dragging 	= true;
		clearTimeout(closeTimer);
		body.classList.add('no-select');
	}
	
	this.dragStop = function(event) {
		if (dragging == true) {
			dragging = false;
			self.closeAlert();
		}
		body.classList.remove('no-select');
	}
	
	this.mouseMove = function(event) {
		var drag = (event.clientX - offsetX.mouse + (offsetX.width/2));
		if (dragging == true && drag >= winW/2) {
			event.preventDefault();
			node.style.left = drag + 'px';
			node.style.opacity = 1 - (drag - winW/2) / offsetX.width;
		} else if(drag < winW/2) {
			node.style.left = '50%';
		}
	}
	this.selectDisabler = function(event) {
		event.preventDefault();
		return false;
	}
}


/*	======================================

		Event Listener Handler Contstructor

========================================== */
		
		
var ListenerHandler = function ListenerHandler(args){
	this.elements = args;
	this.bind = function() {
		this.elements.forEach(function(el){
			elements = document.querySelectorAll(el[0]);
			forEach(elements, el[1]);
		});
	};
	this.addEl = function(element) {
		this.elements.push(element);
	}
	this.bind();
};



/*	======================================

	Slider Constructor

========================================== */


var ContentSlider = function ContentSlider(id, options){
	// Options
	
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
	
	// Private
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
	    scroll_timer;
	
	// Public
		
	this.target = document.getElementById(id);
	this.parent = this.target.parentNode;
	this.children = this.target.querySelectorAll('.slide');
	this.counter = this.parent.querySelector('.counter');
	this.elwidth = this.target.offsetWidth;
	this.markers = [];
	
	
	if(this.children.length > 1) {
		// Methods
		
		(this.init = function(){
			self.target.querySelector('.content-slider-inner').style.width = (self.children.length * 100)/options.slidesShown + '%';
			
			if(options.navigation == true) {
				if(self.nav) self.nav.remove();
				self.nav = document.createElement('div');
				self.nav.classList.add('navi-arrows');
				
				// Buttons
				self.next_button = document.createElement('button');
				self.prev_button = document.createElement('button');
				
				self.next_button.classList.add('btn-circle-s');
				self.prev_button.classList.add('btn-circle-s');
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
				self.place_container.classList.add('place-container');
				
				self.counter = document.createElement('div');
				self.counter.classList.add('counter');
				self.counter.innerHTML = 1;
				
				self.place_nav = document.createElement('ul');
				self.place_nav.classList.add('place-nav');
				
				self.place_container.appendChild(self.place_nav);
				self.place_container.appendChild(self.counter);
				
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
				
				self.place_nav.classList.add('place-nav');
				
				// Compile nav and place below target slider
				self.nav.appendChild(self.prev_button);
				self.nav.appendChild(self.place_container);
				self.nav.appendChild(self.next_button);
				self.parent.appendChild(self.nav);
				
			}
		})();
		
		this.activate = function(speed){
			var speed = speed || 300;
			var scrollTo = self.children[current_slide].offsetLeft;
			
			// Set classes for Active Slides
			for (i=0; i < options.slidesShown ; i ++) {
					if(self.children[current_slide + i]){
						self.children[current_slide + i].classList.remove('is-back');
						self.children[current_slide + i].classList.add('is-active-slide');
					}
			}
			
			// Set the markers
			if(options.navigation) {
				if(self.markers[current_slide/options.slidesScroll] && self.markers[last_slide]) {
					self.markers[current_slide/options.slidesScroll].classList.add('is-active');
					self.markers[last_slide].classList.remove('is-active');
				}
			}
			
			//Scroll Slider
			self.scrollTo(scrollTo, 400, function(){
					click_scroll = false;
			});
			last_slide = current_slide/options.slidesScroll;
			
			
			
			if(current_slide + 1 > self.children.length - options.slidesShown) {
				self.next_button.setAttribute('disabled', 'disabled');
			}
			else {
				self.next_button.removeAttribute('disabled');
			}
			
			if(current_slide == 0) {
				self.prev_button.setAttribute('disabled', 'disabled');
			}else {
				self.prev_button.removeAttribute('disabled');
			}
			
			self.counter.innerHTML = Math.ceil(current_slide/options.slidesScroll + 1);
			
		}
		
		this.scrollTo = function(to, duration, callback) {
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
		    };
	    animateScroll();
		}
		
		this.next = function(speed){
			if(current_slide + options.slidesScroll < self.children.length - options.slidesShown) {
				click_scroll = true;
				current_slide = current_slide + options.slidesScroll;
				
				for (i=1; i < options.slidesScroll + 1 ; i ++) {
					self.children[current_slide - i].classList.remove('is-active-slide');
					self.children[current_slide - i].classList.remove('in-back');
					self.children[current_slide - i].classList.add('is-back');
				}
				
				self.activate(speed);
			}else {
				current_slide = current_slide + (self.children.length - options.slidesShown - current_slide);
				click_scroll = true;
				for (i=1; i < options.slidesScroll + 1 ; i ++) {
					if(self.children[current_slide - i]) {
						self.children[current_slide - i].classList.remove('is-active-slide');
						self.children[current_slide - i].classList.remove('in-back');
						self.children[current_slide - i].classList.add('is-back');
					}
				}
				self.activate(speed);
			}
		};
		
		this.prev = function(speed){
			if(current_slide >= options.slidesScroll && current_slide % options.slidesScroll == 0) {
				click_scroll = true;
				self.next_button.removeAttribute('disabled');
				for (i=0; i < options.slidesShown ; i ++) {
					if(self.children[current_slide + i]) {
						self.children[current_slide + i].classList.remove('is-active-slide');
					}
				}
				current_slide = current_slide - options.slidesScroll;
				self.children[current_slide].classList.add('in-back');
				
				self.activate(speed);
			}
			else {
				click_scroll = true;
				self.next_button.removeAttribute('disabled');
				for (i=0; i < options.slidesShown ; i ++) {
					if(self.children[current_slide + i]){
						self.children[current_slide + i].classList.remove('is-active-slide');
					}
				}
				self.children[current_slide].classList.add('in-back');
				
				current_slide = current_slide - (current_slide % options.slidesScroll);
				self.activate(speed);
			}
		};
		
		this.goTo = function(slide){
				click_scroll = true;
				for (i=0; i < options.slidesShown ; i ++) {
					if(self.children[current_slide + i]) {
						self.children[current_slide + i].classList.remove('is-active-slide');
					}
				}
				current_slide = slide;
				
				self.activate();
		};
		
				
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
		
		// Events
		
		window.addEventListener("optimizedResize", self.resize);
		
		this.parent.addEventListener('mouseover', function(){
			over_slider = true;
		});
		this.parent.addEventListener('mouseleave', function(){
			over_slider = false;
		});
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
		
		// Mouse Wheel Handler
		
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
		
		// Touch handlers
		
		self.parent.addEventListener('touchstart', function(e){
	      var touchobj = e.changedTouches[0];
	      swipedir = 'none';
	      dist = 0;
	      touchX = touchobj.screenX;
	      touchY = touchobj.screenY;
	  }, false)
	
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
			
		self.activate();
		
	}
}

/*	======================================

		Accordion

========================================== */

var Accordion = function Accordion(element, options){
	options.multiple = options.multiple ? options.multiple : true;
	
	var elements = Array.prototype.slice.call(element.querySelectorAll('.accordion'));
	var accordion_content = Array.prototype.slice.call(element.querySelectorAll('.accordion-content'));
	
	elements.forEach(function(element){
		element.querySelector('.accordion-trigger').addEventListener('click', toggle);
	});
	
	function toggle(event){
		var parent = this.parentNode;
		
		if(options.multiple) {
			elements.forEach(function(element){
				element.classList.remove('is-active');
			});
			accordion_content.forEach(function(element){
				element.style.height = '0';
			});
		}
		
		var content = parent.querySelector('.accordion-content');
		var height = content.scrollHeight;
		parent.classList.toggle('is-active');
		if(content.offsetHeight < 1) {
			content.style.height = height + 'px';
		}
		else {
			content.style.height = '0';
		}
	};
}

var Parallax = function Parallax(query) {
	var self = this;
	
	document.addEventListener('scroll', parallaxScroll);
	
	function parallaxScroll() {
	    var scrollLeft = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
	    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
	    var items = document.querySelectorAll(query);
	    for(i=0; i < items.length; i++) {
				items[i].style.transform = 'translateY(' + (scrollTop * 0.2) + 'px)';
			}
	}
}


/*	======================================

		Events Listner Functions

========================================== */


function scrollToSectionEvent(event){
	var target_query = event.currentTarget.getAttribute('href');
	var target = document.querySelector(target_query);
	event.preventDefault();
	scrollToSection(target, 500);
}


/*	======================================

		Slide UP/DOWN/TOGGLE

========================================== */


function slideDown(element, duration){
	var height = element.scrollHeight;
	removeClass(element, 'is-up');
	element.classList.add('is-down');
	
	if(element.offsetHeight < 1) {
		if(!element.classList.contains('is-active')){
			setTimeout(function(){
				element.classList.add('is-active');
				element.style.height = height + 'px';
			}, 1);
		}else{
			element.style.height = height + 'px';
		}
	}
}

function slideUp(element, duration){
	element.style.height = element.scrollHeight + 'px';
	removeClass(element, 'is-down');
	element.classList.add('is-up');
	
	if(!element.classList.contains('is-active')){
		setTimeout(function(){
			element.classList.add('is-active');
			element.style.height = '0';
		}, 1);
	}else{
		element.style.height = '0';
	}
}

function slideToggle(element, callback){
	var height = element.scrollHeight;
	element.style.height = element.offsetHeight + 'px';
	
	if(element.offsetHeight < 1) {
		slideDown(element, duration);
	}else {
		slideUp(element, duration);
	}
}



/*	======================================

		Init

========================================== */

var loader = new Loader();
var panel = new ModalPanel();
var alertBox = new NotifyEm();
var sticky = new Sticky('.sticky');
var parallax = new Parallax('.parallax');

var elements = [
	['.js-scroll-to', function(element) { 
		element.addEventListener('click', scrollToSectionEvent) 
	}],
	['.js-toggle', function(element){
		element.addEventListener('click', toggleClass);
	}],
	['.close-panel',function(element){
			element.addEventListener('click', closePanel);
	}]
];

var bindMine = new ListenerHandler(elements);


function closePanel(event) {
		hashtarget = event.currentTarget.getAttribute('href');
		panel.close();
}


function openLogin(){
	var content = '<div class="inner-modal"><form method="post" class="form-short">' +
		'<header class="modal-header"><h3 class="modal-title">Login to your Account</h3></header>' +
		'<div class="form-short-field"><input class="field-element" type="email" placeholder="Email"></div>' +
		'<div class="form-short-field"><input class="field-element" type="password" placeholder="Password"></div>' +
		'<button class="btn-action" type="submit">Login</button></div>' +
		'</form></div>';
	panel.open(content);
	return false;
}