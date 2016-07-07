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