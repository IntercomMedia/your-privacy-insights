groundWork.components.dropUpload = function(selector, options) {
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Cache GW utils
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	var utils = groundWork.utils;
	var dom = utils.dom;
	var createElement = dom.createElement;
	var addClass = dom.addClass;
	var removeClass = dom.removeClass;
	var forEach = dom.forEach;
	
	
	groundWork.listenerManager.bind([selector, imageDropZone]);
	
	options.type = options.type ? options.type : 'image';
	options.background = options.background ? options.background : false;
	
	// Main handler function
	function imageDropZone(element, index){
		inputEl = element.getElementsByClassName('upload');
		inputEl = inputEl[0];
		inputEl.addEventListener('change', handleImage, false);
		inputEl.addEventListener("dragover", FileDragHover, false);
		inputEl.addEventListener("dragleave", FileDragOut, false);
		inputEl.addEventListener("drop", FileDragOut, false);
	}
	
		
	function FileDragHover(event) {
		addClass(event.target.parentNode, 'image-over');
	}
	
	function FileDragOut(event) {
		removeClass(event.target.parentNode, 'image-over');
	}
	
	function handleImage(event) {
		var reader = new FileReader();
		reader.onload = function (e) {   
			var preview_img = event.target.parentNode.getElementsByClassName('preview-img')[0]
			if(options.background) preview_img = event.target.parentNode;
			preview_img.setAttribute('style', 'background-image: url(' + e.target.result + ');');
			addClass(preview_img,'is-active');
		}
		reader.readAsDataURL(event.target.files[0]);
	}
}