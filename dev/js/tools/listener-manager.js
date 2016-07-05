/*	========================================

		Event Listener Manager
		
		--Add functions to run on each element, each time the dom updates--

============================================= */
		
		
groundWork.listenerManager = (function(){
	var tool = {
		elements : [],
		update : function() {
			tool.elements.forEach(function(el){
				if(typeof el[0] == 'string') { // If the element provided is a css selector
					elements = document.querySelectorAll(el[0]);
					groundWork.utils.dom.forEach(elements, el[1]);
				}else {
					// If the element provided is an array, if not wrap single element in an array
					elements = Array.isArray(el[0])? el[0] : [el[0]];
					groundWork.utils.dom.forEach(elements, el[1]);
				}
			});
		},
		bind : function(element) {
			if(element.length > 2){
				element.forEach(function(element){
					tool.elements.push(element);
				})
			}else{
				tool.elements.push(element);
			}
			tool.update();
		}
	}			
	// Observe a specific DOM element:
	groundWork.utils.events.observeDOM(document.body, function(){ 
	    tool.update();
	});
	
	return tool;
	
})();
