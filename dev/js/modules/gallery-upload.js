groundWork.modules.GalleryUpload = function(el, options) {
	
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Cache GW utils
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	var utils = groundWork.utils;
	var dom = utils.dom;
	var createElement = dom.createElement;
	var addClass = dom.addClass;
	var removeClass = dom.removeClass;
	var forEach = dom.forEach;
	
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Init properties
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	
	var self = this;
	this.options = {
		item_class : options.item_class ? options.item_class : 'drag-img-item',
		upload_name : options.upload_name ? options.upload_name : 'file_upload',
		detail_name : options.detail_name ? options.detail_name : 'title',
		detail_label : options.detail_label ? options.detail_label : 'Title',
	}
	
	this.el = document.getElementById(el);
	this.input = [this.el.querySelector('input')];
	this.files = [];
	this.count = 0;
	self.imageDropZone();
}

groundWork.modules.GalleryUpload.prototype.addFile = function(){
	
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Cache GW utils
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	var createElement = groundWork.utils.dom.createElement;
	
	this.count ++;
	var count = this.count
	var input = this.input[count] = createElement('input', '', 'gallery-upload-file', [{name : 'name', value : this.options.upload_name + '[]'}, {name : 'type', value : 'file'}]);
	input.style.display = 'none';
	this.el.insertBefore(this.input[this.count], this.input[this.count - 1]);
	this.imageDropZone();
	return  this.input[Number(this.count - 1)];
}

// Upload drag and drop functions
groundWork.modules.GalleryUpload.prototype.imageDropZone = function(){
	
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Cache GW utils
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	var utils = groundWork.utils;
	var dom = utils.dom;
	var createElement = dom.createElement;
	var addClass = dom.addClass;
	var removeClass = dom.removeClass;
	var forEach = dom.forEach;
	
	var self = this;
	inputEl = self.input[self.count];
	inputEl.addEventListener('change', handleImage, false);
	inputEl.addEventListener("dragleave", FileDragOut, false);
	inputEl.addEventListener("drop", FileDragOut, false);
	this.el.addEventListener('dragenter', FileDragHover, false);
		
	function FileDragHover(event) {
		addClass(self.el, 'image-over');
	}
	
	function FileDragOut(event) {
		removeClass(self.el, 'image-over');
	}
	
	function handleImage(event) {
		var reader = new FileReader();
		var files = event.target.files;
		reader.onload = function (e) {	        
	    	//Create
	    	var preview_img = event.target.parentNode,
	    		upload_item = createElement('div',  null, 'gallery-item ' + self.options.item_class),
	    		checkbox = createElement('input',  null, 'remove-upload-item', [{name :'type', value : 'checkbox'}, {name : 'value', value : 'nosave'}]),
	    		detailinput = createElement('div', null, 'add-detail'),
	    		img = document.createElement('img');
	    	
	    	//Define
	    	img.setAttribute('src', e.target.result);
	    	
	    	//Append
	    	upload_item.appendChild(checkbox);
	    	upload_item.appendChild(img);
	    	upload_item.appendChild(detailinput);
	    	preview_img.appendChild(upload_item);
	    	detailinput.innerHTML = '<input type="text" name="'+ self.options.detail_name +'[]" placeholder="'+ self.options.detail_label +'"><i class="icon"></i>';
	    	
	    	var file_input = self.addFile();
	    	
	    	// Events
	    	checkbox.addEventListener('click', function(event){
		    	if(event.target.checked == true) {
			    	file_input.disabled = true;
			    	upload_item.setAttribute('data-nosave', true);
		    	}else {
			    	file_input.disabled = false;
			    	upload_item.removeAttribute('data-nosave');
		    	}
	    	});
		}
		reader.readAsDataURL(event.target.files[0]);
	}
}