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