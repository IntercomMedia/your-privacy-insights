groundWork.utils.data = {	
	// Get Age from Birthdate
	getAge : function(birth) {
	
	    var today = new Date();
	    var nowyear = today.getFullYear();
	    var nowmonth = today.getMonth();
	    var nowday = today.getDate();
	
	    var birthyear = birth.getFullYear();
	    var birthmonth = birth.getMonth();
	    var birthday = birth.getDate();
	
	    var age = nowyear - birthyear;
	    var age_month = nowmonth - birthmonth;
	    var age_day = nowday - birthday;
	   
	    if(age_month < 0 || (age_month == 0 && age_day <0)) {
	            age = parseInt(age) -1;
	        }
	    return(age);
	},
	getHeight : function(height) {
		height = Math.floor(height/12) + "' " + (height%12) + '"' ;
	  return(height);
	},
	
	getMonthName : function(month){
		monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		return monthName[month];
	}
}