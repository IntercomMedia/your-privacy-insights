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
