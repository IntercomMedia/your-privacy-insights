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