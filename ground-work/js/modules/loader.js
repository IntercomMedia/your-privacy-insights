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