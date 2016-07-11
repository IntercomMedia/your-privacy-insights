groundWork.animate = {
	slideDown : function(el){
		var height = el.scrollHeight;
		groundWork.utils.dom.removeClass(el, 'is-up');
		groundWork.utils.dom.addClass(el, 'is-down');
		
		if(el.offsetHeight < 1) {
			if(!groundWork.utils.dom.hasClass(el, 'is-active')){
				setTimeout(function(){
					groundWork.utils.dom.addClass(el, 'is-active');
					el.style.height = height + 'px';
				}, 1);
			}else{
				el.style.height = height + 'px';
			}
		}
	},
	slideUp : function(el){
		el.style.height = el.scrollHeight + 'px';
		groundWork.utils.dom.removeClass(el, 'is-down');
		groundWork.utils.dom.addClass(el, 'is-up');
		
		if(!groundWork.utils.dom.hasClass(el, 'is-active')){
			setTimeout(function(){
				groundWork.utils.dom.addClass(el, 'is-active');
				el.style.height = '0';
			}, 1);
		}else{
			el.style.height = '0';
		}
	},
	slideToggle : function(el){
		var height = el.scrollHeight;
		el.style.height = el.offsetHeight + 'px';
		
		if(el.offsetHeight < 1) {
			this.slideDown(el);
		}else {
			this.slideUp(el);
		}
	},
	scrollTo : function(element, to, duration, callback) {
	    element = document.documentElement.scrollTo ? document.documentElement : document.body;
	    var start = element.scrollTop,
	        change = to - start,
	        currentTime = 0,
	        increment = 20,
	        timer;
	    groundWork.trackers.scrolling = true;
		if(typeof to !== 'number') {
			var win_scroll = window.scrollY;
			var offset = element.getBoundingClientRect();
			var to = start + offset.top - window.innerHeight;
		}
		
	    var animateScroll = function(){
		    if(groundWork.trackers.stopscroll == true) {
			    groundWork.trackers.scrolling = false;
			    if (callback) callback();
		    }else {	      
		        currentTime += increment;
		        var val = Math.easeInOutCirc(currentTime, start, change, duration);
		        element.scrollTop = val;
		        if(currentTime < duration) {
		            timer = setTimeout(animateScroll, increment);
		        }
		        else{
			        groundWork.trackers.scrolling = false;
			        if (callback) callback();
		        }
	        }
	    };
		animateScroll();
	},
	scrollToCenterOfEl : function(element, duration, callback) {
		var winH = window.innerHeight;
		var body = document.documentElement.scrollTo ? document.documentElement : document.body
		var win_scroll = body.scrollTop;
		var height = element.offsetHeight;
		var offset = element.getBoundingClientRect();
		var to = win_scroll + offset.top - winH/2 + height/2;
		var speed = (Math.abs(win_scroll-to)/1000) * duration;
		speed = speed < duration/2 ? duration/2 : speed;
		to = height > window.winH ? win_scroll + offset.top + 100 : to;
		if(groundWork.trackers.scrolling) {
			groundWork.trackers.stopscroll = true;
			window.setTimeout(function(){
				groundWork.trackers.stopscroll = false;
				this.scrollTo(body, to, speed, callback);
			}, 30)
		}else {
			this.scrollTo(body, to, speed, callback);
		}
	}
}