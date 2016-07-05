
/*	======================================
	
	Grooundwork v1.0
	
	Copyright 2016 Groundwork Design Co.

========================================= */

var groundWork = (function(){
	
	//- - - - - - - - - - - - - - - - - - - - - - - -
	//	Extend the Global Enviornment
	//- - - - - - - - - - - - - - - - - - - - - - - -
	
	throttle = function(type, name, obj) {
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
    throttle("resize", "optimizedResize");  // Use: window.addEventListener('optimizedResize', {Function})
	throttle("scroll", "optimizedScroll");  // Use: window.addEventListener('optimizedSCroll', {Function})
	
	
	//- - - - - - - - - - - - - - - - - - - - - - - -
	//	Math
	//- - - - - - - - - - - - - - - - - - - - - - - -
	
	//t = current time
	//b = start value
	//c = change in value
	//d = duration
	
	Math.easeInOutCirc = function (t, b, c, d) {
			if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
			return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	}
	
	Math.easeInOutQuart = function (t, b, c, d) {
		t /= d/2;
		if (t < 1) return c/2*t*t*t*t + b;
		t -= 2;
		return -c/2 * (t*t*t*t - 2) + b;
	}
	
	//- - - - - - - - - - - - - - - - - - - - - - - -
	//	Initialize Ground Work Schema
	//- - - - - - - - - - - - - - - - - - - - - - - -
	
	var gw = {
		trackers : {},
		config : {},
		utils : {
			math : {},
			dom : {},
			events : {},
			fc : {},
		},
		animate : {},
		components : {},
		modules : {}
	};
	
	return gw;
	
})();
groundWork.animate = {
	slideDown : function(el, duration){
		var height = el.scrollHeight;
		groundWork.utils.removeClass(el, 'is-up');
		groundWork.utils.addClass(el, 'is-down');
		
		if(el.offsetHeight < 1) {
			if(!groundWork.utils.hasClass(el, 'is-active')){
				setTimeout(function(){
					groundWork.utils.addClass(el, 'is-active');
					el.style.height = height + 'px';
				}, 1);
			}else{
				el.style.height = height + 'px';
			}
		}
	},
	slideUp : function(el, duration){
		el.style.height = el.scrollHeight + 'px';
		groundWork.utils.removeClass(el, 'is-down');
		groundWork.utils.addClass(el, 'is-up');
		
		if(!groundWork.utils.hasClass(el, 'is-active')){
			setTimeout(function(){
				groundWork.utils.addClass(el, 'is-active');
				el.style.height = '0';
			}, 1);
		}else{
			el.style.height = '0';
		}
	},
	slideToggle : function(el, callback){
		var height = el.scrollHeight;
		el.style.height = el.offsetHeight + 'px';
		
		if(el.offsetHeight < 1) {
			this.slideDown(el, duration);
		}else {
			this.slideUp(el, duration);
		}
	},
	scrollTo : function(element, to, duration, callback) {
	    var start = element.scrollTop,
	        change = to - start,
	        currentTime = 0,
	        increment = 20,
	        timer;
	    scrolling = true;
		
		if(typeof to !== 'number') {
			var win_scroll = document.documentElement.scrollTop || document.body.scrollTop;
			var offset = element.getBoundingClientRect();
			var to = start + offset.top - window.innerHeight;
		}
		
	    var animateScroll = function(){
		    if(stopscroll == true) {
			    scrolling = false;
			    if (callback) callback();
		    }else {	      
		        currentTime += increment;
		        var val = Math.easeInOutCirc(currentTime, start, change, duration);
		        if(element == 'body'){
			        document.body.scrollTop = val;
			        document.documentElement.scrollTop = val;
		        }else{
		        	element.scrollTop = val;
		        }
		        if(currentTime < duration) {
		            timer = setTimeout(animateScroll, increment);
		        }
		        else{
			        scrolling = false;
			        if (callback) callback();
		        }
	        }
	    };
	    animateScroll();
	},
	scrollToCenterOfEl : function(element, duration, callback) {
		var win_scroll = document.documentElement.scrollTop || document.body.scrollTop;
		var offset = element.getBoundingClientRect();
		var to = win_scroll + offset.top - window.innerHeight/2;
		var speed = (Math.abs(win_scroll-to)/1000) * duration;
		if(scrolling) {
			stopscroll = true;
			window.setTimeout(function(){
				stopscroll = false;
				this.scrollTo('body', to, duration, callback);
			}, 30)
		}else {
			this.scrollTo('body', to, duration, callback);
		}
	}
}
groundWork.utils.data = {	
	// Get Age from Birthdate
	getAge : function(birth) {
	
	    var today = new Date();
	    var nowyear = today.getFullYear();
	    var nowmonth = today.getMonth();
	    var nowday = today.getDate();
	
	    var birthyear = birth.getFullYear();
	    var birthmonth = birth.getMonth();
	    var birthday = birth.getDate();
	
	    var age = nowyear - birthyear;
	    var age_month = nowmonth - birthmonth;
	    var age_day = nowday - birthday;
	   
	    if(age_month < 0 || (age_month == 0 && age_day <0)) {
	            age = parseInt(age) -1;
	        }
	    return(age);
	},
	getHeight : function(height) {
		height = Math.floor(height/12) + "' " + (height%12) + '"' ;
	  return(height);
	},
	
	getMonthName : function(month){
		monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		return monthName[month];
	}
}
groundWork.utils.dom = {
	isElementInViewport : function(el) {
	    var rect = el.getBoundingClientRect();
	
	    return (
	        rect.top >= 0 &&
	        rect.left >= 0 &&
	        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
	        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
	    );
	},
	isElementVisible : function(el) {
	
	    var rect = el.getBoundingClientRect();
	    return (
	        rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
	        rect.bottom > 0
	    );
	},
	cumulativeOffset : function(el) {
	    var top = 0, left = 0;
	    do {
	        top += el.offsetTop  || 0;
	        left += el.offsetLeft || 0;
	        el = el.offsetParent;
	    } while(el);
	
	    return {
	        top: top,
	        left: left
	    };
	},		
	centerOffset : function(top, height, scroll, winh) {
		var center_win = scroll + winh / 2;
		var center_el = top + (height / 2);
		var off_center = center_el - center_win;
	    return off_center;
	},
	createElement : function(el_tag, content, class_stack, attributes, append_el) {
		// Create el
		var el = document.createElement(el_tag);
		el.innerHTML = content;
		if(class_stack) groundWork.utils.dom.addClass(el, class_stack);
		
		if(Array.isArray(attributes)) {
			attributes.forEach(function(attr, i){
				el.setAttribute(attr.name, attr.value);
			});
		}
		if(append_el) append_el.appendChild(el);
		return el;
	},
	killElement : function(el, time, options, callback) {
		if(typeof options == 'object') {
			if(options.remove_class) groundWork.utils.dom.removeClass(el, options.remove_class);
			if(options.add_class) groundWork.utils.dom.removeClass(el, options.add_class);
		}
		
		closeTimer = setTimeout(function(){ 
			el.remove();
			if(typeof callback == 'function') callback();
		}, time);
	},
	appendElement : function(el_tag, content, class_stack, append_el) {
		// Create content container
		var el = groundWork.utils.dom.createElement(el_tag, content, class_stack);
		append_el.appendChild(el);
		
		return el;
	},
	insertAfter : function(el, referenceNode) {
	    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
	},
	forEach : function(array, callback, done) {
		for (i =0; i < array.length; i++) {
			callback(array[i], i);
			if(i == array.length - 1 && done) {
				done();
			}
		}
	},
	htmlToElement : function(html) {
	    var template = document.createElement('template');
	    template.innerHTML = html;
	    return template.content.firstChild;
	},
	addClass : function(element, class_name) {
		class_name = class_name.split(' ');
		if(element && element.length && element.length > 0) {
			for(i=0; i < element.length; i++) {
				doAction(element[i]);
			}
		}else {
				doAction(element);
		}
		
		function doAction(element){
			if (typeof element == 'object') {
				if(class_name.length > 1) {
					for(i=0; i < class_name.length; i++) {
					
						if (element.classList) {
					    	element.classList.add(class_name[i]);
					    
						}else if (!hasClass(element, class_name[i])) {
							element.class_name += " " + class_name[i]
						}
					}
				}else {
					if (element.classList) {
					    element.classList.add(class_name[0]);
				    
					}else if (!groundWork.utils.dom.hasClass(element, class_name[0])) {
						element.class_name += " " + class_name[0]
					}
				}
			}
		}
	},
	removeClass : function(element, class_name) {
		class_name = class_name.split(' ');
		if(element && element.length && element.length > 0) {
			for(i=0; i < element.length; i++) {
				doAction(element[i]);
			}
		}else {
				doAction(element);
		}
		
		function doAction(element) {
			if (typeof element == 'object') {
				if(class_name.length > 1) {
					for(i=0; i < class_name.length; i++) {
					
						if (element.classList) {
					    	element.classList.remove(class_name[i]);
					    
						}else if (groundWork.utils.dom.hasClass(element, class_name[i])) {
							var reg = new RegExp('(\\s|^)' + class_name[i] + '(\\s|$)');
							element.class_name=el.class_name.replace(reg, ' ');
						}
					}
				}else {
					if (element.classList) {
					    element.classList.remove(class_name[0]);
				    
					}else if (groundWork.utils.dom.hasClass(element, class_name[0])) {
						var reg = new RegExp('(\\s|^)' + class_name[0] + '(\\s|$)');
						element.class_name=el.class_name.replace(reg, ' ');
					}
				}
			}
		}
	},
	toggleClass : function(el, class_name)  {
		if(groundWork.utils.dom.hasClass(el, class_name)) {
			groundWork.utils.dom.removeClass(el, class_name);
		} else {
			groundWork.utils.dom.addClass(el, class_name);
		}
	},
	hasClass : function(element, class_name) {
		if (typeof element == 'object') {
		  if (element.classList)
		    return element.classList.contains(class_name)
		  else
		    return !!element.class_name.match(new RegExp('(\\s|^)' + class_name + '(\\s|$)'))
		}
	}
	
}
groundWork.utils.events =  {
	observeDOM : (function(){
	 var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
	     eventListenerSupported = window.addEventListener;
	
	 return function(obj, callback){
	     if( MutationObserver ){
	         // define a new observer
	         var obs = new MutationObserver(function(mutations, observer){
	             if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
	                 callback();
	         });
	         // have the observer observe foo for changes in children
	         obs.observe( obj, { childList:true, subtree:true });
	     }
	     else if( eventListenerSupported ){
	         obj.addEventListener('DOMNodeInserted', callback, false);
	         obj.addEventListener('DOMNodeRemoved', callback, false);
	     }
	 }
	})()
}
groundWork.utils.fc = {
	// Will only fire when the function hasn't been called in the amount of time set by @wait
	debounce : function(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	}
}
/*	======================================

		Polyfills

========================================= */

groundWork.polyFills = (function(){
	if (!Array.isArray) {
	  Array.isArray = function(arg) {
	    return Object.prototype.toString.call(arg) === '[object Array]';
	  };
	}
})();
groundWork.ajax = (function(){
	
	var controller = {},
		addClass = groundWork.utils.dom.addClass,
		removeClass = groundWork.utils.dom.removeClass;
	controller.params = function(obj){
	    var pairs = [];
	    for (var prop in obj) {
	        if (!obj.hasOwnProperty(prop)) {
	            continue;
	        }
	        pairs.push(prop + '=' + obj[prop]);
	    }
	    return pairs.join('&');
	};
	
	controller.serialize = function(obj){
		var returnVal;
			if(obj !== undefined){
				switch(obj.constructor)
				{
					case Array:
						var vArr="[";
						for(var i=0;i<obj.length;i++)
						{
							if(i>0) vArr += ",";
							vArr += serialize(obj[i]);
						}
						vArr += "]"
						return vArr;
					case String:
						returnVal = escape("'" + obj + "'");
						return returnVal;
					case Number:
						returnVal = isFinite(obj) ? obj.toString() : null;
						return returnVal;				
					case Date:
						returnVal = "#" + obj + "#";
						return returnVal;		
					default:
						if(typeof obj == "object"){
							var vobj=[];
							for(attr in obj) {
								if(typeof obj[attr] != "function")
								{
									vobj.push('"' + attr + '":' + controller.serialize(obj[attr]));
								}
							}
								if(vobj.length >0)
									return "{" + vobj.join(",") + "}";
								else
									return "{}";
						}		
						else
						{
							return obj.toString();
						}
				}
			}
			return null;
	}
	
	controller.post = function(args) {	
		var hxr = new XMLHttpRequest();

		if(args.type == 'json') {
			args.data = JSON.stringify(args.data);
		}else if(args.dataobj){
			args.data = this.params(args.dataobj);
		}else if(args.data){
			args.data = new FormData(args.data);
		}
		
		args = {
			type : args.type,
			method : args.data ? 'POST' : 'GET',
			url : args.url,
			data : args.data,
			success : args.success ? args.success : function(res){ console.log(res)},
			append : args.append ? args.append : function(){},
			err : args.err ? args.err : function(res){ console.log(res)}
		};
		
		// We bind the FormData object and the form el
		args.append(args.data);
		
		// We define what will happen if the data is successfully sent
	   hxr.addEventListener("load", function(event) {	
			if (hxr.readyState == XMLHttpRequest.DONE ) {
				var response = hxr.responseText;
				if(hxr.status == 200){
					if(args.type == 'json') response = JSON.parse(response);
					args.success(response);
				}
				else if(hxr.status == 400) {
					var message = 'Not Found';
					if(args.type == 'json') message = {error : message};
					args.err(message);
				}
				else {
					if(args.type == 'json') response = JSON.parse(response);
					args.err(response);
				}
			}
	   });
	
		// We define what will happen in case of error
		hxr.addEventListener("error", function(event) {
			args.err('There was an issue with your request, please try again.');
		});
	
		// We setup our request
		hxr.open(args.method, args.url, true);
		hxr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		if(args.type == 'json') {
			hxr.setRequestHeader("Content-Type", "application/json");
		}
		
		// The data sent are the one the user provide in the form
		hxr.send(args.data);
	
	}
	
	controller.loadView = function(url, el, success, err) {
		addClass(el, 'loading');
		this.post({
			url : url,
			success: function(res){
				el.innerHTML = res;
				if(typeof success == 'function') success();
				removeClass(el,'loading');
			},
			err : function(){
				if(typeof err == 'function') err();
				removeClass(el,'loading');
				addClass(el,'error');
			}
			
		});
	}
	return controller;
})();
groundWork.autoFill = function(selector, options) {
	var defaults = {};
	if(typeof options == 'object') {
	}else {
		options = defaults;
	}
	var utils = groundWork.utils;
	
	groundWork.listenerManager.bind([selector, initAf]);
	
	var onInput = utils.fc.debounce(function(e) {
		var el = e.target;
		var start = el.dataset.start ? el.dataset.start : 3;
		if(el.value.length > start - 1) {
				var el = e.target,
					url = el.dataset.url,
					data = {},
					af_el = el.nextElementSibling;
					data[el.name] = el.value;
					data = groundWork.ajax.params(data);
				groundWork.ajax.loadView(url+ '?' + data, af_el, function(res){
					utils.dom.addClass(af_el, 'is-active');
					utils.dom.forEach(af_el.children, function(item){
						item.addEventListener('click', function(event){
							var val = item.dataset.value;
							el.value = val;
							if(typeof options.click == 'function') options.click(item);
						});
					});
				}, function(err){
					utils.dom.removeClass(af_el, 'is-active');
				});
			}else if(el.value.length){
				af_el = el.nextElementSibling;
				af_el.innerHTML = '';
				utils.dom.removeClass(af_el, 'is-active');
			}
		}, 10);
	
	function initAf(el) {
		if(!utils.dom.hasClass(el.nextElementSibling, 'auto-fill')) {
			var af_el = utils.dom.createEl('ul', '', 'auto-fill');
			utils.dom.insertAfter(af_el, el);
		}
		el.addEventListener('input', onInput);
	}

}
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
/*	========================================

		Event Listener Manager
		
		--Add functions to run on each element, each time the dom updates--

============================================= */
		
		
groundWork.listenerManager = (function(){
	var tool = {
		elements : [],
		update : function() {
			tool.elements.forEach(function(el){
				if(typeof el[0] == 'string') { // If the element provided is a css selector
					elements = document.querySelectorAll(el[0]);
					groundWork.utils.dom.forEach(elements, el[1]);
				}else {
					// If the element provided is an array, if not wrap single element in an array
					elements = Array.isArray(el[0])? el[0] : [el[0]];
					groundWork.utils.dom.forEach(elements, el[1]);
				}
			});
		},
		bind : function(element) {
			if(element.length > 2){
				element.forEach(function(element){
					tool.elements.push(element);
				})
			}else{
				tool.elements.push(element);
			}
			tool.update();
		}
	}			
	// Observe a specific DOM element:
	groundWork.utils.events.observeDOM(document.body, function(){ 
	    tool.update();
	});
	
	return tool;
	
})();

groundWork.Validator = function(form, args) {
	form = document.getElementById(form);
	if (form) {
		// My Privates
		var self = this; // to reference this inside of event listener functions
		
		function getRadioCheckedValue(form, radio_name){
		   var oRadio = form.els[radio_name];
		 
		   for(var i = 0; i < oRadio.length; i++)
		   {
		      if(oRadio[i].checked)
		      {
		         return oRadio[i].value;
		      }
		   }
		 
		   return '';
		}
		
		function validateEventHandler(event){
			self.validateHandler(event.target)
		}
		
						
		function validateForm(event) {
			if(event.target) event.preventDefault();
			self.isValid = true;
			self.message.errors = 0;
			self.message.fields = [];
			for (i = 0; i < self.validate_fields.length; i++) {
				if (self.validateHandler(self.validate_fields[i])) {
					continue;
				}
				
				self.message.errors ++;
				self.message.fields.push(self.validate_fields[i].getAttribute('data-message'));
				self.isValid = false;
			}
			if (self.isValid) {
				self.args.success(event);
			} else {
				if (form.querySelector('.is-error .field-el')) form.querySelector('.is-error .field-el').focus();
				self.args.fail(self.message);
			}
			return false;
		}
		
		// Public 
		
		this.args = { // set default args
			success : args.success ? args.success : function() { form.submit() },
			fail : args.fail ?  args.fail : function(msg) { console.log(msg)}
		}
		
		this.el = form;
		this.validate_fields = this.el.querySelectorAll('.validate');
		this.message = {
			errors : 0,
			fields : []
		};
		
		// Init
		
		for (i = 0; i < self.validate_fields.length; i++) {
			var el = self.validate_fields[i],
				method 	= el.getAttribute('data-validate'),
				isError = el.parentNode.classList.contains('is-error');
			if(isError) {
				el.addEventListener('change', validateEventHandler);
			}
		}
		
		form.addEventListener('submit', validateForm);
	}
	
	this.validateMethods = { // private prop
		required: function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			var required = (el.hasAttribute('required') || el.hasAttribute('data-validate-required'));
			if (required || val.length > 0) {
				return true;
			} else {
				false;
			}
		},
		isRequired : function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			if (val.length > 0 && val !== '') {
				return true;
			} else {
				false;
			}
		},
		isNumber : function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			if (self.validateMethods.required(el)) {
				var re = /^[0-9.]+$/
				var rslt = re.test(val);
				return rslt;
			}
			else {
				return true;
			}
		},
		isEmail: function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			if (self.validateMethods.required(el)) {
				var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				var rslt = re.test(val);
				return rslt;
			}
			else {
				return true;
			}
		},
		isChecked: function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			if (self.validateMethods.required(el)) {
				if (el.checked == true) {
					return true;
				} else {
					el.focus();
					return false;
				}
			} else {
				return true;
			}
		},
		isPhone: function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			if (self.validateMethods.required(el)) {
				var str = el.value;
				var phone2 = /^(\+\d)*\s*(\(\d{3}\)\s*)*\d{3}(-{0,1}|\s{0,1})\d{2}(-{0,1}|\s{0,1})\d{2}$/;
				if (str.match(phone2)) {
					return true;
				} else {
					el.focus();
					return false;
				}
			}
		},
		isFileExtension: function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			if (validateMethods.required(event.target)) {
				var alphaExp = /.*\.(gif)|(jpeg)|(jpg)|(png)$/;
				if (el.value.toLowerCase().match(alphaExp)) {
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		},
		isDate: function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			var format = "MMDDYYYY";
			if (self.validateMethods.required(el)) {
				if (format == null) {
					format = "MDY";
				}
				format = format.toUpperCase();
				if (format.length != 3) {
					format = "MDY";
				}
				if ((format.indexOf("M") == -1) || (format.indexOf("D") == -1) || (format.indexOf("Y") == -1)) {
					format = "MDY";
				}
				if (format.substring(0, 1) == "Y") { // If the year is first
					var reg1 = /^\d{2}(\-|\/|\.)\d{1,2}\1\d{1,2}$/;
					var reg2 = /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/;
				} else if (format.substring(1, 2) == "Y") { // If the year is second
					var reg1 = /^\d{1,2}(\-|\/|\.)\d{2}\1\d{1,2}$/;
					var reg2 = /^\d{1,2}(\-|\/|\.)\d{4}\1\d{1,2}$/;
				} else { // The year must be third
					var reg1 = /^\d{1,2}(\-|\/|\.)\d{1,2}\1\d{2}$/;
					var reg2 = /^\d{1,2}(\-|\/|\.)\d{1,2}\1\d{4}$/;
				}
				// If it doesn't conform to the right format (with either a 2 digit year or 4 digit year), fail
				if ((reg1.test(val) == false) && (reg2.test(val) == false)) {
					return false;
				}
				var parts = val.split(RegExp.$1); // Split into 3 parts based on what the divider was
				// Check to see if the 3 parts end up making a valid date
				if (format.substring(0, 1) == "M") {
					var mm = parts[0];
				} else
				if (format.substring(1, 2) == "M") {
					var mm = parts[1];
				} else {
					var mm = parts[2];
				}
				if (format.substring(0, 1) == "D") {
					var dd = parts[0];
				} else
				if (format.substring(1, 2) == "D") {
					var dd = parts[1];
				} else {
					var dd = parts[2];
				}
				if (format.substring(0, 1) == "Y") {
					var yy = parts[0];
				} else
				if (format.substring(1, 2) == "Y") {
					var yy = parts[1];
				} else {
					var yy = parts[2];
				}
				if (parseFloat(yy) <= 50) {
					yy = (parseFloat(yy) + 2000).toString();
				}
				if (parseFloat(yy) <= 99) {
					yy = (parseFloat(yy) + 1900).toString();
				}
				var dt = new Date(parseFloat(yy), parseFloat(mm) - 1, parseFloat(dd), 0, 0, 0, 0);
				if (parseFloat(dd) != dt.getDate()) {
					return false;
				}
				if (parseFloat(mm) - 1 != dt.getMonth()) {
					return false;
				}
				return true;
			} else {
				return true;
			}
		},
		isDob : function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			if (self.validateMethods.required(el)) {
				if(validateMethods.isDate(el)) {
					dob = new Date(val);
					today = new Date();
					today.setFullYear(today.getFullYear() - 5);
					return dob < today;
				}else {
					return false;
				}
			} else {
				return true;
			}
		},
		isName: function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			if (self.validateMethods.required(el)) {
				var re = /^[A-Za-z0-9 ]{3,50}$/;
				var rslt = re.test(val);
				return rslt;
			} else {
				return true;
			}
		},
		isPassword: function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			if (self.validateMethods.required(el)) {
				var re = /^(?=.*\d).{8,20}$/;
				var rslt = re.test(val);
				return rslt;
			} else {
				return true;
			}
		},
		isUrl: function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			if (self.validateMethods.required(el)) {
				var re = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
				var rslt = re.test(val);
				return rslt;
			} else {
				return true;
			}
		},
		isZip: function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			if (self.validateMethods.required(el)) {
				var re = /^\d{5}(?:[-\s]\d{4})?$/;
				var rslt = re.test(val);
				return rslt;
			} else {
				return true;
			}
		},
		isMatch: function(el) {
			el = (el.target) ? el.target : el;
			var val 	= el.value,
				match 	= document.getElementById(el.getAttribute('val-match')).value;
			
			if (val == match) {
				return true;
			}
			else {
				return false;
			}
		}
	}

	this.validateHandler = function(el) {
		if(el.hasAttribute('data-depends')) {
			var el_value;
			if(form.els[el.getAttribute('data-depends')].type == 'radio') {
				el_value = getRadioCheckedValue(form, el.getAttribute('data-depends'));
			}else{
				el_value = form.els[el.dataset.depends].value;
			}
			
			if(el.hasAttribute('data-depends-value') && el_value !== el.getAttribute('data-depends-value')) {
				el.parentNode.classList.remove('is-error');
				el.parentNode.classList.remove('is-valid');
				return true;
				console.log(el_value);
			}
			if(el_value == '') {
				el.parentNode.classList.remove('is-error');
				el.parentNode.classList.remove('is-valid');
				return true;
			}
		}
		
		var method	= el.getAttribute('data-validate'),
			message 	= el.getAttribute('data-message'),
			parent_el	= el.parentNode,
			required	= (el.hasAttribute('required') || el.hasAttribute('data-validate-required'));
		method = (required && !method) ? 'isRequired' : method;
		
		if(method) {
			if (self.validateMethods[method](el)) {
				parent_el.classList.remove('is-error');
				parent_el.classList.add('is-valid');
				return true;
			} else {
				parent_el.classList.remove('is-valid');
				parent_el.classList.add('is-error');
				el.addEventListener('input', validateEventHandler);
				return false;
			}
		} else {
			return true;
		}
	}
};
groundWork.components.dropUpload = function(selector, options) {
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Cache GW utils
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	var utils = groundWork.utils;
	var dom = utils.dom;
	var createElement = dom.createElement;
	var addClass = dom.addClass;
	var removeClass = dom.removeClass;
	var forEach = dom.forEach;
	
	
	groundWork.listenerManager.bind([selector, imageDropZone]);
	
	options.type = options.type ? options.type : 'image';
	options.background = options.background ? options.background : false;
	
	// Main handler function
	function imageDropZone(element, index){
		inputEl = element.getElementsByClassName('upload');
		inputEl = inputEl[0];
		inputEl.addEventListener('change', handleImage, false);
		inputEl.addEventListener("dragover", FileDragHover, false);
		inputEl.addEventListener("dragleave", FileDragOut, false);
		inputEl.addEventListener("drop", FileDragOut, false);
	}
	
		
	function FileDragHover(event) {
		addClass(event.target.parentNode, 'image-over');
	}
	
	function FileDragOut(event) {
		removeClass(event.target.parentNode, 'image-over');
	}
	
	function handleImage(event) {
		var reader = new FileReader();
		reader.onload = function (e) {   
			var preview_img = event.target.parentNode.getElementsByClassName('preview-img')[0]
			if(options.background) preview_img = event.target.parentNode;
			preview_img.setAttribute('style', 'background-image: url(' + e.target.result + ');');
			addClass(preview_img,'is-active');
		}
		reader.readAsDataURL(event.target.files[0]);
	}
}
groundWork.components.fields = function(selector){
	var component = [selector, function(element){
		element.addEventListener('focus', fieldControlFocus);
		element.addEventListener('blur', fieldControlBlur);
	}];
	groundWork.listenerManager.bind(component);
	
	function fieldControlFocus(event){
		parent = event.target.parentNode;
		groundWork.utils.dom.addClass(parent, 'is-focused');
	}
	
	function fieldControlBlur(event){
		var el_val = event.target.value,
			parent = event.target.parentNode;
		if(el_val !== '') {
			groundWork.utils.dom.addClass(parent, 'is-filled');
		}
		else {
			groundWork.utils.dom.removeClass(parent, 'is-focused');
			groundWork.utils.dom.removeClass(parent, 'is-filled');
		}
	}
};
groundWork.components.rangeSlider = function(selector) {
	var component = [selector, sliderControl];
	groundWork.listenerManager.bind(component);
	
	function sliderControl(el) {
		var el_tooltip = el.nextElementSibling,
			el_val = el.value,
			// Position
			minVal = Number(el.getAttribute('min')),
			maxVal = Number(el.getAttribute('max')),
			outputW = el_tooltip.offsetWidth,
			outputPos = (el_val - minVal) / (maxVal -minVal),
			// Values
			el_val = Math.floor(el_val/12) + "' " + (el_val%12) + '"' ;
			
			// Set these
			el_tooltip.innerHTML = el_val;
			el_tooltip.style.left= outputPos * 100 + '%';
			el_tooltip.style.marginLeft = (outputW/2) * -outputPos + 'px';
		
		// Input changed
		el.addEventListener('input', sliderControlInput);
		// Mousdown
		el.addEventListener('mousedown', sliderControlMousedown);
		// Mouesup
		el.addEventListener('mouseup', sliderControlMouseup);
	
	}
		
	function sliderControlInput(event){
			// Get the shit
			var range_marker = document.getElementById(event.target.getAttribute('data-marker'));
			var el_tooltip = event.target.nextElementSibling;
				el_val = event.target.value,
				minVal = Number(event.target.getAttribute('min')),
				maxVal = Number(event.target.getAttribute('max')),outputW = el_tooltip.offsetWidth,
				outputPos = (el_val - minVal) / (maxVal -minVal);
			if(event.target.hasAttribute('data-height')){
				el_val = Math.floor(el_val/12) + "' " + (el_val%12) + '"' ;
			}
			
			// Set the shit
			el_tooltip.innerHTML = el_val;
			if(range_marker) range_marker.innerHTML = el_val;
			el_tooltip.style.left= outputPos * 100 + '%';
			el_tooltip.style.marginLeft = (outputW/2) * -outputPos + 'px';
			
	}
	
	
	function sliderControlMousedown(event){
		var el_val = event.target.value,
			el_tooltip = event.target.nextElementSibling,
			minVal = Number(event.target.getAttribute('min')),
			maxVal = Number(event.target.getAttribute('max')),
			outputW = el_tooltip.offsetWidth,
			outputPos = (el_val - minVal) / (maxVal -minVal);
		if(event.target.hasAttribute('data-height')){
			el_val = Math.floor(el_val/12) + "' " + (el_val%12) + '"' ;
		}
		
		event.target.nextElementSibling.innerHTML = el_val;
		el_tooltip.style.left= outputPos * 100 + '%';
		el_tooltip.style.marginLeft = (outputW/2) * -outputPos + 'px';
			
		addClass(el_tooltip.parentNode, 'is-active');
		addClass(el_tooltip.parentNode, 'is-set');
	}
	
	
	function sliderControlMouseup(event){
		var el_tooltip = event.target.nextElementSibling;
		el_tooltip.parentNode.classList.remove('is-active');
		el_tooltip.parentNode.classList.remove('is-set');
	}
};
/*	======================================

		Accordion
		
		@param 	selector : css selector for accordions
		@param 	options {
					multiple : boolean (whether to allow multiple elements open or not, default false)
				}

========================================== */

groundWork.modules.Accordion = function(selector, options){
	
	// - - - - - - - - - - - - - - - - - - - - - - - -
	// Set options
	// - - - - - - - - - - - - - - - - - - - - - - - -	
	options.multiple = options.multiple ? options.multiple : false;
	this.options = options;
	
	// - - - - - - - - - - - - - - - - - - - - - - - -
	// Cache groundWork
	// - - - - - - - - - - - - - - - - - - - - - - - -
	
	var addClass = groundWork.utils.dom.addClass,
		removeClass = groundWork.utils.dom.addClass,
		forEach = groundWork.utils.dom.forEach,
		listenerManager = groundWork.listenerManager,
	
	// - - - - - - - - - - - - - - - - - - - - - - - -
	// Cache prototype functions and bind this
	// - - - - - - - - - - - - - - - - - - - - - - - -
	
	toggle = this.toggle.bind(this),
	update = this.update.bind(this);
	
	// - - - - - - - - - - - - - - - - - - - - - - - -
	// Bind events
	// - - - - - - - - - - - - - - - - - - - - - - - -
	
	this.els = Array.prototype.slice.call(document.querySelectorAll(selector));
	
	this.els.forEach(function(el){		
		listenerManager.bind([Array.prototype.slice.call(el.querySelectorAll('.accordion-trigger')), function(el){ el.addEventListener('click', toggle)}]);
	});
	
	
	// - - - - - - - - - - - - - - - - - - - - - - - -
	// Init
	// - - - - - - - - - - - - - - - - - - - - - - - -

	update();
	window.addEventListener('resize', update);
	
	
	
}

groundWork.modules.Accordion.prototype.toggle = function(event){
	var parent = event.currentTarget.parentNode,
		accordion_container = parent.parentNode;
		accordion_content = Array.prototype.slice.call(accordion_container.querySelectorAll('.accordion-content'))
		
	if(!this.options.multiple) {
		accordion_content.forEach(function(el){
			 groundWork.utils.dom.removeClass(el.parentNode, 'is-active');
		});
		accordion_content.forEach(function(el){
			el.style.height = '0';
		});
	}
	
	var content = parent.querySelector('.accordion-content');
	var height = content.scrollHeight;
	
	if(content.offsetHeight < 1) {
		content.style.height = height + 'px';
		groundWork.utils.dom.addClass(parent, 'is-active');
	}
	else {
		content.style.height = '0';
		groundWork.utils.dom.removeClass(parent, 'is-active');
	}
};

groundWork.modules.Accordion.prototype.update = function(){
	forEach(this.els, function(el) {
		forEach(el.querySelectorAll('.is-active .accordion-content'), function(el){
			el.style.transition = 'none';
			el.style.height = '';
			var height = el.scrollHeight;
			el.style.height = height + 'px';
			el.style.transition = '';
		});
	});
}

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
groundWork.modules.Editabler = function(el){
	var self = this,
		utils = groundWork.utils;
	this.el = document.getElementById(el);
	this.parent = this.el.parentNode;
	
	this.el.addEventListener('focus', function(event){
		utils.dom.addClass(self.parent, 'is-active');
	});
	
	this.el.addEventListener('blur', function(event){
		self.parent.classList.remove('is-active');
	});
	
	function createEditPanel() {
		var tools = [
			{
				title : 'H1',
				el : document.createElement('li'),
				tag : 'h1',
				type : 'block'
			},
			{
				title : 'H2',
				el : document.createElement('li'),
				tag : 'h2',
				type : 'block'
			},
			{
				title : 'H3',
				el : document.createElement('li'),
				tag : 'h3',
				type : 'block'
			},
			{
				title : 'H4',
				el : document.createElement('li'),
				tag : 'h4',
				type : 'block'
			},
			{
				title : 'P',
				el : document.createElement('li'),
				tag : 'p',
				type : 'block'
			},
			{
				title : 'UL',
				el : document.createElement('li'),
				tag : 'insertUnorderedList',
				type : 'command'
			},
			{
				title : 'Clear Formatting',
				el : document.createElement('li'),
				tag : 'removeFormat',
				type : 'command'
			}
		]
		var toolbar_wrapper = document.createElement('div');
		var edit_toolbar = document.createElement('ul');
		edit_toolbar.classList.add('edit-toolbar');
		toolbar_wrapper.classList.add('edit-toolbar-wrapper');
		toolbar_wrapper.appendChild(edit_toolbar);
		
		tools.forEach(function(tool){
			tool.el.innerHTML = tool.title;
			tool.el.setAttribute('data-tag', tool.tag);
			tool.el.setAttribute('data-type', tool.type);
			tool.el.addEventListener('mousedown', addTag);
			edit_toolbar.appendChild(tool.el);
		}); 
		self.parent.insertBefore(toolbar_wrapper, self.el);
		
		return edit_toolbar;
	}
	
	var edit_toolbar = createEditPanel();
	document.execCommand('styleWithCSS', true);
	function addTag(event){
		event.preventDefault();
		var tag = event.currentTarget.getAttribute('data-tag');
		var type = event.currentTarget.getAttribute('data-type');
    
		switch(type) {
			case 'block' :
				document.execCommand('formatBlock', false, tag);
				document.execCommand('removeFormat', false, null);
			break;
			case 'inline' :
			break;
			case 'command' :
				document.execCommand(tag, false, '');
				document.execCommand('removeFormat', false, null);
			break;
		}
	}
	
	document.addEventListener('optimizedScroll', alignEditToolbar);
	
	function alignEditToolbar(event) {
		var item_offset = utils.dom.cumulativeOffset(self.el);
		var scroll_pos = document.documentElement.scrollTop || document.body.scrollTop;
		if(item_offset.top < scroll_pos + edit_toolbar.offsetHeight) {
			edit_toolbar.style.width = edit_toolbar.offsetWidth + 'px';
			edit_toolbar.style.position = 'fixed';
		}
		else {
			edit_toolbar.style.position = 'relative';
		}
	}
}

groundWork.modules.GalleryUpload = function(el, options) {
	
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Cache GW utils
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	var utils = groundWork.utils;
	var dom = utils.dom;
	var createElement = dom.createElement;
	var addClass = dom.addClass;
	var removeClass = dom.removeClass;
	var forEach = dom.forEach;
	
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Init properties
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	
	var self = this;
	this.options = {
		item_class : options.item_class ? options.item_class : 'drag-img-item',
		upload_name : options.upload_name ? options.upload_name : 'file_upload',
		detail_name : options.detail_name ? options.detail_name : 'title',
		detail_label : options.detail_label ? options.detail_label : 'Title',
	}
	
	this.el = document.getElementById(el);
	this.input = [this.el.querySelector('input')];
	this.files = [];
	this.count = 0;
	self.imageDropZone();
}

groundWork.modules.GalleryUpload.prototype.addFile = function(){
	
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Cache GW utils
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	var createElement = groundWork.utils.dom.createElement;
	
	this.count ++;
	var count = this.count
	var input = this.input[count] = createElement('input', '', 'gallery-upload-file', [{name : 'name', value : this.options.upload_name + '[]'}, {name : 'type', value : 'file'}]);
	input.style.display = 'none';
	this.el.insertBefore(this.input[this.count], this.input[this.count - 1]);
	this.imageDropZone();
	return  this.input[Number(this.count - 1)];
}

// Upload drag and drop functions
groundWork.modules.GalleryUpload.prototype.imageDropZone = function(){
	
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Cache GW utils
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	var utils = groundWork.utils;
	var dom = utils.dom;
	var createElement = dom.createElement;
	var addClass = dom.addClass;
	var removeClass = dom.removeClass;
	var forEach = dom.forEach;
	
	var self = this;
	inputEl = self.input[self.count];
	inputEl.addEventListener('change', handleImage, false);
	inputEl.addEventListener("dragleave", FileDragOut, false);
	inputEl.addEventListener("drop", FileDragOut, false);
	this.el.addEventListener('dragenter', FileDragHover, false);
		
	function FileDragHover(event) {
		addClass(self.el, 'image-over');
	}
	
	function FileDragOut(event) {
		removeClass(self.el, 'image-over');
	}
	
	function handleImage(event) {
		var reader = new FileReader();
		var files = event.target.files;
		reader.onload = function (e) {	        
	    	//Create
	    	var preview_img = event.target.parentNode,
	    		upload_item = createElement('div',  null, 'gallery-item ' + self.options.item_class),
	    		checkbox = createElement('input',  null, 'remove-upload-item', [{name :'type', value : 'checkbox'}, {name : 'value', value : 'nosave'}]),
	    		detailinput = createElement('div', null, 'add-detail'),
	    		img = document.createElement('img');
	    	
	    	//Define
	    	img.setAttribute('src', e.target.result);
	    	
	    	//Append
	    	upload_item.appendChild(checkbox);
	    	upload_item.appendChild(img);
	    	upload_item.appendChild(detailinput);
	    	preview_img.appendChild(upload_item);
	    	detailinput.innerHTML = '<input type="text" name="'+ self.options.detail_name +'[]" placeholder="'+ self.options.detail_label +'"><i class="icon"></i>';
	    	
	    	var file_input = self.addFile();
	    	
	    	// Events
	    	checkbox.addEventListener('click', function(event){
		    	if(event.target.checked == true) {
			    	file_input.disabled = true;
			    	upload_item.setAttribute('data-nosave', true);
		    	}else {
			    	file_input.disabled = false;
			    	upload_item.removeAttribute('data-nosave');
		    	}
	    	});
		}
		reader.readAsDataURL(event.target.files[0]);
	}
}
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

/*	======================================

		Loader Constructor

========================================== */


groundWork.modules.loader = (function(){
	// private
	var utils = groundWork.utils,
	module = {
		loading : false,
		el : false,
		open : function(append_el, options) {
			var append_el = append_el ? append_el : document.body;
			if(!this.el) {
				this.el = utils.createElement('div', 'pinner-loader', null, append_el);
				loader.style.marginLeft = (-(loader.offsetWidth/2) + 'px');
				loader.style.marginTop = (-(loader.offsetHeight/2) + 'px');
				addClass(body, 'loading');
			}
		},
		close : function() {// Closes the loader
			this.loading = false;
			addClass(loader, 'close');
			removeClass(body, 'loading');
			if(this.el)	killElement(this.el, groundWork.options.animation_time);
		}
	};
	return module;
})();
/* ===========================================

		Modal Panel

=============================================*/

groundWork.modules.modal = (function() {
	// locals
	
	var module = {};
	
	module.locals = {
			modal : {}, // Panel Node
			dialog : {}, // Dialog Node
			slat : {
				container : false,
				messages : []
			},
			panel : {
				el : false,
				options : {},
			},
			toast : {
				container : false,
				messages : []
			},
			open : false, // Is Panel Open
			dialog_open : false,
			toast_open : false
		}
		
	module.options = {
		close_btn_content : '<i class="icon-close"></i>',
		content_container_class : 'modal-content',
		animation_time : 300
	};
	
	// Cache
	
	var options = module.options;
	var locals = module.locals;
	var utils = groundWork.utils;
	
	/* --------------------------------------------------
		
		Helper Functions
	
	-------------------------------------------------- */
	
	// Remove element from dom after set time
	module.killElement = function(element, done) {
		utils.dom.removeClass(element, 'is-open');
		setTimeout(function(){
			element.remove();
			element = false;
			if(typeof done == 'function') done();
		}, options.animation_time);
	}
	
	// Create Modal elements
	module.createModal = function(class_stack) {
		// Create modal
		class_stack = class_stack ? 'modal ' + class_stack : 'modal';
		module.locals.modal.container = utils.dom.createElement('div', '', class_stack);
		
		// Add close btn
		var closebtn = utils.dom.createElement('button', '', 'modal-close modal-btn');
		closebtn.addEventListener('click', function(event){
			module.closeModal();
		});
			
		// Add content container
		module.locals.modal.content = utils.dom.createElement('div', '', options.content_container_class);
		module.locals.modal.container.appendChild(closebtn);
		module.locals.modal.container.appendChild(module.locals.modal.content);
		module.locals.modal.slides = [];
		// Add modal to dom
		document.body.appendChild(module.locals.modal.container);
	}
	
	/* --------------------------------------------------
		
		Modal
	
	-------------------------------------------------- */
	
	module.open = function(content, options, done) {
		if(!module.locals.modal.container) {
			var defaults = {
				style : 'simple',
				position :'bottom',
				overlay : true,
				width : 'auto',
				height : 'auto',
			}
			// Set Default Options
			if(typeof options == 'object') {
				options.style = options.style ? options.style : defaults.style;
				options.position = options.position ? options.position : defaults.position;
				options.width = options.width ? options.width : defaults.width;
				options.height = options.height ? options.height : defaults.height;
			}else {
				options = defaults;
			}
			
			module.createModal(options.style + ' ' + options.position);
			module.locals.modal.container.style.width = options.width;
			module.locals.modal.container.style.height = options.height;
			module.locals.modal.slides = [utils.dom.appendElement('div', content, 'modal-slide', module.locals.modal.content)];
			
			if(options.overlay) {
				utils.dom.addClass(document.body, 'is-overlay');
			}
			utils.dom.addClass(document.body, 'modal-open');
			
			// Finally show modal
			window.setTimeout(function(){
				if(typeof done == 'function') done();
				utils.dom.addClass(module.locals.modal.container, 'is-open');
			}, 10);
		}else {
			module.loadSlide(content, done);
		}
	}
	
	module.loadContent = function(url, options) {
		var defaults = {
			height : '400px'
		}
		if(typeof options == 'object'){
			options.height = options.height ? options.height : defaults.height;
		}else {
			options = defaults;
		}
		module.open('', options);
		utils.dom.addClass(module.locals.modal.container, 'loading');
		groundWork.ajax.post({
			url: url,
			success: function(res){
			utils.dom.removeClass(module.locals.modal.container, 'loading');
				module.locals.modal.slides[module.locals.modal.slides.length - 1].innerHTML = res;
				var h = module.locals.modal.slides[module.locals.modal.slides.length - 1].offsetHeight;
				var w = module.locals.modal.slides[module.locals.modal.slides.length - 1].offsetWidth;
				module.locals.modal.container.style.width = w + 'px';
				module.locals.modal.container.style.height = h + 'px';
			},
			err : function(err){
				module.toast(err, 3000);
			}
		});
	}
	
	module.loadSlide = function(content, done) {
		var slide = module.locals.modal.slides.length;
		// If no slides have yet been enabled
		if(slide == 1) {
			// Set static width
			var back_btn = utils.dom.createElement('button', '', 'modal-prev modal-btn');
			var w = module.locals.modal.container.offsetWidth;
			
			module.locals.modal.container.appendChild(back_btn);
			back_btn.addEventListener('click', module.prev);
			
			module.locals.modal.container.style.width = w + 'px';
			
			module.locals.modal.container
			// Enable slider class styles for modal
			utils.dom.addClass(module.locals.modal.content, 'is-slider');
		}
		module.locals.modal.slides[slide] = utils.dom.appendElement('div', content, 'modal-slide slide-' + slide, module.locals.modal.content);
		module.slide(slide, done);
	};

	module.slide = function(slide, done) {//Record history
		module.locals.modal.container.setAttribute('data-slide', slide);
		var w = module.locals.modal.container.offsetWidth;
		module.locals.modal.content.style.transform = 'translateX(-' + w * slide + 'px)';
		setTimeout(function(){
			if(typeof done == 'function') done();
		}, locals.animation_time);
	};
	
	module.next = function(done){
		var slide = Number(module.locals.modal.container.getAttribute('data-slide')) + 1;
		
		if(slide < module.locals.modal.slides.length) {
			module.slide(slide, done);
		}
	}
	
	module.prev = function(done){
		var slide = Number(module.locals.modal.container.getAttribute('data-slide')) -1;
		console.log(slide);
		if(slide >= 0) {
			module.slide(slide, done);
		}
	}
	
	// Closes panel and removes content
	module.closeModal = function(element) {
		utils.dom.removeClass(document.body, 'modal-open');	
		utils.dom.removeClass(document.body, 'is-overlay');
		utils.dom.removeClass(element, 'is-open');
		
		utils.dom.killElement(module.locals.modal.container, 300, false, function(){
			module.locals.modal.container = false;
		});
	};
	
	/* --------------------------------------------------
		
		Dialog Box
		
		dialog(content, options)
		
		@param 	content : @string
		@param 	options {
				title :
				buttons : [{
					title : @string,
					handler :  @function
				}]
				fields : [{
					type : @string ['text' | 'select'],
					label : @string,
					handler : {
						type : @string [any event listener type],
						action : @function
					},
					options : [ //Only applies to select types
						{
							label : @string,
							value : @string
						}
					]
				}],
				submit : @function
			}
	-------------------------------------------------- */

	module.dialog = function(content, options, done){
		clearTimeout(locals.closeTimer);
		
		// Default Options
		var defaults = {
			title : false,
			buttons : [{
				title : 'Ok',
				handler : function (){
					module.closeDialog();
				}
			}],
			fields : false
		}
		
		if(typeof options == 'function') { 
			done = options;
			options = defaults;
		}
		else if(typeof options == 'object') {
			options.title = options.title ? options.title : defaults.title;
			options.buttons = options.buttons ? options.buttons : defaults.buttons;
			options.fields = options.fields ? options.fields : defaults.fields;
			
		}else {
			options = defaults;
		}
		
		// Init Dialog
		locals.dialog = utils.dom.createElement('div','',  'dialog')
		document.body.appendChild(locals.dialog);
		
		// Title
		if(options.title) {
			var message = utils.dom.createElement('div', '', 'title');
			message.innerHTML = options.title;
			locals.dialog.appendChild(message);
		}
		
		// Content
		if(content) {
			var content_el = utils.dom.createElement('div', '',  'message');
			content_el.innerHTML = content;
			locals.dialog.appendChild(content_el);
		}
		
		// Add fields, if any
		if(options.fields) {
			var fields = utils.dom.createElement('form','', 'dialog-fields');		
			
			options.fields.forEach(function(element, i){
				switch(element.type) {
					case 'text' :
						var field = utils.dom.createElement('input', '', 'field-element', [{name : 'type', value : 'text'}, {name : 'name', value : element.name}, {name : 'placeholder', value : element.label}]);
					break;
					case 'select':
						var field = utils.dom.createElement('select', '', 'field-element', [{name : 'name', value : element.name}]);
						var options = '<option value="">' + element.label + '</option>';
						element.options.forEach(function(option, index){
							options += '<option value="'+ option.value +'">'+ option.label +'</option>';
						});
						field.innerHTML = options;
					break;
				} 
				
				element.el = field;
				
				if(typeof field.handler == 'object') field.addEventListener(field.handler.type, field.handler.action);
				fields.appendChild(field);
			});
			if(typeof options.submit == 'function') fields.addEventListener('submit', options.submit);
			locals.dialog.appendChild(fields);
		}
		
		// Add buttons, if any
		if(options.buttons) {
			var buttons = utils.dom.createElement('div', '', 'dialog-buttons');
			
			options.buttons.forEach(function(element, i){
				var button = utils.dom.createElement('button');
				button.innerHTML = element.title;
				button.addEventListener('click', element.handler);
				buttons.appendChild(button);
			});
			if(fields) fields.appendChild(buttons);
			else locals.dialog.appendChild(buttons);
		}
		
		utils.dom.addClass(locals.dialog,'is-open');
		if(fields) options.fields[0].el.focus();
	}
		
	// Closes panel and removes content
	module.closeDialog = function(element) {
		utils.dom.removeClass(document.body, 'dialog-open');	
		utils.dom.removeClass(document.body, 'is-overlay');
		killElement(locals.dialog, function(){
			locals.dialog = false;
		});
	};
	
	/* ---------------------------------------------

		Slat
	
	-----------------------------------------------*/ 
	
	module.slat = function(content, time){
		var slat_count = Number(locals.slat.messages.length);
		
		// - - - - - - - - - - - - - - - - - - - - - -
		// Create slat container
		// - - - - - - - - - - - - - - - - - - - - - - 
		
		if(!locals.slat.container) {
			locals.slat.container = utils.dom.createElement('div', '', 'slat-container');
			document.body.appendChild(locals.slat.container);
		}
		
		// - - - - - - - - - - - - - - - - - - - - - -
		// Append slat to container
		// - - - - - - - - - - - - - - - - - - - - - - 
		
		var this_slat = utils.dom.createElement('div','', 'slat', null, locals.slat.container);
			utils.dom.createElement('div', content, 'slat-content', null, this_slat);		
			locals.slat.messages.push(this_slat);
		
		// - - - - - - - - - - - - - - - - - - - - - -
		// Close slat button
		// - - - - - - - - - - - - - - - - - - - - - - 
		
		var close_slat = utils.dom.appendElement('button', '', 'close-slat', this_slat);
			
		close_slat.addEventListener('click', function(){
			console.log(locals.slat.messages.indexOf(this_slat));
			killSlat(this_slat);
		});
		
		// - - - - - - - - - - - - - - - - - - - - - -
		// Open slat
		// - - - - - - - - - - - - - - - - - - - - - - 
		
		window.setTimeout(function(){
			utils.dom.addClass(this_slat, 'is-open');
			this_slat.style.height = this_slat.scrollHeight + 'px';
		}, 5);
		
		// - - - - - - - - - - - - - - - - - - - - - -
		// Close timer
		// - - - - - - - - - - - - - - - - - - - - - - 
		
		if(time) {
			setTimeout(function(){
				utils.dom.addClass(this_slat, 'is-closed');
				killSlat(locals.slat.messages[slat_count]);
			}, time);
		}
		
		function killSlat(element) {
			var index = locals.slat.messages.indexOf(element);
			utils.dom.addClass(element, 'is-closed');
			element.style.height = '0';
			setTimeout(function(){
				element.remove();
				
				if(locals.slat.container.children.length == 0) {
					locals.slat.messages = [];
					locals.slat.container.remove();
					locals.slat.container = false;
				}
			}, options.animation_time);
		}

	}
	
	/* ---------------------------------------------
	
		Panel
	
	-----------------------------------------------*/ 
	
	module.panel = function(content, options){
		
		// - - - - - - - - - - - - - - - - - - - -
		// Set Options
		// - - - - - - - - - - - - - - - - - - - -
		
		var defaults = {
			position : 'bottom',
			container : document.querySelector('#body-wrapper'),
			size : 33.33,
		};
		
		if(typeof options == 'object') {
			options = {
				position : options.position ? options.position : defaults.position,
				size : options.size ? options.size : defaults.size,
				container : options.container ? document.querySelector(options.container) : defaults.container
			}
		}else {
			options = defaults;
		}
		
		// - - - - - - - - - - - - - - - - - - - -
		// Create Panel
		// - - - - - - - - - - - - - - - - - - - -
		
		if(!locals.panel.el) {
			locals.panel.el = utils.dom.createElement('div', '', 'modal-panel ' + options.position);
			var panel_content = utils.dom.appendElement('div', content, 'modal-panel-content', locals.panel.el);
			
			document.body.appendChild(locals.panel.el);
			locals.panel.options = options;
		}
		
		setTimeout(function(){
			switch(options.position) {
				case 'top' :
					panel_content.style.height = options.size + 1 + 'vh';
					locals.panel.el.style.height = options.size + 1 + 'vh';
					options.container.style.transform = 'translateY(' + options.size + 'vh)';
				break;
				case 'bottom' :
					panel_content.style.height = options.size  + 1 + 'vh';
					locals.panel.el.style.height = options.size  + 1 + 'vh';
					options.container.style.transform = 'translateY(-' + options.size + 'vh)';
				break;
				case 'left' :
					panel_content.style.width = options.size  + 1 + 'vw';
					locals.panel.el.style.width = options.size  + 1 + 'vw';
					options.container.style.transform = 'translateX(' + options.size + 'vw)';
				break;
				case 'right' :
					panel_content.style.width = options.size  + 1 + 'vw';
					locals.panel.el.style.width = options.size  + 1 +  'vw';
					options.container.style.transform = 'translateX(-' + options.size + 'vw)';
				break;
			}
			utils.dom.addClass(locals.panel.el, 'is-open');
			utils.dom.addClass(document.body, 'panel-open');
		}, 15);
		
	}
	
	module.closePanel = function(){
		
		switch(locals.panel.options.position) {
			case 'top' :
				locals.panel.el.style.height = '0px';
			break;
			case 'bottom' :
				locals.panel.el.style.height = '0px';
			break;
			case 'left' :
				locals.panel.el.style.width = '0px';
			break;
			case 'right' :
				locals.panel.el.style.width = '0px';
			break;
		}
		
		locals.panel.options.container.style.transform = '';
		
		utils.dom.removeClass(document.body, 'panel-open');
		utils.dom.removeClass(locals.panel.el, 'is-open');
		
		utils.dom.killElement(locals.panel.el, 300, false, function(){
			locals.panel.el = false;
		});
	};
	
	/* ---------------------------------------------
	
		Toast
	
	-----------------------------------------------*/ 
	
	module.toast = function(content, time){
		var toast_count = Number(locals.toast.messages.length);
		// Init Dialog
		if(!locals.toast.container) {
			locals.toast.container = utils.dom.createElement('div', '', 'toast-container');
			document.body.appendChild(locals.toast.container);
		}
		
		locals.toast.messages[toast_count] = utils.dom.createElement('div', '', 'toast', locals.toast.container);
		locals.toast.messages[toast_count].innerHTML = content;
		locals.toast.container.insertBefore(locals.toast.messages[toast_count], locals.toast.messages[toast_count-1]);
		
		window.setTimeout(function(){
			utils.dom.addClass(locals.toast.messages[toast_count], 'is-open');
		}, 5);
		window.setTimeout(function(){
			utils.dom.addClass(locals.toast.messages[toast_count], 'is-closed');
			killToast(locals.toast.messages[toast_count]);
		}, time);
		
		killToast = function(element) {
			var index = locals.toast.messages.indexOf(element);
			utils.dom.addClass(element, 'is-closed');
			setTimeout(function(){
				element.remove();
				if(index == locals.toast.messages.length - 1) {
					console.log('Kill container');
					locals.toast.messages = [];
					locals.toast.container.remove();
					locals.toast.container = false;
				}
			}, options.animation_time);
		}
	}
	
	return module;
})();

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
groundWork.modules.selectButton = function selectButton(selector, options){
	var self = this;
	var elements = document.querySelectorAll(selector);
	for(i=0; i < elements.length; i++) {
		var title = document.createElement('span');
		var title_text = elements[i].options[0].text;
		addClass(title, 'title');
		title.innerHTML = title_text;
		
		elements[i].parentNode.appendChild(title);
		
		if(elements[i].hasAttribute('data-change-label')) {
			elements[i].addEventListener('change', selectHandler);
		}
	}
	
	function selectHandler(event){
		var element = event.currentTarget;
		var title = element.hasAttribute('data-default') ?  element.getAttribute('data-default') : element.options[element.selectedIndex].text;
		var label = element.parentNode.querySelector('.title');
		label.innerHTML = title;
	}
}
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
/*	======================================

		Sticky

========================================= */

groundWork.modules.Sticky = function Sticky(el, options) {
	
	// - - - - - - - - - - - - - - - - - - - - - - - -
	// Set options
	// - - - - - - - - - - - - - - - - - - - - - - - -	
	
	this.options = options;
	
	// - - - - - - - - - - - - - - - - - - - - - - - -
	// Cache groundWork
	// - - - - - - - - - - - - - - - - - - - - - - - -

	
	var dom = groundWork.utils.dom,
		els = document.querySelectorAll(el);
	
	// - - - - - - - - - - - - - - - - - - - - - - - -
	// Cache and bind constructor functions
	// - - - - - - - - - - - - - - - - - - - - - - - -
	
		resizeSticky 	= this.resizeSticky.bind(this),
		makeSticky 		= this.makeSticky.bind(this);
	
	// - - - - - - - - - - - - - - - - - - - - - - - -
	// Cache elements and positions
	// - - - - - - - - - - - - - - - - - - - - - - - -
	
	this.els = [];
	for(i=0; i < els.length; i++) {
		var el = els[i];
		var item_offset = dom.cumulativeOffset(el);
		var el_obj = { el : el, offset : item_offset};
		if(el.hasAttribute('data-contain')){
			var container = document.getElementById((el.getAttribute('data-contain')));
			var container_offset = dom.cumulativeOffset(container);
			var stop = container_offset.top + container.offsetHeight - el.offsetHeight;
			el_obj.container = container;
			el_obj.container_offset = container_offset;
			el_obj.stop = stop;
		}
		this.els.push(el_obj);
	}
	
	var headerHeight = document.querySelector('.js-header');
	
	document.addEventListener('scroll', makeSticky);
	document.addEventListener('resize', resizeSticky);
}


groundWork.modules.Sticky.prototype.resizeSticky = function(){
	
	// - - - - - - - - - - - - - - - - - - - - - - - -
	// Cache groundWork
	// - - - - - - - - - - - - - - - - - - - - - - - -
	
	var dom = groundWork.utils.dom;
	
	for(i=0; i < this.els.length; i++) {
		var item = this.els[i];
		item.offset = dom.cumulativeOffset(el);
		if(item.hasAttribute('data-contain')){
			var container_offset = dom.cumulativeOffset(item.container);
			var stop = container_offset.top + item.container.offsetHeight - el.offsetHeight;
			item.container_offset = item.container_offset;
			item.stop = stop;
		}
		if(item.el.classList.contains('stickied')){
			item.el.style.position = 'relative';
			item.el.style.width = '';
			item.el.style.width = item.el.offsetWidth + 'px'
			item.el.style.position = '';
		}
	}
}
	
groundWork.modules.Sticky.prototype.makeSticky = function(event) {
	
	// - - - - - - - - - - - - - - - - - - - - - - - -
	// Cache groundWork
	// - - - - - - - - - - - - - - - - - - - - - - - -
	var dom = groundWork.utils.dom,
	scroll_pos = document.documentElement.scrollTop || document.body.scrollTop;
	for(i=0; i < this.els.length; i++) {
		var item = this.els[i];
		if(item.container){			
			if(scroll_pos > item.container_offset.top && scroll_pos < item.stop) {
				if(!item.el.classList.contains('stickied')){
					item.el.style.width = item.el.offsetWidth + 'px';
					dom.addClass(item.el, 'stickied');
				}
			}
			else{
				if(item.el.classList.contains('stickied')){
					container.style.paddingTop = '';
					dom.removeClass(item.el, 'stickied');
					item.el.style.top = '';
					item.el.style.width = ''
				}
			}
		}
		
		else {
			var offset_top = item.el.getAttribute('data-offset') ? item.el.getAttribute('data-offset') : 0;
			var start_top = item.el.hasAttribute('data-header-start') ? headerHeight.offsetHeight : 0;
			
			
			if(item.el.hasAttribute('data-header-offset')) offset_top = offset_top + headerHeight.offsetHeight;
			
			if(item.offset.top < scroll_pos + offset_top - start_top ) {
				item.el.style.width = item.el.offsetWidth + 'px';
				dom.addClass(item.el, 'stickied');
				item.el.style.top = offset_top + 'px';
			}
			else {
				dom.removeClass(item.el, 'stickied');
				item.el.style.top = '';
				item.el.style.width = ''
			}
		}
	};
}

/*	======================================

		Tabs v1
		
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

groundWork.modules.Tabs = function(el, options){
	
	var el = document.getElementById(el);
	if(!el) return null;
	
	// - - - - - - - - - - - - - - - - - - - -
	// Define
	// - - - - - - - - - - - - - - - - - - - -
	
	this.el = el;
	this.current_tab = 0;
	
	// - - - - - - - - - - - - - - - - - - - -
	// Cache groundWork utils
	// - - - - - - - - - - - - - - - - - - - -
	
	var forEach = groundWork.utils.dom.forEach,
		addClass = groundWork.utils.dom.addClass,
		removeClass = groundWork.utils.dom.removeClass;
	
	// - - - - - - - - - - - - - - - - - - - -
	// Set Options
	// - - - - - - - - - - - - - - - - - - - -
	
	var defaults = {
		navigation : el.querySelector('.tab-nav'),
		next : el.querySelector('.tab-next'),
		prev : el.querySelector('.tab-prev')
	};
	
	if(typeof options == 'object') {
		options = {
			navigation : options.navigation ? document.querySelector(navigation.options) : defaults.navigation,
			next : options.navigation ?  document.querySelector(navigation.next) : defaults.next,
			prev : options.navigation ?  document.querySelector(navigation.prev) : defaults.prev,
		}
	}else {
		options = defaults;
	}
	
	// - - - - - - - - - - - - - - - - - - - -
	// Cache Tab Panes and Navigation items
	// - - - - - - - - - - - - - - - - - - - -
	
	this.panes = [].slice.call(el.querySelectorAll('.tab-pane')),
	this.navigation = [].slice.call(options.navigation.querySelectorAll('[href]'));
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Wrap functions to mainain instance reference on events
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	
	var next = this.next.bind(this),
		prev = this.prev.bind(this),
		goTo = this.goTo.bind(this),
		listeners = (function() {
			for(i=0; i < this.panes.length ; i ++) {
				var hash = '#' + this.panes[i].id;
				var targets = [].slice.call(document.querySelectorAll('[href="'+ hash +'"]'));
				for(t=0 ; t < targets.length; t ++) {
					targets[t].addEventListener('click', goTo);
				}
			}
		}).bind(this);
	
	
	
	// - - - - - - - - - - - - - - - - - - - -
	// Add handlers
	// - - - - - - - - - - - - - - - - - - - -
	
	groundWork.listenerManager.bind([this.el, listeners]);
	
	if (options.next) groundWork.listenerManager.bind([options.next, function(el) { el.addEventListener('click', next, true)}]);
	if (options.prev) groundWork.listenerManager.bind([options.prev, function(el) { el.addEventListener('click', prev, true)}]);
	
	// - - - - - - - - - - - - - - - - - - - -
	//	Activate
	// - - - - - - - - - - - - - - - - - - - -
	
	this.activateTab(this.panes[0]);
};

// - - - - - - - - - - - - - - - - - - - -
// Add Functions to the constructor's prototype
// - - - - - - - - - - - - - - - - - - - -

groundWork.modules.Tabs.prototype.goTo = function(e){
	e.preventDefault();
	var target = this.el.querySelector(e.target.getAttribute('href'));
	this.activateTab(target);
}

groundWork.modules.Tabs.prototype.next = function(e){
	e.preventDefault();
	this.current_tab = this.current_tab < this.panes.length -1 ? this.current_tab + 1 : 0;
	var target = this.panes[this.current_tab];
	this.activateTab(target)
}

groundWork.modules.Tabs.prototype.prev = function(e){
	e.preventDefault();
	this.current_tab = this.current_tab > 0 ? this.current_tab - 1 : this.panes.length - 1;
	var target = this.panes[this.current_tab];
	this.activateTab(target);
}

groundWork.modules.Tabs.prototype.activateTab = function(target) {
	
	// - - - - - - - - - - - - - - - - - - - -
	// Cache groundWork tools
	// - - - - - - - - - - - - - - - - - - - -
	
	var addClass = groundWork.utils.dom.addClass,
		removeClass = groundWork.utils.dom.removeClass,
		ajax = groundWork.ajax,
	
	// - - - - - - - - - - - - - - - - - - - -
	// Set local vars
	// - - - - - - - - - - - - - - - - - - - -
	
		i = this.panes.indexOf(target),
		nav_tab = this.navigation[i],
		pane_h = this.panes[i].offsetHeight;
	
	
	// - - - - - - - - - - - - - - - - - - - -
	// Set instance vars
	// - - - - - - - - - - - - - - - - - - - -
	
	this.current_tab = i;
	
	// - - - - - - - - - - - - - - - - - - - -
	// Loop through all tab panes and activate/deactivate/position-class each pane and it's associated nav element.
	// - - - - - - - - - - - - - - - - - - - -
	
	for(p=0; p < this.panes.length; p++) {
		if(p < i) {
			removeClass(this.navigation[p].parentNode, 'is-active');
			removeClass(this.panes[p], 'is-next is-active');
			addClass(this.panes[p], 'is-prev');
		}
		else if(p > i) {
			removeClass(this.navigation[p].parentNode, 'is-active');
			removeClass(this.panes[p], 'is-prev is-active');
			addClass(this.panes[p], 'is-next');
		}
		else if(p == i) {
			addClass(this.navigation[p].parentNode, 'is-active');
			removeClass(this.panes[p], 'is-prev is-next');
			addClass(this.panes[p], 'is-active');
		}
	}
	
	addClass(target, 'is-active');
	addClass(nav_tab, 'is-active');
	
	// - - - - - - - - - - - - - - - - - - - -
	// Load in content if tab pane has data-url
	// - - - - - - - - - - - - - - - - - - - -
	
	if(target.dataset.url) {
		ajax.loadView(target.dataset.url, this.panes[i], function(){
			pane_h = target.offsetHeight;
			target.parentNode.style.height = pane_h + 'px';
		});
		target.dataset.url = '';
	}else {
		this.panes[i].parentNode.style.height = pane_h + 'px';
	}
}
/*	======================================

		YOU TUBE

========================================== */


// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function getYouTubeId(url) {
	var you_regex = /http:\/\/(?:youtu\.be\/|(?:[a-z]{2,3}\.)?youtube\.com\/watch(?:\?|#\!)v=)([\w-]{11}).*/gi;
	var video_id = you_regex.exec(url);
	return match[0];
}

//**Event
function videoModalClickEvent(event) {	
	var attr = event.target.getAttribute('data-video-url');
	var player;
	function onYouTubeIframeAPIReady() {
		player = new YT.Player('youtube-video-player', {
			videoId: '',
			height: '1080',
			width: '1920',
			events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			}
		});
	}
	player.loadVideoById('sqBCNjYKMI0');
	modalOpen(attr);
	event.preventDefault();
}

// Close video
function videoClose(element, index){
	element.addEventListener('click',videoCloseEvent);
}

//**Event
function videoCloseEvent(event) {	
		modalClose();
		document.getElementById('youtube-video-player').innerHTML = '';
		event.preventDefault();
}
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dragula = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var cache = {};
var start = '(?:^|\\s)';
var end = '(?:\\s|$)';

function lookupClass (className) {
  var cached = cache[className];
  if (cached) {
    cached.lastIndex = 0;
  } else {
    cache[className] = cached = new RegExp(start + className + end, 'g');
  }
  return cached;
}

function addClass (el, className) {
  var current = el.className;
  if (!current.length) {
    el.className = className;
  } else if (!lookupClass(className).test(current)) {
    el.className += ' ' + className;
  }
}

function rmClass (el, className) {
  el.className = el.className.replace(lookupClass(className), ' ').trim();
}

module.exports = {
  add: addClass,
  rm: rmClass
};

},{}],2:[function(require,module,exports){
(function (global){
'use strict';

var emitter = require('contra/emitter');
var crossvent = require('crossvent');
var classes = require('./classes');
var doc = document;
var documentElement = doc.documentElement;

function dragula (initialContainers, options) {
  var len = arguments.length;
  if (len === 1 && Array.isArray(initialContainers) === false) {
    options = initialContainers;
    initialContainers = [];
  }
  var _mirror; // mirror image
  var _source; // source container
  var _item; // item being dragged
  var _offsetX; // reference x
  var _offsetY; // reference y
  var _moveX; // reference move x
  var _moveY; // reference move y
  var _initialSibling; // reference sibling when grabbed
  var _currentSibling; // reference sibling now
  var _copy; // item used for copying
  var _renderTimer; // timer for setTimeout renderMirrorImage
  var _lastDropTarget = null; // last container item was over
  var _grabbed; // holds mousedown context until first mousemove

  var o = options || {};
  if (o.moves === void 0) { o.moves = always; }
  if (o.accepts === void 0) { o.accepts = always; }
  if (o.invalid === void 0) { o.invalid = invalidTarget; }
  if (o.containers === void 0) { o.containers = initialContainers || []; }
  if (o.isContainer === void 0) { o.isContainer = never; }
  if (o.copy === void 0) { o.copy = false; }
  if (o.copySortSource === void 0) { o.copySortSource = false; }
  if (o.revertOnSpill === void 0) { o.revertOnSpill = false; }
  if (o.removeOnSpill === void 0) { o.removeOnSpill = false; }
  if (o.direction === void 0) { o.direction = 'vertical'; }
  if (o.ignoreInputTextSelection === void 0) { o.ignoreInputTextSelection = true; }
  if (o.mirrorContainer === void 0) { o.mirrorContainer = doc.body; }

  var drake = emitter({
    containers: o.containers,
    start: manualStart,
    end: end,
    cancel: cancel,
    remove: remove,
    destroy: destroy,
    canMove: canMove,
    dragging: false
  });

  if (o.removeOnSpill === true) {
    drake.on('over', spillOver).on('out', spillOut);
  }

  events();

  return drake;

  function isContainer (el) {
    return drake.containers.indexOf(el) !== -1 || o.isContainer(el);
  }

  function events (remove) {
    var op = remove ? 'remove' : 'add';
    touchy(documentElement, op, 'mousedown', grab);
    touchy(documentElement, op, 'mouseup', release);
  }

  function eventualMovements (remove) {
    var op = remove ? 'remove' : 'add';
    touchy(documentElement, op, 'mousemove', startBecauseMouseMoved);
  }

  function movements (remove) {
    var op = remove ? 'remove' : 'add';
    crossvent[op](documentElement, 'selectstart', preventGrabbed); // IE8
    crossvent[op](documentElement, 'click', preventGrabbed);
  }

  function destroy () {
    events(true);
    release({});
  }

  function preventGrabbed (e) {
    if (_grabbed) {
      e.preventDefault();
    }
  }

  function grab (e) {
    _moveX = e.clientX;
    _moveY = e.clientY;

    var ignore = whichMouseButton(e) !== 1 || e.metaKey || e.ctrlKey;
    if (ignore) {
      return; // we only care about honest-to-god left clicks and touch events
    }
    var item = e.target;
    var context = canStart(item);
    if (!context) {
      return;
    }
    _grabbed = context;
    eventualMovements();
    if (e.type === 'mousedown') {
      if (isInput(item)) { // see also: https://github.com/bevacqua/dragula/issues/208
        item.focus(); // fixes https://github.com/bevacqua/dragula/issues/176
      } else {
        e.preventDefault(); // fixes https://github.com/bevacqua/dragula/issues/155
      }
    }
  }

  function startBecauseMouseMoved (e) {
    if (!_grabbed) {
      return;
    }
    if (whichMouseButton(e) === 0) {
      release({});
      return; // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
    }
    // truthy check fixes #239, equality fixes #207
    if (e.clientX !== void 0 && e.clientX === _moveX && e.clientY !== void 0 && e.clientY === _moveY) {
      return;
    }
    if (o.ignoreInputTextSelection) {
      var clientX = getCoord('clientX', e);
      var clientY = getCoord('clientY', e);
      var elementBehindCursor = doc.elementFromPoint(clientX, clientY);
      if (isInput(elementBehindCursor)) {
        return;
      }
    }

    var grabbed = _grabbed; // call to end() unsets _grabbed
    eventualMovements(true);
    movements();
    end();
    start(grabbed);

    var offset = getOffset(_item);
    _offsetX = getCoord('pageX', e) - offset.left;
    _offsetY = getCoord('pageY', e) - offset.top;

    classes.add(_copy || _item, 'gu-transit');
    renderMirrorImage();
    drag(e);
  }

  function canStart (item) {
    if (drake.dragging && _mirror) {
      return;
    }
    if (isContainer(item)) {
      return; // don't drag container itself
    }
    var handle = item;
    while (getParent(item) && isContainer(getParent(item)) === false) {
      if (o.invalid(item, handle)) {
        return;
      }
      item = getParent(item); // drag target should be a top element
      if (!item) {
        return;
      }
    }
    var source = getParent(item);
    if (!source) {
      return;
    }
    if (o.invalid(item, handle)) {
      return;
    }

    var movable = o.moves(item, source, handle, nextEl(item));
    if (!movable) {
      return;
    }

    return {
      item: item,
      source: source
    };
  }

  function canMove (item) {
    return !!canStart(item);
  }

  function manualStart (item) {
    var context = canStart(item);
    if (context) {
      start(context);
    }
  }

  function start (context) {
    if (isCopy(context.item, context.source)) {
      _copy = context.item.cloneNode(true);
      drake.emit('cloned', _copy, context.item, 'copy');
    }

    _source = context.source;
    _item = context.item;
    _initialSibling = _currentSibling = nextEl(context.item);

    drake.dragging = true;
    drake.emit('drag', _item, _source);
  }

  function invalidTarget () {
    return false;
  }

  function end () {
    if (!drake.dragging) {
      return;
    }
    var item = _copy || _item;
    drop(item, getParent(item));
  }

  function ungrab () {
    _grabbed = false;
    eventualMovements(true);
    movements(true);
  }

  function release (e) {
    ungrab();

    if (!drake.dragging) {
      return;
    }
    var item = _copy || _item;
    var clientX = getCoord('clientX', e);
    var clientY = getCoord('clientY', e);
    var elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
    var dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
    if (dropTarget && ((_copy && o.copySortSource) || (!_copy || dropTarget !== _source))) {
      drop(item, dropTarget);
    } else if (o.removeOnSpill) {
      remove();
    } else {
      cancel();
    }
  }

  function drop (item, target) {
    var parent = getParent(item);
    if (_copy && o.copySortSource && target === _source) {
      parent.removeChild(_item);
    }
    if (isInitialPlacement(target)) {
      drake.emit('cancel', item, _source, _source);
    } else {
      drake.emit('drop', item, target, _source, _currentSibling);
    }
    cleanup();
  }

  function remove () {
    if (!drake.dragging) {
      return;
    }
    var item = _copy || _item;
    var parent = getParent(item);
    if (parent) {
      parent.removeChild(item);
    }
    drake.emit(_copy ? 'cancel' : 'remove', item, parent, _source);
    cleanup();
  }

  function cancel (revert) {
    if (!drake.dragging) {
      return;
    }
    var reverts = arguments.length > 0 ? revert : o.revertOnSpill;
    var item = _copy || _item;
    var parent = getParent(item);
    var initial = isInitialPlacement(parent);
    if (initial === false && reverts) {
      if (_copy) {
        parent.removeChild(_copy);
      } else {
        _source.insertBefore(item, _initialSibling);
      }
    }
    if (initial || reverts) {
      drake.emit('cancel', item, _source, _source);
    } else {
      drake.emit('drop', item, parent, _source, _currentSibling);
    }
    cleanup();
  }

  function cleanup () {
    var item = _copy || _item;
    ungrab();
    removeMirrorImage();
    if (item) {
      classes.rm(item, 'gu-transit');
    }
    if (_renderTimer) {
      clearTimeout(_renderTimer);
    }
    drake.dragging = false;
    if (_lastDropTarget) {
      drake.emit('out', item, _lastDropTarget, _source);
    }
    drake.emit('dragend', item);
    _source = _item = _copy = _initialSibling = _currentSibling = _renderTimer = _lastDropTarget = null;
  }

  function isInitialPlacement (target, s) {
    var sibling;
    if (s !== void 0) {
      sibling = s;
    } else if (_mirror) {
      sibling = _currentSibling;
    } else {
      sibling = nextEl(_copy || _item);
    }
    return target === _source && sibling === _initialSibling;
  }

  function findDropTarget (elementBehindCursor, clientX, clientY) {
    var target = elementBehindCursor;
    while (target && !accepted()) {
      target = getParent(target);
    }
    return target;

    function accepted () {
      var droppable = isContainer(target);
      if (droppable === false) {
        return false;
      }

      var immediate = getImmediateChild(target, elementBehindCursor);
      var reference = getReference(target, immediate, clientX, clientY);
      var initial = isInitialPlacement(target, reference);
      if (initial) {
        return true; // should always be able to drop it right back where it was
      }
      return o.accepts(_item, target, _source, reference);
    }
  }

  function drag (e) {
    if (!_mirror) {
      return;
    }
    e.preventDefault();

    var clientX = getCoord('clientX', e);
    var clientY = getCoord('clientY', e);
    var x = clientX - _offsetX;
    var y = clientY - _offsetY;

    _mirror.style.left = x + 'px';
    _mirror.style.top = y + 'px';

    var item = _copy || _item;
    var elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
    var dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
    var changed = dropTarget !== null && dropTarget !== _lastDropTarget;
    if (changed || dropTarget === null) {
      out();
      _lastDropTarget = dropTarget;
      over();
    }
    var parent = getParent(item);
    if (dropTarget === _source && _copy && !o.copySortSource) {
      if (parent) {
        parent.removeChild(item);
      }
      return;
    }
    var reference;
    var immediate = getImmediateChild(dropTarget, elementBehindCursor);
    if (immediate !== null) {
      reference = getReference(dropTarget, immediate, clientX, clientY);
    } else if (o.revertOnSpill === true && !_copy) {
      reference = _initialSibling;
      dropTarget = _source;
    } else {
      if (_copy && parent) {
        parent.removeChild(item);
      }
      return;
    }
    if (
      (reference === null && changed) ||
      reference !== item &&
      reference !== nextEl(item)
    ) {
      _currentSibling = reference;
      dropTarget.insertBefore(item, reference);
      drake.emit('shadow', item, dropTarget, _source);
    }
    function moved (type) { drake.emit(type, item, _lastDropTarget, _source); }
    function over () { if (changed) { moved('over'); } }
    function out () { if (_lastDropTarget) { moved('out'); } }
  }

  function spillOver (el) {
    classes.rm(el, 'gu-hide');
  }

  function spillOut (el) {
    if (drake.dragging) { classes.add(el, 'gu-hide'); }
  }

  function renderMirrorImage () {
    if (_mirror) {
      return;
    }
    var rect = _item.getBoundingClientRect();
    _mirror = _item.cloneNode(true);
    _mirror.style.width = getRectWidth(rect) + 'px';
    _mirror.style.height = getRectHeight(rect) + 'px';
    classes.rm(_mirror, 'gu-transit');
    classes.add(_mirror, 'gu-mirror');
    o.mirrorContainer.appendChild(_mirror);
    touchy(documentElement, 'add', 'mousemove', drag);
    classes.add(o.mirrorContainer, 'gu-unselectable');
    drake.emit('cloned', _mirror, _item, 'mirror');
  }

  function removeMirrorImage () {
    if (_mirror) {
      classes.rm(o.mirrorContainer, 'gu-unselectable');
      touchy(documentElement, 'remove', 'mousemove', drag);
      getParent(_mirror).removeChild(_mirror);
      _mirror = null;
    }
  }

  function getImmediateChild (dropTarget, target) {
    var immediate = target;
    while (immediate !== dropTarget && getParent(immediate) !== dropTarget) {
      immediate = getParent(immediate);
    }
    if (immediate === documentElement) {
      return null;
    }
    return immediate;
  }

  function getReference (dropTarget, target, x, y) {
    var horizontal = o.direction === 'horizontal';
    var reference = target !== dropTarget ? inside() : outside();
    return reference;

    function outside () { // slower, but able to figure out any position
      var len = dropTarget.children.length;
      var i;
      var el;
      var rect;
      for (i = 0; i < len; i++) {
        el = dropTarget.children[i];
        rect = el.getBoundingClientRect();
        if (horizontal && (rect.left + rect.width / 2) > x) { return el; }
        if (!horizontal && (rect.top + rect.height / 2) > y) { return el; }
      }
      return null;
    }

    function inside () { // faster, but only available if dropped inside a child element
      var rect = target.getBoundingClientRect();
      if (horizontal) {
        return resolve(x > rect.left + getRectWidth(rect) / 2);
      }
      return resolve(y > rect.top + getRectHeight(rect) / 2);
    }

    function resolve (after) {
      return after ? nextEl(target) : target;
    }
  }

  function isCopy (item, container) {
    return typeof o.copy === 'boolean' ? o.copy : o.copy(item, container);
  }
}

function touchy (el, op, type, fn) {
  var touch = {
    mouseup: 'touchend',
    mousedown: 'touchstart',
    mousemove: 'touchmove'
  };
  var pointers = {
    mouseup: 'pointerup',
    mousedown: 'pointerdown',
    mousemove: 'pointermove'
  };
  var microsoft = {
    mouseup: 'MSPointerUp',
    mousedown: 'MSPointerDown',
    mousemove: 'MSPointerMove'
  };
  if (global.navigator.pointerEnabled) {
    crossvent[op](el, pointers[type], fn);
  } else if (global.navigator.msPointerEnabled) {
    crossvent[op](el, microsoft[type], fn);
  } else {
    crossvent[op](el, touch[type], fn);
    crossvent[op](el, type, fn);
  }
}

function whichMouseButton (e) {
  if (e.touches !== void 0) { return e.touches.length; }
  if (e.which !== void 0 && e.which !== 0) { return e.which; } // see https://github.com/bevacqua/dragula/issues/261
  if (e.buttons !== void 0) { return e.buttons; }
  var button = e.button;
  if (button !== void 0) { // see https://github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575
    return button & 1 ? 1 : button & 2 ? 3 : (button & 4 ? 2 : 0);
  }
}

function getOffset (el) {
  var rect = el.getBoundingClientRect();
  return {
    left: rect.left + getScroll('scrollLeft', 'pageXOffset'),
    top: rect.top + getScroll('scrollTop', 'pageYOffset')
  };
}

function getScroll (scrollProp, offsetProp) {
  if (typeof global[offsetProp] !== 'undefined') {
    return global[offsetProp];
  }
  if (documentElement.clientHeight) {
    return documentElement[scrollProp];
  }
  return doc.body[scrollProp];
}

function getElementBehindPoint (point, x, y) {
  var p = point || {};
  var state = p.className;
  var el;
  p.className += ' gu-hide';
  el = doc.elementFromPoint(x, y);
  p.className = state;
  return el;
}

function never () { return false; }
function always () { return true; }
function getRectWidth (rect) { return rect.width || (rect.right - rect.left); }
function getRectHeight (rect) { return rect.height || (rect.bottom - rect.top); }
function getParent (el) { return el.parentNode === doc ? null : el.parentNode; }
function isInput (el) { return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || isEditable(el); }
function isEditable (el) {
  if (!el) { return false; } // no parents were editable
  if (el.contentEditable === 'false') { return false; } // stop the lookup
  if (el.contentEditable === 'true') { return true; } // found a contentEditable element in the chain
  return isEditable(getParent(el)); // contentEditable is set to 'inherit'
}

function nextEl (el) {
  return el.nextElementSibling || manually();
  function manually () {
    var sibling = el;
    do {
      sibling = sibling.nextSibling;
    } while (sibling && sibling.nodeType !== 1);
    return sibling;
  }
}

function getEventHost (e) {
  // on touchend event, we have to use `e.changedTouches`
  // see http://stackoverflow.com/questions/7192563/touchend-event-properties
  // see https://github.com/bevacqua/dragula/issues/34
  if (e.targetTouches && e.targetTouches.length) {
    return e.targetTouches[0];
  }
  if (e.changedTouches && e.changedTouches.length) {
    return e.changedTouches[0];
  }
  return e;
}

function getCoord (coord, e) {
  var host = getEventHost(e);
  var missMap = {
    pageX: 'clientX', // IE8
    pageY: 'clientY' // IE8
  };
  if (coord in missMap && !(coord in host) && missMap[coord] in host) {
    coord = missMap[coord];
  }
  return host[coord];
}

module.exports = dragula;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./classes":1,"contra/emitter":4,"crossvent":8}],3:[function(require,module,exports){
'use strict';

var ticky = require('ticky');

module.exports = function debounce (fn, args, ctx) {
  if (!fn) { return; }
  ticky(function run () {
    fn.apply(ctx || null, args || []);
  });
};

},{"ticky":6}],4:[function(require,module,exports){
'use strict';

var atoa = require('atoa');
var debounce = require('./debounce');

module.exports = function emitter (thing, options) {
  var opts = options || {};
  var evt = {};
  if (thing === undefined) { thing = {}; }
  thing.on = function (type, fn) {
    if (!evt[type]) {
      evt[type] = [fn];
    } else {
      evt[type].push(fn);
    }
    return thing;
  };
  thing.once = function (type, fn) {
    fn._once = true; // thing.off(fn) still works!
    thing.on(type, fn);
    return thing;
  };
  thing.off = function (type, fn) {
    var c = arguments.length;
    if (c === 1) {
      delete evt[type];
    } else if (c === 0) {
      evt = {};
    } else {
      var et = evt[type];
      if (!et) { return thing; }
      et.splice(et.indexOf(fn), 1);
    }
    return thing;
  };
  thing.emit = function () {
    var args = atoa(arguments);
    return thing.emitterSnapshot(args.shift()).apply(this, args);
  };
  thing.emitterSnapshot = function (type) {
    var et = (evt[type] || []).slice(0);
    return function () {
      var args = atoa(arguments);
      var ctx = this || thing;
      if (type === 'error' && opts.throws !== false && !et.length) { throw args.length === 1 ? args[0] : args; }
      et.forEach(function emitter (listen) {
        if (opts.async) { debounce(listen, args, ctx); } else { listen.apply(ctx, args); }
        if (listen._once) { thing.off(type, listen); }
      });
      return thing;
    };
  };
  return thing;
};

},{"./debounce":3,"atoa":5}],5:[function(require,module,exports){
module.exports = function atoa (a, n) { return Array.prototype.slice.call(a, n); }

},{}],6:[function(require,module,exports){
var si = typeof setImmediate === 'function', tick;
if (si) {
  tick = function (fn) { setImmediate(fn); };
} else {
  tick = function (fn) { setTimeout(fn, 0); };
}

module.exports = tick;
},{}],7:[function(require,module,exports){
(function (global){

var NativeCustomEvent = global.CustomEvent;

function useNative () {
  try {
    var p = new NativeCustomEvent('cat', { detail: { foo: 'bar' } });
    return  'cat' === p.type && 'bar' === p.detail.foo;
  } catch (e) {
  }
  return false;
}

/**
 * Cross-browser `CustomEvent` constructor.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent
 *
 * @public
 */

module.exports = useNative() ? NativeCustomEvent :

// IE >= 9
'function' === typeof document.createEvent ? function CustomEvent (type, params) {
  var e = document.createEvent('CustomEvent');
  if (params) {
    e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
  } else {
    e.initCustomEvent(type, false, false, void 0);
  }
  return e;
} :

// IE <= 8
function CustomEvent (type, params) {
  var e = document.createEventObject();
  e.type = type;
  if (params) {
    e.bubbles = Boolean(params.bubbles);
    e.cancelable = Boolean(params.cancelable);
    e.detail = params.detail;
  } else {
    e.bubbles = false;
    e.cancelable = false;
    e.detail = void 0;
  }
  return e;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],8:[function(require,module,exports){
(function (global){
'use strict';

var customEvent = require('custom-event');
var eventmap = require('./eventmap');
var doc = global.document;
var addEvent = addEventEasy;
var removeEvent = removeEventEasy;
var hardCache = [];

if (!global.addEventListener) {
  addEvent = addEventHard;
  removeEvent = removeEventHard;
}

module.exports = {
  add: addEvent,
  remove: removeEvent,
  fabricate: fabricateEvent
};

function addEventEasy (el, type, fn, capturing) {
  return el.addEventListener(type, fn, capturing);
}

function addEventHard (el, type, fn) {
  return el.attachEvent('on' + type, wrap(el, type, fn));
}

function removeEventEasy (el, type, fn, capturing) {
  return el.removeEventListener(type, fn, capturing);
}

function removeEventHard (el, type, fn) {
  var listener = unwrap(el, type, fn);
  if (listener) {
    return el.detachEvent('on' + type, listener);
  }
}

function fabricateEvent (el, type, model) {
  var e = eventmap.indexOf(type) === -1 ? makeCustomEvent() : makeClassicEvent();
  if (el.dispatchEvent) {
    el.dispatchEvent(e);
  } else {
    el.fireEvent('on' + type, e);
  }
  function makeClassicEvent () {
    var e;
    if (doc.createEvent) {
      e = doc.createEvent('Event');
      e.initEvent(type, true, true);
    } else if (doc.createEventObject) {
      e = doc.createEventObject();
    }
    return e;
  }
  function makeCustomEvent () {
    return new customEvent(type, { detail: model });
  }
}

function wrapperFactory (el, type, fn) {
  return function wrapper (originalEvent) {
    var e = originalEvent || global.event;
    e.target = e.target || e.srcElement;
    e.preventDefault = e.preventDefault || function preventDefault () { e.returnValue = false; };
    e.stopPropagation = e.stopPropagation || function stopPropagation () { e.cancelBubble = true; };
    e.which = e.which || e.keyCode;
    fn.call(el, e);
  };
}

function wrap (el, type, fn) {
  var wrapper = unwrap(el, type, fn) || wrapperFactory(el, type, fn);
  hardCache.push({
    wrapper: wrapper,
    element: el,
    type: type,
    fn: fn
  });
  return wrapper;
}

function unwrap (el, type, fn) {
  var i = find(el, type, fn);
  if (i) {
    var wrapper = hardCache[i].wrapper;
    hardCache.splice(i, 1); // free up a tad of memory
    return wrapper;
  }
}

function find (el, type, fn) {
  var i, item;
  for (i = 0; i < hardCache.length; i++) {
    item = hardCache[i];
    if (item.element === el && item.type === type && item.fn === fn) {
      return i;
    }
  }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./eventmap":9,"custom-event":7}],9:[function(require,module,exports){
(function (global){
'use strict';

var eventmap = [];
var eventname = '';
var ron = /^on/;

for (eventname in global) {
  if (ron.test(eventname)) {
    eventmap.push(eventname.slice(2));
  }
}

module.exports = eventmap;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGFzc2VzLmpzIiwiZHJhZ3VsYS5qcyIsIm5vZGVfbW9kdWxlcy9jb250cmEvZGVib3VuY2UuanMiLCJub2RlX21vZHVsZXMvY29udHJhL2VtaXR0ZXIuanMiLCJub2RlX21vZHVsZXMvY29udHJhL25vZGVfbW9kdWxlcy9hdG9hL2F0b2EuanMiLCJub2RlX21vZHVsZXMvY29udHJhL25vZGVfbW9kdWxlcy90aWNreS90aWNreS1icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2Nyb3NzdmVudC9ub2RlX21vZHVsZXMvY3VzdG9tLWV2ZW50L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Nyb3NzdmVudC9zcmMvY3Jvc3N2ZW50LmpzIiwibm9kZV9tb2R1bGVzL2Nyb3NzdmVudC9zcmMvZXZlbnRtYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDOWxCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FjaGUgPSB7fTtcbnZhciBzdGFydCA9ICcoPzpefFxcXFxzKSc7XG52YXIgZW5kID0gJyg/OlxcXFxzfCQpJztcblxuZnVuY3Rpb24gbG9va3VwQ2xhc3MgKGNsYXNzTmFtZSkge1xuICB2YXIgY2FjaGVkID0gY2FjaGVbY2xhc3NOYW1lXTtcbiAgaWYgKGNhY2hlZCkge1xuICAgIGNhY2hlZC5sYXN0SW5kZXggPSAwO1xuICB9IGVsc2Uge1xuICAgIGNhY2hlW2NsYXNzTmFtZV0gPSBjYWNoZWQgPSBuZXcgUmVnRXhwKHN0YXJ0ICsgY2xhc3NOYW1lICsgZW5kLCAnZycpO1xuICB9XG4gIHJldHVybiBjYWNoZWQ7XG59XG5cbmZ1bmN0aW9uIGFkZENsYXNzIChlbCwgY2xhc3NOYW1lKSB7XG4gIHZhciBjdXJyZW50ID0gZWwuY2xhc3NOYW1lO1xuICBpZiAoIWN1cnJlbnQubGVuZ3RoKSB7XG4gICAgZWwuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICB9IGVsc2UgaWYgKCFsb29rdXBDbGFzcyhjbGFzc05hbWUpLnRlc3QoY3VycmVudCkpIHtcbiAgICBlbC5jbGFzc05hbWUgKz0gJyAnICsgY2xhc3NOYW1lO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJtQ2xhc3MgKGVsLCBjbGFzc05hbWUpIHtcbiAgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2UobG9va3VwQ2xhc3MoY2xhc3NOYW1lKSwgJyAnKS50cmltKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGQ6IGFkZENsYXNzLFxuICBybTogcm1DbGFzc1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVtaXR0ZXIgPSByZXF1aXJlKCdjb250cmEvZW1pdHRlcicpO1xudmFyIGNyb3NzdmVudCA9IHJlcXVpcmUoJ2Nyb3NzdmVudCcpO1xudmFyIGNsYXNzZXMgPSByZXF1aXJlKCcuL2NsYXNzZXMnKTtcbnZhciBkb2MgPSBkb2N1bWVudDtcbnZhciBkb2N1bWVudEVsZW1lbnQgPSBkb2MuZG9jdW1lbnRFbGVtZW50O1xuXG5mdW5jdGlvbiBkcmFndWxhIChpbml0aWFsQ29udGFpbmVycywgb3B0aW9ucykge1xuICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgaWYgKGxlbiA9PT0gMSAmJiBBcnJheS5pc0FycmF5KGluaXRpYWxDb250YWluZXJzKSA9PT0gZmFsc2UpIHtcbiAgICBvcHRpb25zID0gaW5pdGlhbENvbnRhaW5lcnM7XG4gICAgaW5pdGlhbENvbnRhaW5lcnMgPSBbXTtcbiAgfVxuICB2YXIgX21pcnJvcjsgLy8gbWlycm9yIGltYWdlXG4gIHZhciBfc291cmNlOyAvLyBzb3VyY2UgY29udGFpbmVyXG4gIHZhciBfaXRlbTsgLy8gaXRlbSBiZWluZyBkcmFnZ2VkXG4gIHZhciBfb2Zmc2V0WDsgLy8gcmVmZXJlbmNlIHhcbiAgdmFyIF9vZmZzZXRZOyAvLyByZWZlcmVuY2UgeVxuICB2YXIgX21vdmVYOyAvLyByZWZlcmVuY2UgbW92ZSB4XG4gIHZhciBfbW92ZVk7IC8vIHJlZmVyZW5jZSBtb3ZlIHlcbiAgdmFyIF9pbml0aWFsU2libGluZzsgLy8gcmVmZXJlbmNlIHNpYmxpbmcgd2hlbiBncmFiYmVkXG4gIHZhciBfY3VycmVudFNpYmxpbmc7IC8vIHJlZmVyZW5jZSBzaWJsaW5nIG5vd1xuICB2YXIgX2NvcHk7IC8vIGl0ZW0gdXNlZCBmb3IgY29weWluZ1xuICB2YXIgX3JlbmRlclRpbWVyOyAvLyB0aW1lciBmb3Igc2V0VGltZW91dCByZW5kZXJNaXJyb3JJbWFnZVxuICB2YXIgX2xhc3REcm9wVGFyZ2V0ID0gbnVsbDsgLy8gbGFzdCBjb250YWluZXIgaXRlbSB3YXMgb3ZlclxuICB2YXIgX2dyYWJiZWQ7IC8vIGhvbGRzIG1vdXNlZG93biBjb250ZXh0IHVudGlsIGZpcnN0IG1vdXNlbW92ZVxuXG4gIHZhciBvID0gb3B0aW9ucyB8fCB7fTtcbiAgaWYgKG8ubW92ZXMgPT09IHZvaWQgMCkgeyBvLm1vdmVzID0gYWx3YXlzOyB9XG4gIGlmIChvLmFjY2VwdHMgPT09IHZvaWQgMCkgeyBvLmFjY2VwdHMgPSBhbHdheXM7IH1cbiAgaWYgKG8uaW52YWxpZCA9PT0gdm9pZCAwKSB7IG8uaW52YWxpZCA9IGludmFsaWRUYXJnZXQ7IH1cbiAgaWYgKG8uY29udGFpbmVycyA9PT0gdm9pZCAwKSB7IG8uY29udGFpbmVycyA9IGluaXRpYWxDb250YWluZXJzIHx8IFtdOyB9XG4gIGlmIChvLmlzQ29udGFpbmVyID09PSB2b2lkIDApIHsgby5pc0NvbnRhaW5lciA9IG5ldmVyOyB9XG4gIGlmIChvLmNvcHkgPT09IHZvaWQgMCkgeyBvLmNvcHkgPSBmYWxzZTsgfVxuICBpZiAoby5jb3B5U29ydFNvdXJjZSA9PT0gdm9pZCAwKSB7IG8uY29weVNvcnRTb3VyY2UgPSBmYWxzZTsgfVxuICBpZiAoby5yZXZlcnRPblNwaWxsID09PSB2b2lkIDApIHsgby5yZXZlcnRPblNwaWxsID0gZmFsc2U7IH1cbiAgaWYgKG8ucmVtb3ZlT25TcGlsbCA9PT0gdm9pZCAwKSB7IG8ucmVtb3ZlT25TcGlsbCA9IGZhbHNlOyB9XG4gIGlmIChvLmRpcmVjdGlvbiA9PT0gdm9pZCAwKSB7IG8uZGlyZWN0aW9uID0gJ3ZlcnRpY2FsJzsgfVxuICBpZiAoby5pZ25vcmVJbnB1dFRleHRTZWxlY3Rpb24gPT09IHZvaWQgMCkgeyBvLmlnbm9yZUlucHV0VGV4dFNlbGVjdGlvbiA9IHRydWU7IH1cbiAgaWYgKG8ubWlycm9yQ29udGFpbmVyID09PSB2b2lkIDApIHsgby5taXJyb3JDb250YWluZXIgPSBkb2MuYm9keTsgfVxuXG4gIHZhciBkcmFrZSA9IGVtaXR0ZXIoe1xuICAgIGNvbnRhaW5lcnM6IG8uY29udGFpbmVycyxcbiAgICBzdGFydDogbWFudWFsU3RhcnQsXG4gICAgZW5kOiBlbmQsXG4gICAgY2FuY2VsOiBjYW5jZWwsXG4gICAgcmVtb3ZlOiByZW1vdmUsXG4gICAgZGVzdHJveTogZGVzdHJveSxcbiAgICBjYW5Nb3ZlOiBjYW5Nb3ZlLFxuICAgIGRyYWdnaW5nOiBmYWxzZVxuICB9KTtcblxuICBpZiAoby5yZW1vdmVPblNwaWxsID09PSB0cnVlKSB7XG4gICAgZHJha2Uub24oJ292ZXInLCBzcGlsbE92ZXIpLm9uKCdvdXQnLCBzcGlsbE91dCk7XG4gIH1cblxuICBldmVudHMoKTtcblxuICByZXR1cm4gZHJha2U7XG5cbiAgZnVuY3Rpb24gaXNDb250YWluZXIgKGVsKSB7XG4gICAgcmV0dXJuIGRyYWtlLmNvbnRhaW5lcnMuaW5kZXhPZihlbCkgIT09IC0xIHx8IG8uaXNDb250YWluZXIoZWwpO1xuICB9XG5cbiAgZnVuY3Rpb24gZXZlbnRzIChyZW1vdmUpIHtcbiAgICB2YXIgb3AgPSByZW1vdmUgPyAncmVtb3ZlJyA6ICdhZGQnO1xuICAgIHRvdWNoeShkb2N1bWVudEVsZW1lbnQsIG9wLCAnbW91c2Vkb3duJywgZ3JhYik7XG4gICAgdG91Y2h5KGRvY3VtZW50RWxlbWVudCwgb3AsICdtb3VzZXVwJywgcmVsZWFzZSk7XG4gIH1cblxuICBmdW5jdGlvbiBldmVudHVhbE1vdmVtZW50cyAocmVtb3ZlKSB7XG4gICAgdmFyIG9wID0gcmVtb3ZlID8gJ3JlbW92ZScgOiAnYWRkJztcbiAgICB0b3VjaHkoZG9jdW1lbnRFbGVtZW50LCBvcCwgJ21vdXNlbW92ZScsIHN0YXJ0QmVjYXVzZU1vdXNlTW92ZWQpO1xuICB9XG5cbiAgZnVuY3Rpb24gbW92ZW1lbnRzIChyZW1vdmUpIHtcbiAgICB2YXIgb3AgPSByZW1vdmUgPyAncmVtb3ZlJyA6ICdhZGQnO1xuICAgIGNyb3NzdmVudFtvcF0oZG9jdW1lbnRFbGVtZW50LCAnc2VsZWN0c3RhcnQnLCBwcmV2ZW50R3JhYmJlZCk7IC8vIElFOFxuICAgIGNyb3NzdmVudFtvcF0oZG9jdW1lbnRFbGVtZW50LCAnY2xpY2snLCBwcmV2ZW50R3JhYmJlZCk7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95ICgpIHtcbiAgICBldmVudHModHJ1ZSk7XG4gICAgcmVsZWFzZSh7fSk7XG4gIH1cblxuICBmdW5jdGlvbiBwcmV2ZW50R3JhYmJlZCAoZSkge1xuICAgIGlmIChfZ3JhYmJlZCkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdyYWIgKGUpIHtcbiAgICBfbW92ZVggPSBlLmNsaWVudFg7XG4gICAgX21vdmVZID0gZS5jbGllbnRZO1xuXG4gICAgdmFyIGlnbm9yZSA9IHdoaWNoTW91c2VCdXR0b24oZSkgIT09IDEgfHwgZS5tZXRhS2V5IHx8IGUuY3RybEtleTtcbiAgICBpZiAoaWdub3JlKSB7XG4gICAgICByZXR1cm47IC8vIHdlIG9ubHkgY2FyZSBhYm91dCBob25lc3QtdG8tZ29kIGxlZnQgY2xpY2tzIGFuZCB0b3VjaCBldmVudHNcbiAgICB9XG4gICAgdmFyIGl0ZW0gPSBlLnRhcmdldDtcbiAgICB2YXIgY29udGV4dCA9IGNhblN0YXJ0KGl0ZW0pO1xuICAgIGlmICghY29udGV4dCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBfZ3JhYmJlZCA9IGNvbnRleHQ7XG4gICAgZXZlbnR1YWxNb3ZlbWVudHMoKTtcbiAgICBpZiAoZS50eXBlID09PSAnbW91c2Vkb3duJykge1xuICAgICAgaWYgKGlzSW5wdXQoaXRlbSkpIHsgLy8gc2VlIGFsc286IGh0dHBzOi8vZ2l0aHViLmNvbS9iZXZhY3F1YS9kcmFndWxhL2lzc3Vlcy8yMDhcbiAgICAgICAgaXRlbS5mb2N1cygpOyAvLyBmaXhlcyBodHRwczovL2dpdGh1Yi5jb20vYmV2YWNxdWEvZHJhZ3VsYS9pc3N1ZXMvMTc2XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7IC8vIGZpeGVzIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXZhY3F1YS9kcmFndWxhL2lzc3Vlcy8xNTVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzdGFydEJlY2F1c2VNb3VzZU1vdmVkIChlKSB7XG4gICAgaWYgKCFfZ3JhYmJlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAod2hpY2hNb3VzZUJ1dHRvbihlKSA9PT0gMCkge1xuICAgICAgcmVsZWFzZSh7fSk7XG4gICAgICByZXR1cm47IC8vIHdoZW4gdGV4dCBpcyBzZWxlY3RlZCBvbiBhbiBpbnB1dCBhbmQgdGhlbiBkcmFnZ2VkLCBtb3VzZXVwIGRvZXNuJ3QgZmlyZS4gdGhpcyBpcyBvdXIgb25seSBob3BlXG4gICAgfVxuICAgIC8vIHRydXRoeSBjaGVjayBmaXhlcyAjMjM5LCBlcXVhbGl0eSBmaXhlcyAjMjA3XG4gICAgaWYgKGUuY2xpZW50WCAhPT0gdm9pZCAwICYmIGUuY2xpZW50WCA9PT0gX21vdmVYICYmIGUuY2xpZW50WSAhPT0gdm9pZCAwICYmIGUuY2xpZW50WSA9PT0gX21vdmVZKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChvLmlnbm9yZUlucHV0VGV4dFNlbGVjdGlvbikge1xuICAgICAgdmFyIGNsaWVudFggPSBnZXRDb29yZCgnY2xpZW50WCcsIGUpO1xuICAgICAgdmFyIGNsaWVudFkgPSBnZXRDb29yZCgnY2xpZW50WScsIGUpO1xuICAgICAgdmFyIGVsZW1lbnRCZWhpbmRDdXJzb3IgPSBkb2MuZWxlbWVudEZyb21Qb2ludChjbGllbnRYLCBjbGllbnRZKTtcbiAgICAgIGlmIChpc0lucHV0KGVsZW1lbnRCZWhpbmRDdXJzb3IpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZ3JhYmJlZCA9IF9ncmFiYmVkOyAvLyBjYWxsIHRvIGVuZCgpIHVuc2V0cyBfZ3JhYmJlZFxuICAgIGV2ZW50dWFsTW92ZW1lbnRzKHRydWUpO1xuICAgIG1vdmVtZW50cygpO1xuICAgIGVuZCgpO1xuICAgIHN0YXJ0KGdyYWJiZWQpO1xuXG4gICAgdmFyIG9mZnNldCA9IGdldE9mZnNldChfaXRlbSk7XG4gICAgX29mZnNldFggPSBnZXRDb29yZCgncGFnZVgnLCBlKSAtIG9mZnNldC5sZWZ0O1xuICAgIF9vZmZzZXRZID0gZ2V0Q29vcmQoJ3BhZ2VZJywgZSkgLSBvZmZzZXQudG9wO1xuXG4gICAgY2xhc3Nlcy5hZGQoX2NvcHkgfHwgX2l0ZW0sICdndS10cmFuc2l0Jyk7XG4gICAgcmVuZGVyTWlycm9ySW1hZ2UoKTtcbiAgICBkcmFnKGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuU3RhcnQgKGl0ZW0pIHtcbiAgICBpZiAoZHJha2UuZHJhZ2dpbmcgJiYgX21pcnJvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXNDb250YWluZXIoaXRlbSkpIHtcbiAgICAgIHJldHVybjsgLy8gZG9uJ3QgZHJhZyBjb250YWluZXIgaXRzZWxmXG4gICAgfVxuICAgIHZhciBoYW5kbGUgPSBpdGVtO1xuICAgIHdoaWxlIChnZXRQYXJlbnQoaXRlbSkgJiYgaXNDb250YWluZXIoZ2V0UGFyZW50KGl0ZW0pKSA9PT0gZmFsc2UpIHtcbiAgICAgIGlmIChvLmludmFsaWQoaXRlbSwgaGFuZGxlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpdGVtID0gZ2V0UGFyZW50KGl0ZW0pOyAvLyBkcmFnIHRhcmdldCBzaG91bGQgYmUgYSB0b3AgZWxlbWVudFxuICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIHNvdXJjZSA9IGdldFBhcmVudChpdGVtKTtcbiAgICBpZiAoIXNvdXJjZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoby5pbnZhbGlkKGl0ZW0sIGhhbmRsZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbW92YWJsZSA9IG8ubW92ZXMoaXRlbSwgc291cmNlLCBoYW5kbGUsIG5leHRFbChpdGVtKSk7XG4gICAgaWYgKCFtb3ZhYmxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGl0ZW06IGl0ZW0sXG4gICAgICBzb3VyY2U6IHNvdXJjZVxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBjYW5Nb3ZlIChpdGVtKSB7XG4gICAgcmV0dXJuICEhY2FuU3RhcnQoaXRlbSk7XG4gIH1cblxuICBmdW5jdGlvbiBtYW51YWxTdGFydCAoaXRlbSkge1xuICAgIHZhciBjb250ZXh0ID0gY2FuU3RhcnQoaXRlbSk7XG4gICAgaWYgKGNvbnRleHQpIHtcbiAgICAgIHN0YXJ0KGNvbnRleHQpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0IChjb250ZXh0KSB7XG4gICAgaWYgKGlzQ29weShjb250ZXh0Lml0ZW0sIGNvbnRleHQuc291cmNlKSkge1xuICAgICAgX2NvcHkgPSBjb250ZXh0Lml0ZW0uY2xvbmVOb2RlKHRydWUpO1xuICAgICAgZHJha2UuZW1pdCgnY2xvbmVkJywgX2NvcHksIGNvbnRleHQuaXRlbSwgJ2NvcHknKTtcbiAgICB9XG5cbiAgICBfc291cmNlID0gY29udGV4dC5zb3VyY2U7XG4gICAgX2l0ZW0gPSBjb250ZXh0Lml0ZW07XG4gICAgX2luaXRpYWxTaWJsaW5nID0gX2N1cnJlbnRTaWJsaW5nID0gbmV4dEVsKGNvbnRleHQuaXRlbSk7XG5cbiAgICBkcmFrZS5kcmFnZ2luZyA9IHRydWU7XG4gICAgZHJha2UuZW1pdCgnZHJhZycsIF9pdGVtLCBfc291cmNlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludmFsaWRUYXJnZXQgKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGVuZCAoKSB7XG4gICAgaWYgKCFkcmFrZS5kcmFnZ2luZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgaXRlbSA9IF9jb3B5IHx8IF9pdGVtO1xuICAgIGRyb3AoaXRlbSwgZ2V0UGFyZW50KGl0ZW0pKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVuZ3JhYiAoKSB7XG4gICAgX2dyYWJiZWQgPSBmYWxzZTtcbiAgICBldmVudHVhbE1vdmVtZW50cyh0cnVlKTtcbiAgICBtb3ZlbWVudHModHJ1ZSk7XG4gIH1cblxuICBmdW5jdGlvbiByZWxlYXNlIChlKSB7XG4gICAgdW5ncmFiKCk7XG5cbiAgICBpZiAoIWRyYWtlLmRyYWdnaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBpdGVtID0gX2NvcHkgfHwgX2l0ZW07XG4gICAgdmFyIGNsaWVudFggPSBnZXRDb29yZCgnY2xpZW50WCcsIGUpO1xuICAgIHZhciBjbGllbnRZID0gZ2V0Q29vcmQoJ2NsaWVudFknLCBlKTtcbiAgICB2YXIgZWxlbWVudEJlaGluZEN1cnNvciA9IGdldEVsZW1lbnRCZWhpbmRQb2ludChfbWlycm9yLCBjbGllbnRYLCBjbGllbnRZKTtcbiAgICB2YXIgZHJvcFRhcmdldCA9IGZpbmREcm9wVGFyZ2V0KGVsZW1lbnRCZWhpbmRDdXJzb3IsIGNsaWVudFgsIGNsaWVudFkpO1xuICAgIGlmIChkcm9wVGFyZ2V0ICYmICgoX2NvcHkgJiYgby5jb3B5U29ydFNvdXJjZSkgfHwgKCFfY29weSB8fCBkcm9wVGFyZ2V0ICE9PSBfc291cmNlKSkpIHtcbiAgICAgIGRyb3AoaXRlbSwgZHJvcFRhcmdldCk7XG4gICAgfSBlbHNlIGlmIChvLnJlbW92ZU9uU3BpbGwpIHtcbiAgICAgIHJlbW92ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYW5jZWwoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBkcm9wIChpdGVtLCB0YXJnZXQpIHtcbiAgICB2YXIgcGFyZW50ID0gZ2V0UGFyZW50KGl0ZW0pO1xuICAgIGlmIChfY29weSAmJiBvLmNvcHlTb3J0U291cmNlICYmIHRhcmdldCA9PT0gX3NvdXJjZSkge1xuICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKF9pdGVtKTtcbiAgICB9XG4gICAgaWYgKGlzSW5pdGlhbFBsYWNlbWVudCh0YXJnZXQpKSB7XG4gICAgICBkcmFrZS5lbWl0KCdjYW5jZWwnLCBpdGVtLCBfc291cmNlLCBfc291cmNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZHJha2UuZW1pdCgnZHJvcCcsIGl0ZW0sIHRhcmdldCwgX3NvdXJjZSwgX2N1cnJlbnRTaWJsaW5nKTtcbiAgICB9XG4gICAgY2xlYW51cCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlICgpIHtcbiAgICBpZiAoIWRyYWtlLmRyYWdnaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBpdGVtID0gX2NvcHkgfHwgX2l0ZW07XG4gICAgdmFyIHBhcmVudCA9IGdldFBhcmVudChpdGVtKTtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQoaXRlbSk7XG4gICAgfVxuICAgIGRyYWtlLmVtaXQoX2NvcHkgPyAnY2FuY2VsJyA6ICdyZW1vdmUnLCBpdGVtLCBwYXJlbnQsIF9zb3VyY2UpO1xuICAgIGNsZWFudXAoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCAocmV2ZXJ0KSB7XG4gICAgaWYgKCFkcmFrZS5kcmFnZ2luZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcmV2ZXJ0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwID8gcmV2ZXJ0IDogby5yZXZlcnRPblNwaWxsO1xuICAgIHZhciBpdGVtID0gX2NvcHkgfHwgX2l0ZW07XG4gICAgdmFyIHBhcmVudCA9IGdldFBhcmVudChpdGVtKTtcbiAgICB2YXIgaW5pdGlhbCA9IGlzSW5pdGlhbFBsYWNlbWVudChwYXJlbnQpO1xuICAgIGlmIChpbml0aWFsID09PSBmYWxzZSAmJiByZXZlcnRzKSB7XG4gICAgICBpZiAoX2NvcHkpIHtcbiAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKF9jb3B5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9zb3VyY2UuaW5zZXJ0QmVmb3JlKGl0ZW0sIF9pbml0aWFsU2libGluZyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpbml0aWFsIHx8IHJldmVydHMpIHtcbiAgICAgIGRyYWtlLmVtaXQoJ2NhbmNlbCcsIGl0ZW0sIF9zb3VyY2UsIF9zb3VyY2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkcmFrZS5lbWl0KCdkcm9wJywgaXRlbSwgcGFyZW50LCBfc291cmNlLCBfY3VycmVudFNpYmxpbmcpO1xuICAgIH1cbiAgICBjbGVhbnVwKCk7XG4gIH1cblxuICBmdW5jdGlvbiBjbGVhbnVwICgpIHtcbiAgICB2YXIgaXRlbSA9IF9jb3B5IHx8IF9pdGVtO1xuICAgIHVuZ3JhYigpO1xuICAgIHJlbW92ZU1pcnJvckltYWdlKCk7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgIGNsYXNzZXMucm0oaXRlbSwgJ2d1LXRyYW5zaXQnKTtcbiAgICB9XG4gICAgaWYgKF9yZW5kZXJUaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KF9yZW5kZXJUaW1lcik7XG4gICAgfVxuICAgIGRyYWtlLmRyYWdnaW5nID0gZmFsc2U7XG4gICAgaWYgKF9sYXN0RHJvcFRhcmdldCkge1xuICAgICAgZHJha2UuZW1pdCgnb3V0JywgaXRlbSwgX2xhc3REcm9wVGFyZ2V0LCBfc291cmNlKTtcbiAgICB9XG4gICAgZHJha2UuZW1pdCgnZHJhZ2VuZCcsIGl0ZW0pO1xuICAgIF9zb3VyY2UgPSBfaXRlbSA9IF9jb3B5ID0gX2luaXRpYWxTaWJsaW5nID0gX2N1cnJlbnRTaWJsaW5nID0gX3JlbmRlclRpbWVyID0gX2xhc3REcm9wVGFyZ2V0ID0gbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzSW5pdGlhbFBsYWNlbWVudCAodGFyZ2V0LCBzKSB7XG4gICAgdmFyIHNpYmxpbmc7XG4gICAgaWYgKHMgIT09IHZvaWQgMCkge1xuICAgICAgc2libGluZyA9IHM7XG4gICAgfSBlbHNlIGlmIChfbWlycm9yKSB7XG4gICAgICBzaWJsaW5nID0gX2N1cnJlbnRTaWJsaW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaWJsaW5nID0gbmV4dEVsKF9jb3B5IHx8IF9pdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldCA9PT0gX3NvdXJjZSAmJiBzaWJsaW5nID09PSBfaW5pdGlhbFNpYmxpbmc7XG4gIH1cblxuICBmdW5jdGlvbiBmaW5kRHJvcFRhcmdldCAoZWxlbWVudEJlaGluZEN1cnNvciwgY2xpZW50WCwgY2xpZW50WSkge1xuICAgIHZhciB0YXJnZXQgPSBlbGVtZW50QmVoaW5kQ3Vyc29yO1xuICAgIHdoaWxlICh0YXJnZXQgJiYgIWFjY2VwdGVkKCkpIHtcbiAgICAgIHRhcmdldCA9IGdldFBhcmVudCh0YXJnZXQpO1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xuXG4gICAgZnVuY3Rpb24gYWNjZXB0ZWQgKCkge1xuICAgICAgdmFyIGRyb3BwYWJsZSA9IGlzQ29udGFpbmVyKHRhcmdldCk7XG4gICAgICBpZiAoZHJvcHBhYmxlID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHZhciBpbW1lZGlhdGUgPSBnZXRJbW1lZGlhdGVDaGlsZCh0YXJnZXQsIGVsZW1lbnRCZWhpbmRDdXJzb3IpO1xuICAgICAgdmFyIHJlZmVyZW5jZSA9IGdldFJlZmVyZW5jZSh0YXJnZXQsIGltbWVkaWF0ZSwgY2xpZW50WCwgY2xpZW50WSk7XG4gICAgICB2YXIgaW5pdGlhbCA9IGlzSW5pdGlhbFBsYWNlbWVudCh0YXJnZXQsIHJlZmVyZW5jZSk7XG4gICAgICBpZiAoaW5pdGlhbCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gc2hvdWxkIGFsd2F5cyBiZSBhYmxlIHRvIGRyb3AgaXQgcmlnaHQgYmFjayB3aGVyZSBpdCB3YXNcbiAgICAgIH1cbiAgICAgIHJldHVybiBvLmFjY2VwdHMoX2l0ZW0sIHRhcmdldCwgX3NvdXJjZSwgcmVmZXJlbmNlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBkcmFnIChlKSB7XG4gICAgaWYgKCFfbWlycm9yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciBjbGllbnRYID0gZ2V0Q29vcmQoJ2NsaWVudFgnLCBlKTtcbiAgICB2YXIgY2xpZW50WSA9IGdldENvb3JkKCdjbGllbnRZJywgZSk7XG4gICAgdmFyIHggPSBjbGllbnRYIC0gX29mZnNldFg7XG4gICAgdmFyIHkgPSBjbGllbnRZIC0gX29mZnNldFk7XG5cbiAgICBfbWlycm9yLnN0eWxlLmxlZnQgPSB4ICsgJ3B4JztcbiAgICBfbWlycm9yLnN0eWxlLnRvcCA9IHkgKyAncHgnO1xuXG4gICAgdmFyIGl0ZW0gPSBfY29weSB8fCBfaXRlbTtcbiAgICB2YXIgZWxlbWVudEJlaGluZEN1cnNvciA9IGdldEVsZW1lbnRCZWhpbmRQb2ludChfbWlycm9yLCBjbGllbnRYLCBjbGllbnRZKTtcbiAgICB2YXIgZHJvcFRhcmdldCA9IGZpbmREcm9wVGFyZ2V0KGVsZW1lbnRCZWhpbmRDdXJzb3IsIGNsaWVudFgsIGNsaWVudFkpO1xuICAgIHZhciBjaGFuZ2VkID0gZHJvcFRhcmdldCAhPT0gbnVsbCAmJiBkcm9wVGFyZ2V0ICE9PSBfbGFzdERyb3BUYXJnZXQ7XG4gICAgaWYgKGNoYW5nZWQgfHwgZHJvcFRhcmdldCA9PT0gbnVsbCkge1xuICAgICAgb3V0KCk7XG4gICAgICBfbGFzdERyb3BUYXJnZXQgPSBkcm9wVGFyZ2V0O1xuICAgICAgb3ZlcigpO1xuICAgIH1cbiAgICB2YXIgcGFyZW50ID0gZ2V0UGFyZW50KGl0ZW0pO1xuICAgIGlmIChkcm9wVGFyZ2V0ID09PSBfc291cmNlICYmIF9jb3B5ICYmICFvLmNvcHlTb3J0U291cmNlKSB7XG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChpdGVtKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHJlZmVyZW5jZTtcbiAgICB2YXIgaW1tZWRpYXRlID0gZ2V0SW1tZWRpYXRlQ2hpbGQoZHJvcFRhcmdldCwgZWxlbWVudEJlaGluZEN1cnNvcik7XG4gICAgaWYgKGltbWVkaWF0ZSAhPT0gbnVsbCkge1xuICAgICAgcmVmZXJlbmNlID0gZ2V0UmVmZXJlbmNlKGRyb3BUYXJnZXQsIGltbWVkaWF0ZSwgY2xpZW50WCwgY2xpZW50WSk7XG4gICAgfSBlbHNlIGlmIChvLnJldmVydE9uU3BpbGwgPT09IHRydWUgJiYgIV9jb3B5KSB7XG4gICAgICByZWZlcmVuY2UgPSBfaW5pdGlhbFNpYmxpbmc7XG4gICAgICBkcm9wVGFyZ2V0ID0gX3NvdXJjZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKF9jb3B5ICYmIHBhcmVudCkge1xuICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQoaXRlbSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChcbiAgICAgIChyZWZlcmVuY2UgPT09IG51bGwgJiYgY2hhbmdlZCkgfHxcbiAgICAgIHJlZmVyZW5jZSAhPT0gaXRlbSAmJlxuICAgICAgcmVmZXJlbmNlICE9PSBuZXh0RWwoaXRlbSlcbiAgICApIHtcbiAgICAgIF9jdXJyZW50U2libGluZyA9IHJlZmVyZW5jZTtcbiAgICAgIGRyb3BUYXJnZXQuaW5zZXJ0QmVmb3JlKGl0ZW0sIHJlZmVyZW5jZSk7XG4gICAgICBkcmFrZS5lbWl0KCdzaGFkb3cnLCBpdGVtLCBkcm9wVGFyZ2V0LCBfc291cmNlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gbW92ZWQgKHR5cGUpIHsgZHJha2UuZW1pdCh0eXBlLCBpdGVtLCBfbGFzdERyb3BUYXJnZXQsIF9zb3VyY2UpOyB9XG4gICAgZnVuY3Rpb24gb3ZlciAoKSB7IGlmIChjaGFuZ2VkKSB7IG1vdmVkKCdvdmVyJyk7IH0gfVxuICAgIGZ1bmN0aW9uIG91dCAoKSB7IGlmIChfbGFzdERyb3BUYXJnZXQpIHsgbW92ZWQoJ291dCcpOyB9IH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNwaWxsT3ZlciAoZWwpIHtcbiAgICBjbGFzc2VzLnJtKGVsLCAnZ3UtaGlkZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gc3BpbGxPdXQgKGVsKSB7XG4gICAgaWYgKGRyYWtlLmRyYWdnaW5nKSB7IGNsYXNzZXMuYWRkKGVsLCAnZ3UtaGlkZScpOyB9XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJNaXJyb3JJbWFnZSAoKSB7XG4gICAgaWYgKF9taXJyb3IpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHJlY3QgPSBfaXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBfbWlycm9yID0gX2l0ZW0uY2xvbmVOb2RlKHRydWUpO1xuICAgIF9taXJyb3Iuc3R5bGUud2lkdGggPSBnZXRSZWN0V2lkdGgocmVjdCkgKyAncHgnO1xuICAgIF9taXJyb3Iuc3R5bGUuaGVpZ2h0ID0gZ2V0UmVjdEhlaWdodChyZWN0KSArICdweCc7XG4gICAgY2xhc3Nlcy5ybShfbWlycm9yLCAnZ3UtdHJhbnNpdCcpO1xuICAgIGNsYXNzZXMuYWRkKF9taXJyb3IsICdndS1taXJyb3InKTtcbiAgICBvLm1pcnJvckNvbnRhaW5lci5hcHBlbmRDaGlsZChfbWlycm9yKTtcbiAgICB0b3VjaHkoZG9jdW1lbnRFbGVtZW50LCAnYWRkJywgJ21vdXNlbW92ZScsIGRyYWcpO1xuICAgIGNsYXNzZXMuYWRkKG8ubWlycm9yQ29udGFpbmVyLCAnZ3UtdW5zZWxlY3RhYmxlJyk7XG4gICAgZHJha2UuZW1pdCgnY2xvbmVkJywgX21pcnJvciwgX2l0ZW0sICdtaXJyb3InKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZU1pcnJvckltYWdlICgpIHtcbiAgICBpZiAoX21pcnJvcikge1xuICAgICAgY2xhc3Nlcy5ybShvLm1pcnJvckNvbnRhaW5lciwgJ2d1LXVuc2VsZWN0YWJsZScpO1xuICAgICAgdG91Y2h5KGRvY3VtZW50RWxlbWVudCwgJ3JlbW92ZScsICdtb3VzZW1vdmUnLCBkcmFnKTtcbiAgICAgIGdldFBhcmVudChfbWlycm9yKS5yZW1vdmVDaGlsZChfbWlycm9yKTtcbiAgICAgIF9taXJyb3IgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEltbWVkaWF0ZUNoaWxkIChkcm9wVGFyZ2V0LCB0YXJnZXQpIHtcbiAgICB2YXIgaW1tZWRpYXRlID0gdGFyZ2V0O1xuICAgIHdoaWxlIChpbW1lZGlhdGUgIT09IGRyb3BUYXJnZXQgJiYgZ2V0UGFyZW50KGltbWVkaWF0ZSkgIT09IGRyb3BUYXJnZXQpIHtcbiAgICAgIGltbWVkaWF0ZSA9IGdldFBhcmVudChpbW1lZGlhdGUpO1xuICAgIH1cbiAgICBpZiAoaW1tZWRpYXRlID09PSBkb2N1bWVudEVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gaW1tZWRpYXRlO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UmVmZXJlbmNlIChkcm9wVGFyZ2V0LCB0YXJnZXQsIHgsIHkpIHtcbiAgICB2YXIgaG9yaXpvbnRhbCA9IG8uZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCc7XG4gICAgdmFyIHJlZmVyZW5jZSA9IHRhcmdldCAhPT0gZHJvcFRhcmdldCA/IGluc2lkZSgpIDogb3V0c2lkZSgpO1xuICAgIHJldHVybiByZWZlcmVuY2U7XG5cbiAgICBmdW5jdGlvbiBvdXRzaWRlICgpIHsgLy8gc2xvd2VyLCBidXQgYWJsZSB0byBmaWd1cmUgb3V0IGFueSBwb3NpdGlvblxuICAgICAgdmFyIGxlbiA9IGRyb3BUYXJnZXQuY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgdmFyIGk7XG4gICAgICB2YXIgZWw7XG4gICAgICB2YXIgcmVjdDtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBlbCA9IGRyb3BUYXJnZXQuY2hpbGRyZW5baV07XG4gICAgICAgIHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgaWYgKGhvcml6b250YWwgJiYgKHJlY3QubGVmdCArIHJlY3Qud2lkdGggLyAyKSA+IHgpIHsgcmV0dXJuIGVsOyB9XG4gICAgICAgIGlmICghaG9yaXpvbnRhbCAmJiAocmVjdC50b3AgKyByZWN0LmhlaWdodCAvIDIpID4geSkgeyByZXR1cm4gZWw7IH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc2lkZSAoKSB7IC8vIGZhc3RlciwgYnV0IG9ubHkgYXZhaWxhYmxlIGlmIGRyb3BwZWQgaW5zaWRlIGEgY2hpbGQgZWxlbWVudFxuICAgICAgdmFyIHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBpZiAoaG9yaXpvbnRhbCkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSh4ID4gcmVjdC5sZWZ0ICsgZ2V0UmVjdFdpZHRoKHJlY3QpIC8gMik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzb2x2ZSh5ID4gcmVjdC50b3AgKyBnZXRSZWN0SGVpZ2h0KHJlY3QpIC8gMik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZSAoYWZ0ZXIpIHtcbiAgICAgIHJldHVybiBhZnRlciA/IG5leHRFbCh0YXJnZXQpIDogdGFyZ2V0O1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQ29weSAoaXRlbSwgY29udGFpbmVyKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvLmNvcHkgPT09ICdib29sZWFuJyA/IG8uY29weSA6IG8uY29weShpdGVtLCBjb250YWluZXIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHRvdWNoeSAoZWwsIG9wLCB0eXBlLCBmbikge1xuICB2YXIgdG91Y2ggPSB7XG4gICAgbW91c2V1cDogJ3RvdWNoZW5kJyxcbiAgICBtb3VzZWRvd246ICd0b3VjaHN0YXJ0JyxcbiAgICBtb3VzZW1vdmU6ICd0b3VjaG1vdmUnXG4gIH07XG4gIHZhciBwb2ludGVycyA9IHtcbiAgICBtb3VzZXVwOiAncG9pbnRlcnVwJyxcbiAgICBtb3VzZWRvd246ICdwb2ludGVyZG93bicsXG4gICAgbW91c2Vtb3ZlOiAncG9pbnRlcm1vdmUnXG4gIH07XG4gIHZhciBtaWNyb3NvZnQgPSB7XG4gICAgbW91c2V1cDogJ01TUG9pbnRlclVwJyxcbiAgICBtb3VzZWRvd246ICdNU1BvaW50ZXJEb3duJyxcbiAgICBtb3VzZW1vdmU6ICdNU1BvaW50ZXJNb3ZlJ1xuICB9O1xuICBpZiAoZ2xvYmFsLm5hdmlnYXRvci5wb2ludGVyRW5hYmxlZCkge1xuICAgIGNyb3NzdmVudFtvcF0oZWwsIHBvaW50ZXJzW3R5cGVdLCBmbik7XG4gIH0gZWxzZSBpZiAoZ2xvYmFsLm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkKSB7XG4gICAgY3Jvc3N2ZW50W29wXShlbCwgbWljcm9zb2Z0W3R5cGVdLCBmbik7XG4gIH0gZWxzZSB7XG4gICAgY3Jvc3N2ZW50W29wXShlbCwgdG91Y2hbdHlwZV0sIGZuKTtcbiAgICBjcm9zc3ZlbnRbb3BdKGVsLCB0eXBlLCBmbik7XG4gIH1cbn1cblxuZnVuY3Rpb24gd2hpY2hNb3VzZUJ1dHRvbiAoZSkge1xuICBpZiAoZS50b3VjaGVzICE9PSB2b2lkIDApIHsgcmV0dXJuIGUudG91Y2hlcy5sZW5ndGg7IH1cbiAgaWYgKGUud2hpY2ggIT09IHZvaWQgMCAmJiBlLndoaWNoICE9PSAwKSB7IHJldHVybiBlLndoaWNoOyB9IC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vYmV2YWNxdWEvZHJhZ3VsYS9pc3N1ZXMvMjYxXG4gIGlmIChlLmJ1dHRvbnMgIT09IHZvaWQgMCkgeyByZXR1cm4gZS5idXR0b25zOyB9XG4gIHZhciBidXR0b24gPSBlLmJ1dHRvbjtcbiAgaWYgKGJ1dHRvbiAhPT0gdm9pZCAwKSB7IC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L2pxdWVyeS9ibG9iLzk5ZThmZjFiYWE3YWUzNDFlOTRiYjg5YzNlODQ1NzBjN2MzYWQ5ZWEvc3JjL2V2ZW50LmpzI0w1NzMtTDU3NVxuICAgIHJldHVybiBidXR0b24gJiAxID8gMSA6IGJ1dHRvbiAmIDIgPyAzIDogKGJ1dHRvbiAmIDQgPyAyIDogMCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0T2Zmc2V0IChlbCkge1xuICB2YXIgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICByZXR1cm4ge1xuICAgIGxlZnQ6IHJlY3QubGVmdCArIGdldFNjcm9sbCgnc2Nyb2xsTGVmdCcsICdwYWdlWE9mZnNldCcpLFxuICAgIHRvcDogcmVjdC50b3AgKyBnZXRTY3JvbGwoJ3Njcm9sbFRvcCcsICdwYWdlWU9mZnNldCcpXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldFNjcm9sbCAoc2Nyb2xsUHJvcCwgb2Zmc2V0UHJvcCkge1xuICBpZiAodHlwZW9mIGdsb2JhbFtvZmZzZXRQcm9wXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZ2xvYmFsW29mZnNldFByb3BdO1xuICB9XG4gIGlmIChkb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSB7XG4gICAgcmV0dXJuIGRvY3VtZW50RWxlbWVudFtzY3JvbGxQcm9wXTtcbiAgfVxuICByZXR1cm4gZG9jLmJvZHlbc2Nyb2xsUHJvcF07XG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnRCZWhpbmRQb2ludCAocG9pbnQsIHgsIHkpIHtcbiAgdmFyIHAgPSBwb2ludCB8fCB7fTtcbiAgdmFyIHN0YXRlID0gcC5jbGFzc05hbWU7XG4gIHZhciBlbDtcbiAgcC5jbGFzc05hbWUgKz0gJyBndS1oaWRlJztcbiAgZWwgPSBkb2MuZWxlbWVudEZyb21Qb2ludCh4LCB5KTtcbiAgcC5jbGFzc05hbWUgPSBzdGF0ZTtcbiAgcmV0dXJuIGVsO1xufVxuXG5mdW5jdGlvbiBuZXZlciAoKSB7IHJldHVybiBmYWxzZTsgfVxuZnVuY3Rpb24gYWx3YXlzICgpIHsgcmV0dXJuIHRydWU7IH1cbmZ1bmN0aW9uIGdldFJlY3RXaWR0aCAocmVjdCkgeyByZXR1cm4gcmVjdC53aWR0aCB8fCAocmVjdC5yaWdodCAtIHJlY3QubGVmdCk7IH1cbmZ1bmN0aW9uIGdldFJlY3RIZWlnaHQgKHJlY3QpIHsgcmV0dXJuIHJlY3QuaGVpZ2h0IHx8IChyZWN0LmJvdHRvbSAtIHJlY3QudG9wKTsgfVxuZnVuY3Rpb24gZ2V0UGFyZW50IChlbCkgeyByZXR1cm4gZWwucGFyZW50Tm9kZSA9PT0gZG9jID8gbnVsbCA6IGVsLnBhcmVudE5vZGU7IH1cbmZ1bmN0aW9uIGlzSW5wdXQgKGVsKSB7IHJldHVybiBlbC50YWdOYW1lID09PSAnSU5QVVQnIHx8IGVsLnRhZ05hbWUgPT09ICdURVhUQVJFQScgfHwgZWwudGFnTmFtZSA9PT0gJ1NFTEVDVCcgfHwgaXNFZGl0YWJsZShlbCk7IH1cbmZ1bmN0aW9uIGlzRWRpdGFibGUgKGVsKSB7XG4gIGlmICghZWwpIHsgcmV0dXJuIGZhbHNlOyB9IC8vIG5vIHBhcmVudHMgd2VyZSBlZGl0YWJsZVxuICBpZiAoZWwuY29udGVudEVkaXRhYmxlID09PSAnZmFsc2UnKSB7IHJldHVybiBmYWxzZTsgfSAvLyBzdG9wIHRoZSBsb29rdXBcbiAgaWYgKGVsLmNvbnRlbnRFZGl0YWJsZSA9PT0gJ3RydWUnKSB7IHJldHVybiB0cnVlOyB9IC8vIGZvdW5kIGEgY29udGVudEVkaXRhYmxlIGVsZW1lbnQgaW4gdGhlIGNoYWluXG4gIHJldHVybiBpc0VkaXRhYmxlKGdldFBhcmVudChlbCkpOyAvLyBjb250ZW50RWRpdGFibGUgaXMgc2V0IHRvICdpbmhlcml0J1xufVxuXG5mdW5jdGlvbiBuZXh0RWwgKGVsKSB7XG4gIHJldHVybiBlbC5uZXh0RWxlbWVudFNpYmxpbmcgfHwgbWFudWFsbHkoKTtcbiAgZnVuY3Rpb24gbWFudWFsbHkgKCkge1xuICAgIHZhciBzaWJsaW5nID0gZWw7XG4gICAgZG8ge1xuICAgICAgc2libGluZyA9IHNpYmxpbmcubmV4dFNpYmxpbmc7XG4gICAgfSB3aGlsZSAoc2libGluZyAmJiBzaWJsaW5nLm5vZGVUeXBlICE9PSAxKTtcbiAgICByZXR1cm4gc2libGluZztcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRFdmVudEhvc3QgKGUpIHtcbiAgLy8gb24gdG91Y2hlbmQgZXZlbnQsIHdlIGhhdmUgdG8gdXNlIGBlLmNoYW5nZWRUb3VjaGVzYFxuICAvLyBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83MTkyNTYzL3RvdWNoZW5kLWV2ZW50LXByb3BlcnRpZXNcbiAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXZhY3F1YS9kcmFndWxhL2lzc3Vlcy8zNFxuICBpZiAoZS50YXJnZXRUb3VjaGVzICYmIGUudGFyZ2V0VG91Y2hlcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gZS50YXJnZXRUb3VjaGVzWzBdO1xuICB9XG4gIGlmIChlLmNoYW5nZWRUb3VjaGVzICYmIGUuY2hhbmdlZFRvdWNoZXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGUuY2hhbmdlZFRvdWNoZXNbMF07XG4gIH1cbiAgcmV0dXJuIGU7XG59XG5cbmZ1bmN0aW9uIGdldENvb3JkIChjb29yZCwgZSkge1xuICB2YXIgaG9zdCA9IGdldEV2ZW50SG9zdChlKTtcbiAgdmFyIG1pc3NNYXAgPSB7XG4gICAgcGFnZVg6ICdjbGllbnRYJywgLy8gSUU4XG4gICAgcGFnZVk6ICdjbGllbnRZJyAvLyBJRThcbiAgfTtcbiAgaWYgKGNvb3JkIGluIG1pc3NNYXAgJiYgIShjb29yZCBpbiBob3N0KSAmJiBtaXNzTWFwW2Nvb3JkXSBpbiBob3N0KSB7XG4gICAgY29vcmQgPSBtaXNzTWFwW2Nvb3JkXTtcbiAgfVxuICByZXR1cm4gaG9zdFtjb29yZF07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZHJhZ3VsYTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRpY2t5ID0gcmVxdWlyZSgndGlja3knKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWJvdW5jZSAoZm4sIGFyZ3MsIGN0eCkge1xuICBpZiAoIWZuKSB7IHJldHVybjsgfVxuICB0aWNreShmdW5jdGlvbiBydW4gKCkge1xuICAgIGZuLmFwcGx5KGN0eCB8fCBudWxsLCBhcmdzIHx8IFtdKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXRvYSA9IHJlcXVpcmUoJ2F0b2EnKTtcbnZhciBkZWJvdW5jZSA9IHJlcXVpcmUoJy4vZGVib3VuY2UnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbWl0dGVyICh0aGluZywgb3B0aW9ucykge1xuICB2YXIgb3B0cyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBldnQgPSB7fTtcbiAgaWYgKHRoaW5nID09PSB1bmRlZmluZWQpIHsgdGhpbmcgPSB7fTsgfVxuICB0aGluZy5vbiA9IGZ1bmN0aW9uICh0eXBlLCBmbikge1xuICAgIGlmICghZXZ0W3R5cGVdKSB7XG4gICAgICBldnRbdHlwZV0gPSBbZm5dO1xuICAgIH0gZWxzZSB7XG4gICAgICBldnRbdHlwZV0ucHVzaChmbik7XG4gICAgfVxuICAgIHJldHVybiB0aGluZztcbiAgfTtcbiAgdGhpbmcub25jZSA9IGZ1bmN0aW9uICh0eXBlLCBmbikge1xuICAgIGZuLl9vbmNlID0gdHJ1ZTsgLy8gdGhpbmcub2ZmKGZuKSBzdGlsbCB3b3JrcyFcbiAgICB0aGluZy5vbih0eXBlLCBmbik7XG4gICAgcmV0dXJuIHRoaW5nO1xuICB9O1xuICB0aGluZy5vZmYgPSBmdW5jdGlvbiAodHlwZSwgZm4pIHtcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgaWYgKGMgPT09IDEpIHtcbiAgICAgIGRlbGV0ZSBldnRbdHlwZV07XG4gICAgfSBlbHNlIGlmIChjID09PSAwKSB7XG4gICAgICBldnQgPSB7fTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGV0ID0gZXZ0W3R5cGVdO1xuICAgICAgaWYgKCFldCkgeyByZXR1cm4gdGhpbmc7IH1cbiAgICAgIGV0LnNwbGljZShldC5pbmRleE9mKGZuKSwgMSk7XG4gICAgfVxuICAgIHJldHVybiB0aGluZztcbiAgfTtcbiAgdGhpbmcuZW1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJncyA9IGF0b2EoYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpbmcuZW1pdHRlclNuYXBzaG90KGFyZ3Muc2hpZnQoKSkuYXBwbHkodGhpcywgYXJncyk7XG4gIH07XG4gIHRoaW5nLmVtaXR0ZXJTbmFwc2hvdCA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgdmFyIGV0ID0gKGV2dFt0eXBlXSB8fCBbXSkuc2xpY2UoMCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBhcmdzID0gYXRvYShhcmd1bWVudHMpO1xuICAgICAgdmFyIGN0eCA9IHRoaXMgfHwgdGhpbmc7XG4gICAgICBpZiAodHlwZSA9PT0gJ2Vycm9yJyAmJiBvcHRzLnRocm93cyAhPT0gZmFsc2UgJiYgIWV0Lmxlbmd0aCkgeyB0aHJvdyBhcmdzLmxlbmd0aCA9PT0gMSA/IGFyZ3NbMF0gOiBhcmdzOyB9XG4gICAgICBldC5mb3JFYWNoKGZ1bmN0aW9uIGVtaXR0ZXIgKGxpc3Rlbikge1xuICAgICAgICBpZiAob3B0cy5hc3luYykgeyBkZWJvdW5jZShsaXN0ZW4sIGFyZ3MsIGN0eCk7IH0gZWxzZSB7IGxpc3Rlbi5hcHBseShjdHgsIGFyZ3MpOyB9XG4gICAgICAgIGlmIChsaXN0ZW4uX29uY2UpIHsgdGhpbmcub2ZmKHR5cGUsIGxpc3Rlbik7IH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaW5nO1xuICAgIH07XG4gIH07XG4gIHJldHVybiB0aGluZztcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0b2EgKGEsIG4pIHsgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGEsIG4pOyB9XG4iLCJ2YXIgc2kgPSB0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAnZnVuY3Rpb24nLCB0aWNrO1xuaWYgKHNpKSB7XG4gIHRpY2sgPSBmdW5jdGlvbiAoZm4pIHsgc2V0SW1tZWRpYXRlKGZuKTsgfTtcbn0gZWxzZSB7XG4gIHRpY2sgPSBmdW5jdGlvbiAoZm4pIHsgc2V0VGltZW91dChmbiwgMCk7IH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGljazsiLCJcbnZhciBOYXRpdmVDdXN0b21FdmVudCA9IGdsb2JhbC5DdXN0b21FdmVudDtcblxuZnVuY3Rpb24gdXNlTmF0aXZlICgpIHtcbiAgdHJ5IHtcbiAgICB2YXIgcCA9IG5ldyBOYXRpdmVDdXN0b21FdmVudCgnY2F0JywgeyBkZXRhaWw6IHsgZm9vOiAnYmFyJyB9IH0pO1xuICAgIHJldHVybiAgJ2NhdCcgPT09IHAudHlwZSAmJiAnYmFyJyA9PT0gcC5kZXRhaWwuZm9vO1xuICB9IGNhdGNoIChlKSB7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENyb3NzLWJyb3dzZXIgYEN1c3RvbUV2ZW50YCBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ3VzdG9tRXZlbnQuQ3VzdG9tRXZlbnRcbiAqXG4gKiBAcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB1c2VOYXRpdmUoKSA/IE5hdGl2ZUN1c3RvbUV2ZW50IDpcblxuLy8gSUUgPj0gOVxuJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUV2ZW50ID8gZnVuY3Rpb24gQ3VzdG9tRXZlbnQgKHR5cGUsIHBhcmFtcykge1xuICB2YXIgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICBpZiAocGFyYW1zKSB7XG4gICAgZS5pbml0Q3VzdG9tRXZlbnQodHlwZSwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlLCBwYXJhbXMuZGV0YWlsKTtcbiAgfSBlbHNlIHtcbiAgICBlLmluaXRDdXN0b21FdmVudCh0eXBlLCBmYWxzZSwgZmFsc2UsIHZvaWQgMCk7XG4gIH1cbiAgcmV0dXJuIGU7XG59IDpcblxuLy8gSUUgPD0gOFxuZnVuY3Rpb24gQ3VzdG9tRXZlbnQgKHR5cGUsIHBhcmFtcykge1xuICB2YXIgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50T2JqZWN0KCk7XG4gIGUudHlwZSA9IHR5cGU7XG4gIGlmIChwYXJhbXMpIHtcbiAgICBlLmJ1YmJsZXMgPSBCb29sZWFuKHBhcmFtcy5idWJibGVzKTtcbiAgICBlLmNhbmNlbGFibGUgPSBCb29sZWFuKHBhcmFtcy5jYW5jZWxhYmxlKTtcbiAgICBlLmRldGFpbCA9IHBhcmFtcy5kZXRhaWw7XG4gIH0gZWxzZSB7XG4gICAgZS5idWJibGVzID0gZmFsc2U7XG4gICAgZS5jYW5jZWxhYmxlID0gZmFsc2U7XG4gICAgZS5kZXRhaWwgPSB2b2lkIDA7XG4gIH1cbiAgcmV0dXJuIGU7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjdXN0b21FdmVudCA9IHJlcXVpcmUoJ2N1c3RvbS1ldmVudCcpO1xudmFyIGV2ZW50bWFwID0gcmVxdWlyZSgnLi9ldmVudG1hcCcpO1xudmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudDtcbnZhciBhZGRFdmVudCA9IGFkZEV2ZW50RWFzeTtcbnZhciByZW1vdmVFdmVudCA9IHJlbW92ZUV2ZW50RWFzeTtcbnZhciBoYXJkQ2FjaGUgPSBbXTtcblxuaWYgKCFnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcikge1xuICBhZGRFdmVudCA9IGFkZEV2ZW50SGFyZDtcbiAgcmVtb3ZlRXZlbnQgPSByZW1vdmVFdmVudEhhcmQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGQ6IGFkZEV2ZW50LFxuICByZW1vdmU6IHJlbW92ZUV2ZW50LFxuICBmYWJyaWNhdGU6IGZhYnJpY2F0ZUV2ZW50XG59O1xuXG5mdW5jdGlvbiBhZGRFdmVudEVhc3kgKGVsLCB0eXBlLCBmbiwgY2FwdHVyaW5nKSB7XG4gIHJldHVybiBlbC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGZuLCBjYXB0dXJpbmcpO1xufVxuXG5mdW5jdGlvbiBhZGRFdmVudEhhcmQgKGVsLCB0eXBlLCBmbikge1xuICByZXR1cm4gZWwuYXR0YWNoRXZlbnQoJ29uJyArIHR5cGUsIHdyYXAoZWwsIHR5cGUsIGZuKSk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50RWFzeSAoZWwsIHR5cGUsIGZuLCBjYXB0dXJpbmcpIHtcbiAgcmV0dXJuIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgZm4sIGNhcHR1cmluZyk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50SGFyZCAoZWwsIHR5cGUsIGZuKSB7XG4gIHZhciBsaXN0ZW5lciA9IHVud3JhcChlbCwgdHlwZSwgZm4pO1xuICBpZiAobGlzdGVuZXIpIHtcbiAgICByZXR1cm4gZWwuZGV0YWNoRXZlbnQoJ29uJyArIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmYWJyaWNhdGVFdmVudCAoZWwsIHR5cGUsIG1vZGVsKSB7XG4gIHZhciBlID0gZXZlbnRtYXAuaW5kZXhPZih0eXBlKSA9PT0gLTEgPyBtYWtlQ3VzdG9tRXZlbnQoKSA6IG1ha2VDbGFzc2ljRXZlbnQoKTtcbiAgaWYgKGVsLmRpc3BhdGNoRXZlbnQpIHtcbiAgICBlbC5kaXNwYXRjaEV2ZW50KGUpO1xuICB9IGVsc2Uge1xuICAgIGVsLmZpcmVFdmVudCgnb24nICsgdHlwZSwgZSk7XG4gIH1cbiAgZnVuY3Rpb24gbWFrZUNsYXNzaWNFdmVudCAoKSB7XG4gICAgdmFyIGU7XG4gICAgaWYgKGRvYy5jcmVhdGVFdmVudCkge1xuICAgICAgZSA9IGRvYy5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgIGUuaW5pdEV2ZW50KHR5cGUsIHRydWUsIHRydWUpO1xuICAgIH0gZWxzZSBpZiAoZG9jLmNyZWF0ZUV2ZW50T2JqZWN0KSB7XG4gICAgICBlID0gZG9jLmNyZWF0ZUV2ZW50T2JqZWN0KCk7XG4gICAgfVxuICAgIHJldHVybiBlO1xuICB9XG4gIGZ1bmN0aW9uIG1ha2VDdXN0b21FdmVudCAoKSB7XG4gICAgcmV0dXJuIG5ldyBjdXN0b21FdmVudCh0eXBlLCB7IGRldGFpbDogbW9kZWwgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gd3JhcHBlckZhY3RvcnkgKGVsLCB0eXBlLCBmbikge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcHBlciAob3JpZ2luYWxFdmVudCkge1xuICAgIHZhciBlID0gb3JpZ2luYWxFdmVudCB8fCBnbG9iYWwuZXZlbnQ7XG4gICAgZS50YXJnZXQgPSBlLnRhcmdldCB8fCBlLnNyY0VsZW1lbnQ7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCA9IGUucHJldmVudERlZmF1bHQgfHwgZnVuY3Rpb24gcHJldmVudERlZmF1bHQgKCkgeyBlLnJldHVyblZhbHVlID0gZmFsc2U7IH07XG4gICAgZS5zdG9wUHJvcGFnYXRpb24gPSBlLnN0b3BQcm9wYWdhdGlvbiB8fCBmdW5jdGlvbiBzdG9wUHJvcGFnYXRpb24gKCkgeyBlLmNhbmNlbEJ1YmJsZSA9IHRydWU7IH07XG4gICAgZS53aGljaCA9IGUud2hpY2ggfHwgZS5rZXlDb2RlO1xuICAgIGZuLmNhbGwoZWwsIGUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiB3cmFwIChlbCwgdHlwZSwgZm4pIHtcbiAgdmFyIHdyYXBwZXIgPSB1bndyYXAoZWwsIHR5cGUsIGZuKSB8fCB3cmFwcGVyRmFjdG9yeShlbCwgdHlwZSwgZm4pO1xuICBoYXJkQ2FjaGUucHVzaCh7XG4gICAgd3JhcHBlcjogd3JhcHBlcixcbiAgICBlbGVtZW50OiBlbCxcbiAgICB0eXBlOiB0eXBlLFxuICAgIGZuOiBmblxuICB9KTtcbiAgcmV0dXJuIHdyYXBwZXI7XG59XG5cbmZ1bmN0aW9uIHVud3JhcCAoZWwsIHR5cGUsIGZuKSB7XG4gIHZhciBpID0gZmluZChlbCwgdHlwZSwgZm4pO1xuICBpZiAoaSkge1xuICAgIHZhciB3cmFwcGVyID0gaGFyZENhY2hlW2ldLndyYXBwZXI7XG4gICAgaGFyZENhY2hlLnNwbGljZShpLCAxKTsgLy8gZnJlZSB1cCBhIHRhZCBvZiBtZW1vcnlcbiAgICByZXR1cm4gd3JhcHBlcjtcbiAgfVxufVxuXG5mdW5jdGlvbiBmaW5kIChlbCwgdHlwZSwgZm4pIHtcbiAgdmFyIGksIGl0ZW07XG4gIGZvciAoaSA9IDA7IGkgPCBoYXJkQ2FjaGUubGVuZ3RoOyBpKyspIHtcbiAgICBpdGVtID0gaGFyZENhY2hlW2ldO1xuICAgIGlmIChpdGVtLmVsZW1lbnQgPT09IGVsICYmIGl0ZW0udHlwZSA9PT0gdHlwZSAmJiBpdGVtLmZuID09PSBmbikge1xuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBldmVudG1hcCA9IFtdO1xudmFyIGV2ZW50bmFtZSA9ICcnO1xudmFyIHJvbiA9IC9eb24vO1xuXG5mb3IgKGV2ZW50bmFtZSBpbiBnbG9iYWwpIHtcbiAgaWYgKHJvbi50ZXN0KGV2ZW50bmFtZSkpIHtcbiAgICBldmVudG1hcC5wdXNoKGV2ZW50bmFtZS5zbGljZSgyKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBldmVudG1hcDtcbiJdfQ==

/*
  SortTable
  version 2
  7th April 2007
  Stuart Langridge, http://www.kryogenix.org/code/browser/sorttable/

  Instructions:
  Download this file
  Add <script src="sorttable.js"></script> to your HTML
  Add class="sortable" to any table you'd like to make sortable
  Click on the headers to sort

  Thanks to many, many people for contributions and suggestions.
  Licenced as X11: http://www.kryogenix.org/code/browser/licence.html
  This basically means: do what you want with it.
*/


var stIsIE = /*@cc_on!@*/false;

sorttable = {
  init: function() {
    // quit if this function has already been called
    if (arguments.callee.done) return;
    // flag this function so we don't do the same thing twice
    arguments.callee.done = true;
    // kill the timer
    if (_timer) clearInterval(_timer);

    if (!document.createElement || !document.getElementsByTagName) return;

    sorttable.DATE_RE = /^(\d\d?)[\/\.-](\d\d?)[\/\.-]((\d\d)?\d\d)$/;

    forEach(document.getElementsByTagName('table'), function(table) {
      if (table.className.search(/\bsortable\b/) != -1) {
        sorttable.makeSortable(table);
      }
    });

  },

  makeSortable: function(table) {
    if (table.getElementsByTagName('thead').length == 0) {
      // table doesn't have a tHead. Since it should have, create one and
      // put the first table row in it.
      the = document.createElement('thead');
      the.appendChild(table.rows[0]);
      table.insertBefore(the,table.firstChild);
    }
    // Safari doesn't support table.tHead, sigh
    if (table.tHead == null) table.tHead = table.getElementsByTagName('thead')[0];

    if (table.tHead.rows.length != 1) return; // can't cope with two header rows

    // Sorttable v1 put rows with a class of "sortbottom" at the bottom (as
    // "total" rows, for example). This is B&R, since what you're supposed
    // to do is put them in a tfoot. So, if there are sortbottom rows,
    // for backwards compatibility, move them to tfoot (creating it if needed).
    sortbottomrows = [];
    for (var i=0; i<table.rows.length; i++) {
      if (table.rows[i].className.search(/\bsortbottom\b/) != -1) {
        sortbottomrows[sortbottomrows.length] = table.rows[i];
      }
    }
    if (sortbottomrows) {
      if (table.tFoot == null) {
        // table doesn't have a tfoot. Create one.
        tfo = document.createElement('tfoot');
        table.appendChild(tfo);
      }
      for (var i=0; i<sortbottomrows.length; i++) {
        tfo.appendChild(sortbottomrows[i]);
      }
      delete sortbottomrows;
    }

    // work through each column and calculate its type
    headrow = table.tHead.rows[0].cells;
    for (var i=0; i<headrow.length; i++) {
      // manually override the type with a sorttable_type attribute
      if (!headrow[i].className.match(/\bsorttable_nosort\b/)) { // skip this col
        mtch = headrow[i].className.match(/\bsorttable_([a-z0-9]+)\b/);
        if (mtch) { override = mtch[1]; }
	      if (mtch && typeof sorttable["sort_"+override] == 'function') {
	        headrow[i].sorttable_sortfunction = sorttable["sort_"+override];
	      } else {
	        headrow[i].sorttable_sortfunction = sorttable.guessType(table,i);
	      }
	      // make it clickable to sort
	      headrow[i].sorttable_columnindex = i;
	      headrow[i].sorttable_tbody = table.tBodies[0];
	      dean_addEvent(headrow[i],"click", sorttable.innerSortFunction = function(e) {

          if (this.className.search(/\bsorttable_sorted\b/) != -1) {
            // if we're already sorted by this column, just
            // reverse the table, which is quicker
            sorttable.reverse(this.sorttable_tbody);
            this.className = this.className.replace('sorttable_sorted',
                                                    'sorttable_sorted_reverse');
            this.removeChild(document.getElementById('sorttable_sortfwdind'));
            sortrevind = document.createElement('span');
            sortrevind.id = "sorttable_sortrevind";
            sortrevind.innerHTML = stIsIE ? '&nbsp<font face="webdings">5</font>' : '&nbsp;&#x25B4;';
            this.appendChild(sortrevind);
            return;
          }
          if (this.className.search(/\bsorttable_sorted_reverse\b/) != -1) {
            // if we're already sorted by this column in reverse, just
            // re-reverse the table, which is quicker
            sorttable.reverse(this.sorttable_tbody);
            this.className = this.className.replace('sorttable_sorted_reverse',
                                                    'sorttable_sorted');
            this.removeChild(document.getElementById('sorttable_sortrevind'));
            sortfwdind = document.createElement('span');
            sortfwdind.id = "sorttable_sortfwdind";
            sortfwdind.innerHTML = stIsIE ? '&nbsp<font face="webdings">6</font>' : '&nbsp;&#x25BE;';
            this.appendChild(sortfwdind);
            return;
          }

          // remove sorttable_sorted classes
          theadrow = this.parentNode;
          forEach(theadrow.childNodes, function(cell) {
            if (cell.nodeType == 1) { // an element
              cell.className = cell.className.replace('sorttable_sorted_reverse','');
              cell.className = cell.className.replace('sorttable_sorted','');
            }
          });
          sortfwdind = document.getElementById('sorttable_sortfwdind');
          if (sortfwdind) { sortfwdind.parentNode.removeChild(sortfwdind); }
          sortrevind = document.getElementById('sorttable_sortrevind');
          if (sortrevind) { sortrevind.parentNode.removeChild(sortrevind); }

          this.className += ' sorttable_sorted';
          sortfwdind = document.createElement('span');
          sortfwdind.id = "sorttable_sortfwdind";
          sortfwdind.innerHTML = stIsIE ? '&nbsp<font face="webdings">6</font>' : '&nbsp;&#x25BE;';
          this.appendChild(sortfwdind);

	        // build an array to sort. This is a Schwartzian transform thing,
	        // i.e., we "decorate" each row with the actual sort key,
	        // sort based on the sort keys, and then put the rows back in order
	        // which is a lot faster because you only do getInnerText once per row
	        row_array = [];
	        col = this.sorttable_columnindex;
	        rows = this.sorttable_tbody.rows;
	        for (var j=0; j<rows.length; j++) {
	          row_array[row_array.length] = [sorttable.getInnerText(rows[j].cells[col]), rows[j]];
	        }
	        /* If you want a stable sort, uncomment the following line */
	        //sorttable.shaker_sort(row_array, this.sorttable_sortfunction);
	        /* and comment out this one */
	        row_array.sort(this.sorttable_sortfunction);

	        tb = this.sorttable_tbody;
	        for (var j=0; j<row_array.length; j++) {
	          tb.appendChild(row_array[j][1]);
	        }

	        delete row_array;
	      });
	    }
    }
  },

  guessType: function(table, column) {
    // guess the type of a column based on its first non-blank row
    sortfn = sorttable.sort_alpha;
    for (var i=0; i<table.tBodies[0].rows.length; i++) {
      text = sorttable.getInnerText(table.tBodies[0].rows[i].cells[column]);
      if (text != '') {
        if (text.match(/^-?[£$¤]?[\d,.]+%?$/)) {
          return sorttable.sort_numeric;
        }
        // check for a date: dd/mm/yyyy or dd/mm/yy
        // can have / or . or - as separator
        // can be mm/dd as well
        possdate = text.match(sorttable.DATE_RE)
        if (possdate) {
          // looks like a date
          first = parseInt(possdate[1]);
          second = parseInt(possdate[2]);
          if (first > 12) {
            // definitely dd/mm
            return sorttable.sort_ddmm;
          } else if (second > 12) {
            return sorttable.sort_mmdd;
          } else {
            // looks like a date, but we can't tell which, so assume
            // that it's dd/mm (English imperialism!) and keep looking
            sortfn = sorttable.sort_ddmm;
          }
        }
      }
    }
    return sortfn;
  },

  getInnerText: function(node) {
    // gets the text we want to use for sorting for a cell.
    // strips leading and trailing whitespace.
    // this is *not* a generic getInnerText function; it's special to sorttable.
    // for example, you can override the cell text with a customkey attribute.
    // it also gets .value for <input> fields.

    if (!node) return "";

    hasInputs = (typeof node.getElementsByTagName == 'function') &&
                 node.getElementsByTagName('input').length;

    if (node.getAttribute("sorttable_customkey") != null) {
      return node.getAttribute("sorttable_customkey");
    }
    else if (typeof node.textContent != 'undefined' && !hasInputs) {
      return node.textContent.replace(/^\s+|\s+$/g, '');
    }
    else if (typeof node.innerText != 'undefined' && !hasInputs) {
      return node.innerText.replace(/^\s+|\s+$/g, '');
    }
    else if (typeof node.text != 'undefined' && !hasInputs) {
      return node.text.replace(/^\s+|\s+$/g, '');
    }
    else {
      switch (node.nodeType) {
        case 3:
          if (node.nodeName.toLowerCase() == 'input') {
            return node.value.replace(/^\s+|\s+$/g, '');
          }
        case 4:
          return node.nodeValue.replace(/^\s+|\s+$/g, '');
          break;
        case 1:
        case 11:
          var innerText = '';
          for (var i = 0; i < node.childNodes.length; i++) {
            innerText += sorttable.getInnerText(node.childNodes[i]);
          }
          return innerText.replace(/^\s+|\s+$/g, '');
          break;
        default:
          return '';
      }
    }
  },

  reverse: function(tbody) {
    // reverse the rows in a tbody
    newrows = [];
    for (var i=0; i<tbody.rows.length; i++) {
      newrows[newrows.length] = tbody.rows[i];
    }
    for (var i=newrows.length-1; i>=0; i--) {
       tbody.appendChild(newrows[i]);
    }
    delete newrows;
  },

  /* sort functions
     each sort function takes two parameters, a and b
     you are comparing a[0] and b[0] */
  sort_numeric: function(a,b) {
    aa = parseFloat(a[0].replace(/[^0-9.-]/g,''));
    if (isNaN(aa)) aa = 0;
    bb = parseFloat(b[0].replace(/[^0-9.-]/g,''));
    if (isNaN(bb)) bb = 0;
    return aa-bb;
  },
  sort_alpha: function(a,b) {
    if (a[0]==b[0]) return 0;
    if (a[0]<b[0]) return -1;
    return 1;
  },
  sort_ddmm: function(a,b) {
    mtch = a[0].match(sorttable.DATE_RE);
    y = mtch[3]; m = mtch[2]; d = mtch[1];
    if (m.length == 1) m = '0'+m;
    if (d.length == 1) d = '0'+d;
    dt1 = y+m+d;
    mtch = b[0].match(sorttable.DATE_RE);
    y = mtch[3]; m = mtch[2]; d = mtch[1];
    if (m.length == 1) m = '0'+m;
    if (d.length == 1) d = '0'+d;
    dt2 = y+m+d;
    if (dt1==dt2) return 0;
    if (dt1<dt2) return -1;
    return 1;
  },
  sort_mmdd: function(a,b) {
    mtch = a[0].match(sorttable.DATE_RE);
    y = mtch[3]; d = mtch[2]; m = mtch[1];
    if (m.length == 1) m = '0'+m;
    if (d.length == 1) d = '0'+d;
    dt1 = y+m+d;
    mtch = b[0].match(sorttable.DATE_RE);
    y = mtch[3]; d = mtch[2]; m = mtch[1];
    if (m.length == 1) m = '0'+m;
    if (d.length == 1) d = '0'+d;
    dt2 = y+m+d;
    if (dt1==dt2) return 0;
    if (dt1<dt2) return -1;
    return 1;
  },

  shaker_sort: function(list, comp_func) {
    // A stable sort function to allow multi-level sorting of data
    // see: http://en.wikipedia.org/wiki/Cocktail_sort
    // thanks to Joseph Nahmias
    var b = 0;
    var t = list.length - 1;
    var swap = true;

    while(swap) {
        swap = false;
        for(var i = b; i < t; ++i) {
            if ( comp_func(list[i], list[i+1]) > 0 ) {
                var q = list[i]; list[i] = list[i+1]; list[i+1] = q;
                swap = true;
            }
        } // for
        t--;

        if (!swap) break;

        for(var i = t; i > b; --i) {
            if ( comp_func(list[i], list[i-1]) < 0 ) {
                var q = list[i]; list[i] = list[i-1]; list[i-1] = q;
                swap = true;
            }
        } // for
        b++;

    } // while(swap)
  }
}

/* ******************************************************************
   Supporting functions: bundled here to avoid depending on a library
   ****************************************************************** */

// Dean Edwards/Matthias Miller/John Resig

/* for Mozilla/Opera9 */
if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", sorttable.init, false);
}

/* for Internet Explorer */
/*@cc_on @*/
/*@if (@_win32)
    document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
    var script = document.getElementById("__ie_onload");
    script.onreadystatechange = function() {
        if (this.readyState == "complete") {
            sorttable.init(); // call the onload handler
        }
    };
/*@end @*/

/* for Safari */
if (/WebKit/i.test(navigator.userAgent)) { // sniff
    var _timer = setInterval(function() {
        if (/loaded|complete/.test(document.readyState)) {
            sorttable.init(); // call the onload handler
        }
    }, 10);
}

/* for other browsers */
window.onload = sorttable.init;

// written by Dean Edwards, 2005
// with input from Tino Zijdel, Matthias Miller, Diego Perini

// http://dean.edwards.name/weblog/2005/10/add-event/

function dean_addEvent(element, type, handler) {
	if (element.addEventListener) {
		element.addEventListener(type, handler, false);
	} else {
		// assign each event handler a unique ID
		if (!handler.$$guid) handler.$$guid = dean_addEvent.guid++;
		// create a hash table of event types for the element
		if (!element.events) element.events = {};
		// create a hash table of event handlers for each element/event pair
		var handlers = element.events[type];
		if (!handlers) {
			handlers = element.events[type] = {};
			// store the existing event handler (if there is one)
			if (element["on" + type]) {
				handlers[0] = element["on" + type];
			}
		}
		// store the event handler in the hash table
		handlers[handler.$$guid] = handler;
		// assign a global event handler to do all the work
		element["on" + type] = handleEvent;
	}
};
// a counter used to create unique IDs
dean_addEvent.guid = 1;

function removeEvent(element, type, handler) {
	if (element.removeEventListener) {
		element.removeEventListener(type, handler, false);
	} else {
		// delete the event handler from the hash table
		if (element.events && element.events[type]) {
			delete element.events[type][handler.$$guid];
		}
	}
};

function handleEvent(event) {
	var returnValue = true;
	// grab the event object (IE uses a global event object)
	event = event || fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event);
	// get a reference to the hash table of event handlers
	var handlers = this.events[event.type];
	// execute each event handler
	for (var i in handlers) {
		this.$$handleEvent = handlers[i];
		if (this.$$handleEvent(event) === false) {
			returnValue = false;
		}
	}
	return returnValue;
};

function fixEvent(event) {
	// add W3C standard event methods
	event.preventDefault = fixEvent.preventDefault;
	event.stopPropagation = fixEvent.stopPropagation;
	return event;
};
fixEvent.preventDefault = function() {
	this.returnValue = false;
};
fixEvent.stopPropagation = function() {
  this.cancelBubble = true;
}

// Dean's forEach: http://dean.edwards.name/base/forEach.js
/*
	forEach, version 1.0
	Copyright 2006, Dean Edwards
	License: http://www.opensource.org/licenses/mit-license.php
*/

// array-like enumeration
if (!Array.forEach) { // mozilla already supports this
	Array.forEach = function(array, block, context) {
		for (var i = 0; i < array.length; i++) {
			block.call(context, array[i], i, array);
		}
	};
}

// generic enumeration
Function.prototype.forEach = function(object, block, context) {
	for (var key in object) {
		if (typeof this.prototype[key] == "undefined") {
			block.call(context, object[key], key, object);
		}
	}
};

// character enumeration
String.forEach = function(string, block, context) {
	Array.forEach(string.split(""), function(chr, index) {
		block.call(context, chr, index, string);
	});
};

// globally resolve forEach enumeration
var forEach = function(object, block, context) {
	if (object) {
		var resolve = Object; // default
		if (object instanceof Function) {
			// functions have a "length" property
			resolve = Function;
		} else if (object.forEach instanceof Function) {
			// the object implements a custom forEach method so use that
			object.forEach(block, context);
			return;
		} else if (typeof object == "string") {
			// the object is a string
			resolve = String;
		} else if (typeof object.length == "number") {
			// the object is array-like
			resolve = Array;
		}
		resolve.forEach(object, block, context);
	}
};

//- - - - - - - - - - - - - - - - - - - - - - - - 
// YPI Specific code.
//- - - - - - - - - - - - - - - - - - - - - - - -
	
var ypi = (function(){	

	//- - - - - - - - - - - - - - - - - - - - - - - -
	//	Set up Ground Work modules and components
	//- - - - - - - - - - - - - - - - - - - - - - - -
	
	groundWork.components.fields('.field-element');
	
	//- Header Animation
	var animate_header = new groundWork.modules.AnimateHeader('header-animate', {
		scrollDownThreshold: window.innerHeight, 
		scrollUpThreshold: 300,
		scrollSpeed: .5
	});
	
	
	//- - - - - - - - - - - - - - - - - - - - - - - -
	//	Create applicating schema
	//- - - - - - - - - - - - - - - - - - - - - - - -
	
	var ypi = {		
		home : function(){
			
			// - - - - - - - - - - - - - - - - - - - - - -
			// Cache ground work functions
			// - - - - - - - - - - - - - - - - - - - - - -
		
			var Validator = groundWork.Validator,
				modal = groundWork.modules.modal;
			
			// - - - - - - - - - - - - - - - - - - - - - -
			// Instantiate
			// - - - - - - - - - - - - - - - - - - - - - -
	
			var animateColor = new groundWork.modules.AnimateColor('.animate-color', {
				margin : 10,
				hue : -50,
				saturation : -15,
				lightness : 1,
				callback : function(el, change) {
					var img = el.querySelector('img');
					if(img){
						img.style.transform = 'scale(' +Number(+ 1 - (change * 0.15)) +') translateX('+ -change * 15 + '%)';
						img.style.opacity = 1 - change * 1.5;
					}
				}
			});
			groundWork.modules.parallax('.parallax');
			
			var sign_up_form = document.getElementById('singup-form');
				var validateForm = new Validator('singup-form', {
		      	success : function(event) { window.location = 'register.html' },
		      	fail	: function(err) { err.fields.forEach(function(err, i){ modal.toast(err, 3000 * i)});},
	      	});
			var validateForm2 = new Validator('singup-form-2', {
	      		success : function(event) { window.location = 'register.html' },
	      		fail	: function(err) { err.fields.forEach(function(err, i){ modal.toast(err, 3000 * i)});},
	      	});
		},
	};
	
	return ypi;
	
})();