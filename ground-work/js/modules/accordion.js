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
