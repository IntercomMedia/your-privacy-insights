groundWork.Validator = function(form, options) {
	form = document.getElementById(form);
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Cache groundWork tools
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	var createElement = groundWork.utils.dom.createElement;
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Set Options
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		
	options = { // set default options
		success : options.success ? options.success : function() { form.submit() },
		fail : options.fail ?  options.fail : function(msg) { console.log(msg)},
		rules : options.rules ? options.rules : false,
		error_class : options.error_class ? options.error_class : 'is-error',
		valid_class : options.valid_class ? options.valid_class : 'is-valid',
		validHandler : options.validHandler && typeof options.validHandler == 'function' ? options.validHandler : function(el) {
			el.parentNode.classList.remove(options.error_class);
			el.parentNode.classList.add(options.valid_class);
		},
		errorHandler : options.errorHandler && typeof options.errorHandler == 'function'? options.errorHandler : function(el, message) {
			el.parentNode.classList.remove(options.valid_class);
			el.parentNode.classList.add(options.error_class);
			var error_message = el.parentNode.querySelector('.field-tooltip');
			if(error_message) error_message.innerHTML = message;
			else createElement('div', message, 'field-tooltip', null, el.parentNode);
		},
	}
	var self = this;
	this.options = options;
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Handler Functions
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	function isValid(el){
		self.options.validHandler(el);
	}
	
	function isError(el, message){
		self.options.errorHandler(el, message);
		self.message.errors ++;
		self.message.fields.push(message);
		
		el.addEventListener('input', validateField);
	}
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// If there is a form, init
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	if (form) {
				
		this.el = form;
		this.validate_fields = this.el.querySelectorAll('.validate');
		this.message = {
			errors : 0,
			fields : []
		};
		
		// My Privates
		var getRadioCheckedValue = function(form, radio_name){
		   var oRadio = form.els[radio_name];
		 
		   for(var i = 0; i < oRadio.length; i++)
		   {
		      if(oRadio[i].checked)
		      {
		         return oRadio[i].value;
		      }
		   }
		 
		   return '';
		}
		
		// Init
		
		for (i = 0; i < this.validate_fields.length; i++) {
			var el = this.validate_fields[i],
				method 	= el.getAttribute('data-validate'),
				errored = el.parentNode.classList.contains('is-error');
			if(errored) {
				el.addEventListener('change', validateField);
			}
		}
		
		form.addEventListener('submit', function(e){ e.preventDefault(); validateForm(e)});
	}
	
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Core Public Methods
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	this.validateForm = function(el) {
		if(el.target){
			el.preventDefault();
			el = el.target;
		}
		this.isValid = true;
		this.message.errors = 0;
		this.message.fields = [];
		for (i = 0; i < this.validate_fields.length; i++) {
			if (this.validateField(this.validate_fields[i])) {
				continue;
			}
			this.isValid = false;
		}
		if (this.isValid) {
			this.options.success(event);
		} else {
			if (form.querySelector('.is-error .field-element')) form.querySelector('.is-error .field-element').focus();
			this.options.fail(this.message);
		}
		return false;
	}
	
	this.validateField = function(el) {
		var el = el.target ? el.target : el,
			value = el.value;
			
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		// Check if element depends on another elements value or checkedness...
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		if(el.hasAttribute('validate-depends')) {
			var el_value;
			if(form.els[el.getAttribute('validate-depends')].type == 'radio') {
				el_value = getRadioCheckedValue(form, el.getAttribute('validate-depends'));
			}else{
				el_value = form.els[el.getAttribute('validate-depends')].value;
			}
			
			if(el.hasAttribute('validate-depends-value') && el_value !== el.getAttribute('validate-depends-value')) {
				el.parentNode.classList.remove('is-error');
				el.parentNode.classList.remove('is-valid');
				return true;
			}
			if(el_value == '') {
				el.parentNode.classList.remove('is-error');
				el.parentNode.classList.remove('is-valid');
				return true;
			}
		}
		
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		// Check max character length
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		if(el.hasAttribute('data-max')) {
			var max = Number(el.getAttribute('data-max'));
			if(max < value.length){
				isError(el);
				return false;
			}
		}
		
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		// Check min character length
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		if(el.hasAttribute('data-min')) {
			var min = Number(el.getAttribute('data-min'));
			if(min < value.length){
				isError(el);
				return false;
			}
		}
		
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		// Cache validation methods and messages
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		var methods		= el.getAttribute('validate'),
			message 	= el.getAttribute('validate-message'),
			parent_el	= el.parentNode,
			required	= el.hasAttribute('required'),
			valid		= true;
			
		methods = (required && !methods) ? ['required'] : methods.replace(/\s/g,'').split(',');
		required = !required ?  Array.prototype.indexOf('required', methods) : required;
		
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		// Iterate through the validation methods
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

		
		if(required || !required && value.length > 0) {
			for (t = 0; t < methods.length; t++) { 
				if(methods[t] && typeof this.validateMethods[methods[t]].validate == 'function') {
					var valMethod = this.validateMethods[methods[t]];
					if (valMethod.validate(value, el)) {
						isValid(el);
					} else {
						isError(el, valMethod.message);
						valid = false;
						break;
					}
				}
			}
		}
		return valid;
	}
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Bind this to event driven methods
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	var validateForm = this.validateForm.bind(this),
		validateField = this.validateField.bind(this);
};

groundWork.Validator.prototype.addMethod = function(name, method, message) {
	groundWork.Validator.prototype.validateMethods[name] = {
		validate : method,
		message : message
	}
};

groundWork.Validator.prototype.validateMethods = { // private prop
	required: {
		validate : function(val, el) {
			if (val.length > 0) {
				return true;
			} else {
				return false;
			}
		},
		message : 'This field is required'
	},
	number : {
		validate : function(val, el) {
			var re = /^[0-9.]+$/
			var rslt = re.test(val);
			return rslt;
		},
		message : 'This field is required'
	},
	email: {
		validate : function(val, el) {
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			var rslt = re.test(val);
			return rslt;
		},
		message : 'Please input a valid email address'
	},
	checked: {
		validate : 
		function(val, el) {
			if (el.checked == true) {
				return true;
			} else {
				return false;
			}
		},
		message : 'This field is required'
	},
	phone: {
		validate : function(val, el) {
			var phone2 = /^(\+\d)*\s*(\(\d{3}\)\s*)*\d{3}(-{0,1}|\s{0,1})\d{2}(-{0,1}|\s{0,1})\d{2}$/;
			if (val.match(phone2)) {
				return true;
			} else {
				return false;
			}
		},
		message : 'This field is required'
	},
	fileExtension: {
		validate : function(val, el) {
			var alphaExp = /.*\.(gif)|(jpeg)|(jpg)|(png)$/;
			if (el.value.toLowerCase().match(alphaExp)) {
				return true;
			} else {
				return false;
			}
		},
		message : 'This field is required'
	},
	date: {
		validate : 
		function(val, el) {
			var format = "MMDDYYYY";
			if (format == null) {
				format = "MDY";
			}
			format = format.toUpperCase();
			if (format.length != 3) {
				format = "MDY";
			}
			if ((format.indexOf("M") == -1) || (format.indexOf("D") == -1) || (format.indexOf("Y") == -1)) {
				format = "MDY";
			}
			if (format.substring(0, 1) == "Y") { // If the year is first
				var reg1 = /^\d{2}(\-|\/|\.)\d{1,2}\1\d{1,2}$/;
				var reg2 = /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/;
			} else if (format.substring(1, 2) == "Y") { // If the year is second
				var reg1 = /^\d{1,2}(\-|\/|\.)\d{2}\1\d{1,2}$/;
				var reg2 = /^\d{1,2}(\-|\/|\.)\d{4}\1\d{1,2}$/;
			} else { // The year must be third
				var reg1 = /^\d{1,2}(\-|\/|\.)\d{1,2}\1\d{2}$/;
				var reg2 = /^\d{1,2}(\-|\/|\.)\d{1,2}\1\d{4}$/;
			}
			// If it doesn't conform to the right format (with either a 2 digit year or 4 digit year), fail
			if ((reg1.test(val) == false) && (reg2.test(val) == false)) {
				return false;
			}
			var parts = val.split(RegExp.$1); // Split into 3 parts based on what the divider was
			// Check to see if the 3 parts end up making a valid date
			if (format.substring(0, 1) == "M") {
				var mm = parts[0];
			} else
			if (format.substring(1, 2) == "M") {
				var mm = parts[1];
			} else {
				var mm = parts[2];
			}
			if (format.substring(0, 1) == "D") {
				var dd = parts[0];
			} else
			if (format.substring(1, 2) == "D") {
				var dd = parts[1];
			} else {
				var dd = parts[2];
			}
			if (format.substring(0, 1) == "Y") {
				var yy = parts[0];
			} else
			if (format.substring(1, 2) == "Y") {
				var yy = parts[1];
			} else {
				var yy = parts[2];
			}
			if (parseFloat(yy) <= 50) {
				yy = (parseFloat(yy) + 2000).toString();
			}
			if (parseFloat(yy) <= 99) {
				yy = (parseFloat(yy) + 1900).toString();
			}
			var dt = new Date(parseFloat(yy), parseFloat(mm) - 1, parseFloat(dd), 0, 0, 0, 0);
			if (parseFloat(dd) != dt.getDate()) {
				return false;
			}
			if (parseFloat(mm) - 1 != dt.getMonth()) {
				return false;
			}
			return true;
		},
		message : 'This field is required'
	},
	dob : {
		validate : function(val, el) {
				if(validateMethods.isDate(el)) {
					dob = new Date(val);
					today = new Date();
					today.setFullYear(today.getFullYear() - 5);
					return dob < today;
				}else {
					return false;
				}
		},
		message : 'This field is required'
	},
	name: {
		validate : function(val, el) {
			var re = /^[A-Za-z0-9 ]{3,50}$/;
			var rslt = re.test(val);
			return rslt;
		},
		message : 'This field is required'
	},
	password: {
		validate : function(val, el) {
			var re = /^(?=.*\d).{8,20}$/;
			var rslt = re.test(val);
			return rslt;
		},
		message : 'This field is required'
	},
	url: {
		validate : function(val, el) {
			var re = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
			var rslt = re.test(val);
			return rslt;
		},
		message : 'This field is required'
	},
	zip: {
		validate : function(val, el) {
			var re = /^\d{5}(?:[-\s]\d{4})?$/;
			var rslt = re.test(val);
			console.log(rslt)
			return rslt;
		},
		message : 'This field is required'
	},
	match: {
		validate : function(val, el) {
			var match = document.getElementById(el.getAttribute('validate-match-value')).value;
			
			if (val == match) {
				return true;
			}
			else {
				return false;
			}
		},
		message : 'This field is required'
	}
}