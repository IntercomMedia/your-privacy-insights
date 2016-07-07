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