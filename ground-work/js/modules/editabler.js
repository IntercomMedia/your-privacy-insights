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
