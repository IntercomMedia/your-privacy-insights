groundWork.animate = {
	slideDown : function(el, duration){
		var height = el.scrollHeight;
		groundWork.utils.removeClass(el, 'is-up');
		groundWork.utils.addClass(el, 'is-down');
		
		if(el.offsetHeight < 1) {
			if(!groundWork.utils.hasClass(el, 'is-active')){
				setTimeout(function(){
					groundWork.utils.addClass(el, 'is-active');
					el.style.height = height + 'px';
				}, 1);
			}else{
				el.style.height = height + 'px';
			}
		}
	},
	slideUp : function(el, duration){
		el.style.height = el.scrollHeight + 'px';
		groundWork.utils.removeClass(el, 'is-down');
		groundWork.utils.addClass(el, 'is-up');
		
		if(!groundWork.utils.hasClass(el, 'is-active')){
			setTimeout(function(){
				groundWork.utils.addClass(el, 'is-active');
				el.style.height = '0';
			}, 1);
		}else{
			el.style.height = '0';
		}
	},
	slideToggle : function(el, callback){
		var height = el.scrollHeight;
		el.style.height = el.offsetHeight + 'px';
		
		if(el.offsetHeight < 1) {
			this.slideDown(el, duration);
		}else {
			this.slideUp(el, duration);
		}
	},
	scrollTo : function(element, to, duration, callback) {
	    var start = element.scrollTop,
	        change = to - start,
	        currentTime = 0,
	        increment = 20,
	        timer;
	    scrolling = true;
		
		if(typeof to !== 'number') {
			var win_scroll = document.documentElement.scrollTop || document.body.scrollTop;
			var offset = element.getBoundingClientRect();
			var to = start + offset.top - window.innerHeight;
		}
		
	    var animateScroll = function(){
		    if(stopscroll == true) {
			    scrolling = false;
			    if (callback) callback();
		    }else {	      
		        currentTime += increment;
		        var val = Math.easeInOutCirc(currentTime, start, change, duration);
		        if(element == 'body'){
			        document.body.scrollTop = val;
			        document.documentElement.scrollTop = val;
		        }else{
		        	element.scrollTop = val;
		        }
		        if(currentTime < duration) {
		            timer = setTimeout(animateScroll, increment);
		        }
		        else{
			        scrolling = false;
			        if (callback) callback();
		        }
	        }
	    };
	    animateScroll();
	},
	scrollToCenterOfEl : function(element, duration, callback) {
		var win_scroll = document.documentElement.scrollTop || document.body.scrollTop;
		var offset = element.getBoundingClientRect();
		var to = win_scroll + offset.top - window.innerHeight/2;
		var speed = (Math.abs(win_scroll-to)/1000) * duration;
		if(scrolling) {
			stopscroll = true;
			window.setTimeout(function(){
				stopscroll = false;
				this.scrollTo('body', to, duration, callback);
			}, 30)
		}else {
			this.scrollTo('body', to, duration, callback);
		}
	}
}