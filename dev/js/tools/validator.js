groundWork.Validator = function(form, args) {
	form = document.getElementById(form);
	if (form) {
		// My Privates
		var self = this; // to reference this inside of event listener functions
		
		function getRadioCheckedValue(form, radio_name){
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
		
		function validateEventHandler(event){
			self.validateHandler(event.target)
		}
		
						
		function validateForm(event) {
			if(event.target) event.preventDefault();
			self.isValid = true;
			self.message.errors = 0;
			self.message.fields = [];
			for (i = 0; i < self.validate_fields.length; i++) {
				if (self.validateHandler(self.validate_fields[i])) {
					continue;
				}
				
				self.message.errors ++;
				self.message.fields.push(self.validate_fields[i].getAttribute('data-message'));
				self.isValid = false;
			}
			if (self.isValid) {
				self.args.success(event);
			} else {
				if (form.querySelector('.is-error .field-el')) form.querySelector('.is-error .field-el').focus();
				self.args.fail(self.message);
			}
			return false;
		}
		
		// Public 
		
		this.args = { // set default args
			success : args.success ? args.success : function() { form.submit() },
			fail : args.fail ?  args.fail : function(msg) { console.log(msg)}
		}
		
		this.el = form;
		this.validate_fields = this.el.querySelectorAll('.validate');
		this.message = {
			errors : 0,
			fields : []
		};
		
		// Init
		
		for (i = 0; i < self.validate_fields.length; i++) {
			var el = self.validate_fields[i],
				method 	= el.getAttribute('data-validate'),
				isError = el.parentNode.classList.contains('is-error');
			if(isError) {
				el.addEventListener('change', validateEventHandler);
			}
		}
		
		form.addEventListener('submit', validateForm);
	}
	
	this.validateMethods = { // private prop
		required: function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			var required = (el.hasAttribute('required') || el.hasAttribute('data-validate-required'));
			if (required || val.length > 0) {
				return true;
			} else {
				false;
			}
		},
		isRequired : function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			if (val.length > 0 && val !== '') {
				return true;
			} else {
				false;
			}
		},
		isNumber : function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			if (self.validateMethods.required(el)) {
				var re = /^[0-9.]+$/
				var rslt = re.test(val);
				return rslt;
			}
			else {
				return true;
			}
		},
		isEmail: function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			if (self.validateMethods.required(el)) {
				var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				var rslt = re.test(val);
				return rslt;
			}
			else {
				return true;
			}
		},
		isChecked: function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			if (self.validateMethods.required(el)) {
				if (el.checked == true) {
					return true;
				} else {
					el.focus();
					return false;
				}
			} else {
				return true;
			}
		},
		isPhone: function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			if (self.validateMethods.required(el)) {
				var str = el.value;
				var phone2 = /^(\+\d)*\s*(\(\d{3}\)\s*)*\d{3}(-{0,1}|\s{0,1})\d{2}(-{0,1}|\s{0,1})\d{2}$/;
				if (str.match(phone2)) {
					return true;
				} else {
					el.focus();
					return false;
				}
			}
		},
		isFileExtension: function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			if (validateMethods.required(event.target)) {
				var alphaExp = /.*\.(gif)|(jpeg)|(jpg)|(png)$/;
				if (el.value.toLowerCase().match(alphaExp)) {
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		},
		isDate: function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			var format = "MMDDYYYY";
			if (self.validateMethods.required(el)) {
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
			} else {
				return true;
			}
		},
		isDob : function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			if (self.validateMethods.required(el)) {
				if(validateMethods.isDate(el)) {
					dob = new Date(val);
					today = new Date();
					today.setFullYear(today.getFullYear() - 5);
					return dob < today;
				}else {
					return false;
				}
			} else {
				return true;
			}
		},
		isName: function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			if (self.validateMethods.required(el)) {
				var re = /^[A-Za-z0-9 ]{3,50}$/;
				var rslt = re.test(val);
				return rslt;
			} else {
				return true;
			}
		},
		isPassword: function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			if (self.validateMethods.required(el)) {
				var re = /^(?=.*\d).{8,20}$/;
				var rslt = re.test(val);
				return rslt;
			} else {
				return true;
			}
		},
		isUrl: function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			if (self.validateMethods.required(el)) {
				var re = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
				var rslt = re.test(val);
				return rslt;
			} else {
				return true;
			}
		},
		isZip: function(el) {
			el = (el.target) ? el.target : el;
			var val = el.value;
			if (self.validateMethods.required(el)) {
				var re = /^\d{5}(?:[-\s]\d{4})?$/;
				var rslt = re.test(val);
				return rslt;
			} else {
				return true;
			}
		},
		isMatch: function(el) {
			el = (el.target) ? el.target : el;
			var val 	= el.value,
				match 	= document.getElementById(el.getAttribute('val-match')).value;
			
			if (val == match) {
				return true;
			}
			else {
				return false;
			}
		}
	}

	this.validateHandler = function(el) {
		if(el.hasAttribute('data-depends')) {
			var el_value;
			if(form.els[el.getAttribute('data-depends')].type == 'radio') {
				el_value = getRadioCheckedValue(form, el.getAttribute('data-depends'));
			}else{
				el_value = form.els[el.dataset.depends].value;
			}
			
			if(el.hasAttribute('data-depends-value') && el_value !== el.getAttribute('data-depends-value')) {
				el.parentNode.classList.remove('is-error');
				el.parentNode.classList.remove('is-valid');
				return true;
				console.log(el_value);
			}
			if(el_value == '') {
				el.parentNode.classList.remove('is-error');
				el.parentNode.classList.remove('is-valid');
				return true;
			}
		}
		
		var method	= el.getAttribute('data-validate'),
			message 	= el.getAttribute('data-message'),
			parent_el	= el.parentNode,
			required	= (el.hasAttribute('required') || el.hasAttribute('data-validate-required'));
		method = (required && !method) ? 'isRequired' : method;
		
		if(method) {
			if (self.validateMethods[method](el)) {
				parent_el.classList.remove('is-error');
				parent_el.classList.add('is-valid');
				return true;
			} else {
				parent_el.classList.remove('is-valid');
				parent_el.classList.add('is-error');
				el.addEventListener('input', validateEventHandler);
				return false;
			}
		} else {
			return true;
		}
	}
};