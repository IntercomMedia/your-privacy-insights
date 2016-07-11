groundWork.modules.selectList = function(selector, options){
	
	function selectHandler(e) {
		e.preventDefault();
		var el = e.currentTarget,
			active = el.parentNode.querySelectorAll('.is-active');
			console.log(active);
		if(active.length) groundWork.utils.dom.removeClass(active,'is-active');
		groundWork.utils.dom.addClass(el, 'is-active');
	}
	
	groundWork.listenerManager.bind([selector + ' > *', function(el) {
		el.addEventListener('click', selectHandler);
	}]);
}