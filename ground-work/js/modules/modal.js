/* ===========================================

		Modal Panel

=============================================*/

groundWork.modules.modal = (function() {
	// locals
	
	var module = {};
	
	module.locals = {
			modal : {}, // Panel Node
			dialog : {}, // Dialog Node
			slat : {
				container : false,
				messages : []
			},
			panel : {
				el : false,
				options : {},
			},
			toast : {
				container : false,
				messages : []
			},
			open : false, // Is Panel Open
			dialog_open : false,
			toast_open : false
		}
		
	module.options = {
		close_btn_content : '<i class="icon-close"></i>',
		content_container_class : 'modal-content',
		animation_time : 300
	};
	
	// Cache
	
	var options = module.options;
	var locals = module.locals;
	var utils = groundWork.utils;
	
	/* --------------------------------------------------
		
		Helper Functions
	
	-------------------------------------------------- */
	
	// Remove element from dom after set time
	module.killElement = function(element, done) {
		utils.dom.removeClass(element, 'is-open');
		setTimeout(function(){
			element.remove();
			element = false;
			if(typeof done == 'function') done();
		}, options.animation_time);
	}
	
	// Create Modal elements
	module.createModal = function(class_stack) {
		// Create modal
		class_stack = class_stack ? 'modal ' + class_stack : 'modal';
		module.locals.modal.container = utils.dom.createElement('div', '', class_stack);
		
		// Add close btn
		var closebtn = utils.dom.createElement('button', '', 'modal-close modal-btn');
		closebtn.addEventListener('click', function(event){
			module.closeModal();
		});
			
		// Add content container
		module.locals.modal.content = utils.dom.createElement('div', '', options.content_container_class);
		module.locals.modal.container.appendChild(closebtn);
		module.locals.modal.container.appendChild(module.locals.modal.content);
		module.locals.modal.slides = [];
		// Add modal to dom
		document.body.appendChild(module.locals.modal.container);
	}
	
	/* --------------------------------------------------
		
		Modal
	
	-------------------------------------------------- */
	
	module.open = function(content, options, done) {
		// Set Default Options
		var defaults = {
			style : 'simple',
			position :'bottom',
			overlay : true,
			width : 'auto',
			height : 'auto',
		}
			
		if(typeof options == 'object') {
			options.style = options.style ? options.style : defaults.style;
			options.position = options.position ? options.position : defaults.position;
			options.width = options.width ? options.width : defaults.width;
			options.height = options.height ? options.height : defaults.height;
		}else {
			options = defaults;
		}
		if(!module.locals.modal.container || !options.slide) {
			if(!module.locals.modal.container) {
				module.createModal(options.style + ' ' + options.position);
				module.locals.modal.container.style.width = options.width;
				module.locals.modal.container.style.height = options.height;
				module.locals.modal.slides = [utils.dom.appendElement('div', content, 'modal-slide', module.locals.modal.content)];
			}else {
				module.locals.modal.slides[0].innerHTML = content;
			}
			
			if(options.overlay) {
				utils.dom.addClass(document.body, 'is-overlay');
			}
			utils.dom.addClass(document.body, 'modal-open');
			
			// Finally show modal
			window.setTimeout(function(){
				if(typeof done == 'function') done();
				utils.dom.addClass(module.locals.modal.container, 'is-open');
			}, 10);
		}else {
			module.loadSlide(content, done);
		}
	}
	
	module.loadContent = function(url, options) {
		var defaults = {
			height : '400px'
		}
		if(typeof options == 'object'){
			options.height = options.height ? options.height : defaults.height;
		}else {
			options = defaults;
		}
		module.open('', options);
		utils.dom.addClass(module.locals.modal.container, 'loading');
		groundWork.ajax.post({
			url: url,
			success: function(res){
			utils.dom.removeClass(module.locals.modal.container, 'loading');
				module.locals.modal.slides[module.locals.modal.slides.length - 1].innerHTML = res;
				var h = module.locals.modal.slides[module.locals.modal.slides.length - 1].offsetHeight;
				var w = module.locals.modal.slides[module.locals.modal.slides.length - 1].offsetWidth;
				module.locals.modal.container.style.width = w + 'px';
				module.locals.modal.container.style.height = h + 'px';
			},
			err : function(err){
				module.toast(err, 3000);
			}
		});
	}
	
	module.loadSlide = function(content, done) {
		var slide = module.locals.modal.slides.length;
		// If no slides have yet been enabled
		if(slide == 1) {
			// Set static width
			var back_btn = utils.dom.createElement('button', '', 'modal-prev modal-btn');
			var w = module.locals.modal.container.offsetWidth;
			
			module.locals.modal.container.appendChild(back_btn);
			back_btn.addEventListener('click', module.prev);
			
			module.locals.modal.container.style.width = w + 'px';
			
			module.locals.modal.container
			// Enable slider class styles for modal
			utils.dom.addClass(module.locals.modal.content, 'is-slider');
		}
		module.locals.modal.slides[slide] = utils.dom.appendElement('div', content, 'modal-slide slide-' + slide, module.locals.modal.content);
		module.slide(slide, done);
	};

	module.slide = function(slide, done) {//Record history
		module.locals.modal.container.setAttribute('data-slide', slide);
		var w = module.locals.modal.container.offsetWidth;
		module.locals.modal.content.style.transform = 'translateX(-' + w * slide + 'px)';
		setTimeout(function(){
			if(typeof done == 'function') done();
		}, locals.animation_time);
	};
	
	module.next = function(done){
		var slide = Number(module.locals.modal.container.getAttribute('data-slide')) + 1;
		
		if(slide < module.locals.modal.slides.length) {
			module.slide(slide, done);
		}
	}
	
	module.prev = function(done){
		var slide = Number(module.locals.modal.container.getAttribute('data-slide')) -1;
		console.log(slide);
		if(slide >= 0) {
			module.slide(slide, done);
		}
	}
	
	// Closes panel and removes content
	module.closeModal = function(element) {
		utils.dom.removeClass(document.body, 'modal-open');	
		utils.dom.removeClass(document.body, 'is-overlay');
		utils.dom.removeClass(module.locals.modal.container, 'is-open');
		
		utils.dom.killElement(module.locals.modal.container, 300, false, function(){
			module.locals.modal.container = false;
		});
	};
	
	/* --------------------------------------------------
		
		Dialog Box
		
		dialog(content, options)
		
		@param 	content : @string
		@param 	options {
				title :
				buttons : [{
					title : @string,
					handler :  @function
				}]
				fields : [{
					type : @string ['text' | 'select'],
					label : @string,
					handler : {
						type : @string [any event listener type],
						action : @function
					},
					options : [ //Only applies to select types
						{
							label : @string,
							value : @string
						}
					]
				}],
				submit : @function
			}
	-------------------------------------------------- */

	module.dialog = function(content, options, done){
		clearTimeout(locals.closeTimer);
		
		// Default Options
		var defaults = {
			title : false,
			buttons : [{
				title : 'Ok',
				handler : function (){
					module.closeDialog();
				}
			}],
			fields : false
		}
		
		if(typeof options == 'function') { 
			done = options;
			options = defaults;
		}
		else if(typeof options == 'object') {
			options.title = options.title ? options.title : defaults.title;
			options.buttons = options.buttons ? options.buttons : defaults.buttons;
			options.fields = options.fields ? options.fields : defaults.fields;
			
		}else {
			options = defaults;
		}
		
		// Init Dialog
		locals.dialog = utils.dom.createElement('div','',  'dialog')
		document.body.appendChild(locals.dialog);
		
		// Title
		if(options.title) {
			var message = utils.dom.createElement('div', '', 'title');
			message.innerHTML = options.title;
			locals.dialog.appendChild(message);
		}
		
		// Content
		if(content) {
			var content_el = utils.dom.createElement('div', '',  'message');
			content_el.innerHTML = content;
			locals.dialog.appendChild(content_el);
		}
		
		// Add fields, if any
		if(options.fields) {
			var fields = utils.dom.createElement('form','', 'dialog-fields');		
			
			options.fields.forEach(function(element, i){
				switch(element.type) {
					case 'text' :
						var field = utils.dom.createElement('input', '', 'field-element', [{name : 'type', value : 'text'}, {name : 'name', value : element.name}, {name : 'placeholder', value : element.label}]);
					break;
					case 'select':
						var field = utils.dom.createElement('select', '', 'field-element', [{name : 'name', value : element.name}]);
						var options = '<option value="">' + element.label + '</option>';
						element.options.forEach(function(option, index){
							options += '<option value="'+ option.value +'">'+ option.label +'</option>';
						});
						field.innerHTML = options;
					break;
				} 
				
				element.el = field;
				
				if(typeof field.handler == 'object') field.addEventListener(field.handler.type, field.handler.action);
				fields.appendChild(field);
			});
			if(typeof options.submit == 'function') fields.addEventListener('submit', options.submit);
			locals.dialog.appendChild(fields);
		}
		
		// Add buttons, if any
		if(options.buttons) {
			var buttons = utils.dom.createElement('div', '', 'dialog-buttons');
			
			options.buttons.forEach(function(element, i){
				var button = utils.dom.createElement('button');
				button.innerHTML = element.title;
				button.addEventListener('click', element.handler);
				buttons.appendChild(button);
			});
			if(fields) fields.appendChild(buttons);
			else locals.dialog.appendChild(buttons);
		}
		
		utils.dom.addClass(locals.dialog,'is-open');
		if(fields) options.fields[0].el.focus();
	}
		
	// Closes panel and removes content
	module.closeDialog = function(element) {
		utils.dom.removeClass(document.body, 'dialog-open');	
		utils.dom.removeClass(document.body, 'is-overlay');
		killElement(locals.dialog, function(){
			locals.dialog = false;
		});
	};
	
	/* ---------------------------------------------

		Slat
	
	-----------------------------------------------*/ 
	
	module.slat = function(content, time){
		var slat_count = Number(locals.slat.messages.length);
		
		// - - - - - - - - - - - - - - - - - - - - - -
		// Create slat container
		// - - - - - - - - - - - - - - - - - - - - - - 
		
		if(!locals.slat.container) {
			locals.slat.container = utils.dom.createElement('div', '', 'slat-container');
			document.body.appendChild(locals.slat.container);
		}
		
		// - - - - - - - - - - - - - - - - - - - - - -
		// Append slat to container
		// - - - - - - - - - - - - - - - - - - - - - - 
		
		var this_slat = utils.dom.createElement('div','', 'slat', null, locals.slat.container);
			utils.dom.createElement('div', content, 'slat-content', null, this_slat);		
			locals.slat.messages.push(this_slat);
		
		// - - - - - - - - - - - - - - - - - - - - - -
		// Close slat button
		// - - - - - - - - - - - - - - - - - - - - - - 
		
		var close_slat = utils.dom.appendElement('button', '', 'close-slat', this_slat);
			
		close_slat.addEventListener('click', function(){
			console.log(locals.slat.messages.indexOf(this_slat));
			killSlat(this_slat);
		});
		
		// - - - - - - - - - - - - - - - - - - - - - -
		// Open slat
		// - - - - - - - - - - - - - - - - - - - - - - 
		
		window.setTimeout(function(){
			utils.dom.addClass(this_slat, 'is-open');
			this_slat.style.height = this_slat.scrollHeight + 'px';
		}, 5);
		
		// - - - - - - - - - - - - - - - - - - - - - -
		// Close timer
		// - - - - - - - - - - - - - - - - - - - - - - 
		
		if(time) {
			setTimeout(function(){
				utils.dom.addClass(this_slat, 'is-closed');
				killSlat(locals.slat.messages[slat_count]);
			}, time);
		}
		
		function killSlat(element) {
			var index = locals.slat.messages.indexOf(element);
			utils.dom.addClass(element, 'is-closed');
			element.style.height = '0';
			setTimeout(function(){
				element.remove();
				
				if(locals.slat.container.children.length == 0) {
					locals.slat.messages = [];
					locals.slat.container.remove();
					locals.slat.container = false;
				}
			}, options.animation_time);
		}

	}
	
	/* ---------------------------------------------
	
		Panel
	
	-----------------------------------------------*/ 
	
	module.panel = function(content, options){
		
		// - - - - - - - - - - - - - - - - - - - -
		// Set Options
		// - - - - - - - - - - - - - - - - - - - -
		
		var defaults = {
			position : 'bottom',
			container : document.querySelector('#body-wrapper'),
			size : 33.33,
		};
		
		if(typeof options == 'object') {
			options = {
				position : options.position ? options.position : defaults.position,
				size : options.size ? options.size : defaults.size,
				container : options.container ? document.querySelector(options.container) : defaults.container
			}
		}else {
			options = defaults;
		}
		
		// - - - - - - - - - - - - - - - - - - - -
		// Create Panel
		// - - - - - - - - - - - - - - - - - - - -
		
		if(!locals.panel.el) {
			locals.panel.el = utils.dom.createElement('div', '', 'modal-panel ' + options.position);
			var panel_content = utils.dom.appendElement('div', content, 'modal-panel-content', locals.panel.el);
			
			document.body.appendChild(locals.panel.el);
			locals.panel.options = options;
		}
		
		setTimeout(function(){
			switch(options.position) {
				case 'top' :
					panel_content.style.height = options.size + 1 + 'vh';
					locals.panel.el.style.height = options.size + 1 + 'vh';
					options.container.style.transform = 'translateY(' + options.size + 'vh)';
				break;
				case 'bottom' :
					panel_content.style.height = options.size  + 1 + 'vh';
					locals.panel.el.style.height = options.size  + 1 + 'vh';
					options.container.style.transform = 'translateY(-' + options.size + 'vh)';
				break;
				case 'left' :
					panel_content.style.width = options.size  + 1 + 'vw';
					locals.panel.el.style.width = options.size  + 1 + 'vw';
					options.container.style.transform = 'translateX(' + options.size + 'vw)';
				break;
				case 'right' :
					panel_content.style.width = options.size  + 1 + 'vw';
					locals.panel.el.style.width = options.size  + 1 +  'vw';
					options.container.style.transform = 'translateX(-' + options.size + 'vw)';
				break;
			}
			utils.dom.addClass(locals.panel.el, 'is-open');
			utils.dom.addClass(document.body, 'panel-open');
		}, 15);
		
	}
	
	module.closePanel = function(){
		
		switch(locals.panel.options.position) {
			case 'top' :
				locals.panel.el.style.height = '0px';
			break;
			case 'bottom' :
				locals.panel.el.style.height = '0px';
			break;
			case 'left' :
				locals.panel.el.style.width = '0px';
			break;
			case 'right' :
				locals.panel.el.style.width = '0px';
			break;
		}
		
		locals.panel.options.container.style.transform = '';
		
		utils.dom.removeClass(document.body, 'panel-open');
		utils.dom.removeClass(locals.panel.el, 'is-open');
		
		utils.dom.killElement(locals.panel.el, 300, false, function(){
			locals.panel.el = false;
		});
	};
	
	/* ---------------------------------------------
	
		Toast
	
	-----------------------------------------------*/ 
	
	module.toast = function(content, time){
		var toast_count = Number(locals.toast.messages.length);
		// Init Dialog
		if(!locals.toast.container) {
			locals.toast.container = utils.dom.createElement('div', '', 'toast-container');
			document.body.appendChild(locals.toast.container);
		}
		
		locals.toast.messages[toast_count] = utils.dom.createElement('div', '', 'toast', locals.toast.container);
		locals.toast.messages[toast_count].innerHTML = content;
		locals.toast.container.insertBefore(locals.toast.messages[toast_count], locals.toast.messages[toast_count-1]);
		
		window.setTimeout(function(){
			utils.dom.addClass(locals.toast.messages[toast_count], 'is-open');
		}, 5);
		window.setTimeout(function(){
			utils.dom.addClass(locals.toast.messages[toast_count], 'is-closed');
			killToast(locals.toast.messages[toast_count]);
		}, time);
		
		killToast = function(element) {
			var index = locals.toast.messages.indexOf(element);
			utils.dom.addClass(element, 'is-closed');
			setTimeout(function(){
				element.remove();
				if(index == locals.toast.messages.length - 1) {
					console.log('Kill container');
					locals.toast.messages = [];
					locals.toast.container.remove();
					locals.toast.container = false;
				}
			}, options.animation_time);
		}
	}
	
	return module;
})();
