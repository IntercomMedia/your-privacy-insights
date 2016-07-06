//- - - - - - - - - - - - - - - - - - - - - - - - 
// YPI Specific code.
//- - - - - - - - - - - - - - - - - - - - - - - -
	
var ypi = (function(){	

	//- - - - - - - - - - - - - - - - - - - - - - - -
	//	Set up Ground Work modules and components
	//- - - - - - - - - - - - - - - - - - - - - - - -
	
	groundWork.components.fields('.field-element');
	
	//- Header Animation
	var animate_header = new groundWork.modules.AnimateHeader('header-animate', {
		scrollDownThreshold: window.innerHeight, 
		scrollUpThreshold: 300,
		scrollSpeed: .5
	});
	
	
	//- - - - - - - - - - - - - - - - - - - - - - - -
	//	Create applicating schema
	//- - - - - - - - - - - - - - - - - - - - - - - -
	
	var ypi = {		
		home : function(){
			
			// - - - - - - - - - - - - - - - - - - - - - -
			// Cache ground work functions
			// - - - - - - - - - - - - - - - - - - - - - -
		
			var Validator = groundWork.Validator,
				modal = groundWork.modules.modal;
			
			// - - - - - - - - - - - - - - - - - - - - - -
			// Instantiate
			// - - - - - - - - - - - - - - - - - - - - - -
	
			var animateColor = new groundWork.modules.AnimateColor('.animate-color', {
				threshhold : 210,
				saturation : -15,
				lightness : 100,
				in : function(el, change) {
					var img = el.querySelector('img');
					if(img){
						console.log(1 - (0.45 * (1-change)))
						img.style.transform = 'scale(' + Number( 1 - (0.15 * (1-change))) +')';
						img.style.opacity = change;
					}
				},
				out : function(el, change) {
					var img = el.querySelector('img');
					if(img){
						img.style.transform = 'scale(' + Number(1 +  (0.15 * change)) +')';
						img.style.opacity = 1 - change;
					}
				}
			});
			groundWork.modules.parallax('.parallax', {intensity : 0.1});
			
			var sign_up_form = document.getElementById('singup-form');
				var validateForm = new Validator('singup-form', {
		      	success : function(event) { window.location = 'register.html' },
		      	fail	: function(err) { err.fields.forEach(function(err, i){ modal.toast(err, 3000 * i)});},
	      	});
			var validateForm2 = new Validator('singup-form-2', {
	      		success : function(event) { window.location = 'register.html' },
	      		fail	: function(err) { err.fields.forEach(function(err, i){ modal.toast(err, 3000 * i)});},
	      	});
		},
	};
	
	return ypi;
	
})();