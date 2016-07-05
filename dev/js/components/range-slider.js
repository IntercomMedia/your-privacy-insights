groundWork.components.rangeSlider = function(selector) {
	var component = [selector, sliderControl];
	groundWork.listenerManager.bind(component);
	
	function sliderControl(el) {
		var el_tooltip = el.nextElementSibling,
			el_val = el.value,
			// Position
			minVal = Number(el.getAttribute('min')),
			maxVal = Number(el.getAttribute('max')),
			outputW = el_tooltip.offsetWidth,
			outputPos = (el_val - minVal) / (maxVal -minVal),
			// Values
			el_val = Math.floor(el_val/12) + "' " + (el_val%12) + '"' ;
			
			// Set these
			el_tooltip.innerHTML = el_val;
			el_tooltip.style.left= outputPos * 100 + '%';
			el_tooltip.style.marginLeft = (outputW/2) * -outputPos + 'px';
		
		// Input changed
		el.addEventListener('input', sliderControlInput);
		// Mousdown
		el.addEventListener('mousedown', sliderControlMousedown);
		// Mouesup
		el.addEventListener('mouseup', sliderControlMouseup);
	
	}
		
	function sliderControlInput(event){
			// Get the shit
			var range_marker = document.getElementById(event.target.getAttribute('data-marker'));
			var el_tooltip = event.target.nextElementSibling;
				el_val = event.target.value,
				minVal = Number(event.target.getAttribute('min')),
				maxVal = Number(event.target.getAttribute('max')),outputW = el_tooltip.offsetWidth,
				outputPos = (el_val - minVal) / (maxVal -minVal);
			if(event.target.hasAttribute('data-height')){
				el_val = Math.floor(el_val/12) + "' " + (el_val%12) + '"' ;
			}
			
			// Set the shit
			el_tooltip.innerHTML = el_val;
			if(range_marker) range_marker.innerHTML = el_val;
			el_tooltip.style.left= outputPos * 100 + '%';
			el_tooltip.style.marginLeft = (outputW/2) * -outputPos + 'px';
			
	}
	
	
	function sliderControlMousedown(event){
		var el_val = event.target.value,
			el_tooltip = event.target.nextElementSibling,
			minVal = Number(event.target.getAttribute('min')),
			maxVal = Number(event.target.getAttribute('max')),
			outputW = el_tooltip.offsetWidth,
			outputPos = (el_val - minVal) / (maxVal -minVal);
		if(event.target.hasAttribute('data-height')){
			el_val = Math.floor(el_val/12) + "' " + (el_val%12) + '"' ;
		}
		
		event.target.nextElementSibling.innerHTML = el_val;
		el_tooltip.style.left= outputPos * 100 + '%';
		el_tooltip.style.marginLeft = (outputW/2) * -outputPos + 'px';
			
		addClass(el_tooltip.parentNode, 'is-active');
		addClass(el_tooltip.parentNode, 'is-set');
	}
	
	
	function sliderControlMouseup(event){
		var el_tooltip = event.target.nextElementSibling;
		el_tooltip.parentNode.classList.remove('is-active');
		el_tooltip.parentNode.classList.remove('is-set');
	}
};