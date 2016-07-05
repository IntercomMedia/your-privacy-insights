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
				margin : 10,
				hue : -50,
				saturation : -15,
				lightness : 1,
				callback : function(el, change) {
					var img = el.querySelector('img');
					if(img){
						img.style.transform = 'scale(' +Number(+ 1 - (change * 0.15)) +') translateX('+ -change * 15 + '%)';
						img.style.opacity = 1 - change * 1.5;
					}
				}
			});
			groundWork.modules.parallax('.parallax');
			
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