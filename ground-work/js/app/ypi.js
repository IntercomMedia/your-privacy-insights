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
	
	//- Sticky
	var stickies = new groundWork.modules.Sticky('.sticky');
	
	// Scroll Hash
	groundWork.modules.scrollHash('.scroll-to');
	
	// Select List
	groundWork.modules.selectList('.select-list');
	
	
	// animate color sections
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
	
	// Parallaxification
	groundWork.modules.parallax('.parallax', {intensity : 0.1});
	
	
	//- - - - - - - - - - - - - - - - - - - - - - - -
	//	Create applicating schema
	//- - - - - - - - - - - - - - - - - - - - - - - -
	
	
	var ypi = {		
		home : function(){
		},
	};
	
	return ypi;
	
})();