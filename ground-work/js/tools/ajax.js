groundWork.ajax = (function(){
	
	var controller = {},
		addClass = groundWork.utils.dom.addClass,
		removeClass = groundWork.utils.dom.removeClass;
	controller.params = function(obj){
	    var pairs = [];
	    for (var prop in obj) {
	        if (!obj.hasOwnProperty(prop)) {
	            continue;
	        }
	        pairs.push(prop + '=' + obj[prop]);
	    }
	    return pairs.join('&');
	};
	
	controller.serialize = function(obj){
		var returnVal;
			if(obj !== undefined){
				switch(obj.constructor)
				{
					case Array:
						var vArr="[";
						for(var i=0;i<obj.length;i++)
						{
							if(i>0) vArr += ",";
							vArr += serialize(obj[i]);
						}
						vArr += "]"
						return vArr;
					case String:
						returnVal = escape("'" + obj + "'");
						return returnVal;
					case Number:
						returnVal = isFinite(obj) ? obj.toString() : null;
						return returnVal;				
					case Date:
						returnVal = "#" + obj + "#";
						return returnVal;		
					default:
						if(typeof obj == "object"){
							var vobj=[];
							for(attr in obj) {
								if(typeof obj[attr] != "function")
								{
									vobj.push('"' + attr + '":' + controller.serialize(obj[attr]));
								}
							}
								if(vobj.length >0)
									return "{" + vobj.join(",") + "}";
								else
									return "{}";
						}		
						else
						{
							return obj.toString();
						}
				}
			}
			return null;
	}
	
	controller.post = function(args) {	
		var hxr = new XMLHttpRequest();

		if(args.type == 'json') {
			args.data = JSON.stringify(args.data);
		}else if(args.dataobj){
			args.data = this.params(args.dataobj);
		}else if(args.data){
			args.data = new FormData(args.data);
		}
		
		args = {
			type : args.type,
			method : args.data ? 'POST' : 'GET',
			url : args.url,
			data : args.data,
			success : args.success ? args.success : function(res){ console.log(res)},
			append : args.append ? args.append : function(){},
			err : args.err ? args.err : function(res){ console.log(res)}
		};
		
		// We bind the FormData object and the form el
		args.append(args.data);
		
		// We define what will happen if the data is successfully sent
	   hxr.addEventListener("load", function(event) {	
			if (hxr.readyState == XMLHttpRequest.DONE ) {
				var response = hxr.responseText;
				if(hxr.status == 200){
					if(args.type == 'json') response = JSON.parse(response);
					args.success(response);
				}
				else if(hxr.status == 400) {
					var message = 'Not Found';
					if(args.type == 'json') message = {error : message};
					args.err(message);
				}
				else {
					if(args.type == 'json') response = JSON.parse(response);
					args.err(response);
				}
			}
	   });
	
		// We define what will happen in case of error
		hxr.addEventListener("error", function(event) {
			args.err('There was an issue with your request, please try again.');
		});
	
		// We setup our request
		hxr.open(args.method, args.url, true);
		hxr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		if(args.type == 'json') {
			hxr.setRequestHeader("Content-Type", "application/json");
		}
		
		// The data sent are the one the user provide in the form
		hxr.send(args.data);
	
	}
	
	controller.loadView = function(url, el, success, err) {
		addClass(el, 'loading');
		this.post({
			url : url,
			success: function(res){
				el.innerHTML = res;
				if(typeof success == 'function') success();
				removeClass(el,'loading');
			},
			err : function(){
				if(typeof err == 'function') err();
				removeClass(el,'loading');
				addClass(el,'error');
			}
			
		});
	}
	return controller;
})();