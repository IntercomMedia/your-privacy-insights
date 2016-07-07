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