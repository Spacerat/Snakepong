/**
*
*  Javascript cookies
*  http://www.webtoolkit.info/
*
**/
 
function CookieHandler() {
 
	this.setCookie = function (name, value, seconds) {
 
		if (typeof(seconds) != 'undefined') {
			var date = new Date();
			date.setTime(date.getTime() + (seconds*1000));
			var expires = "; expires=" + date.toGMTString();
		}
		else {
			var expires = "";
		}
		
		document.cookie = name+"="+value+expires+"; path=/";
	}
 
	this.getIntCookieOrDefault = function(name, value, seconds) {
		var c = this.getCookie(name);
		console.log("Get", name, c);
		if (!c || !parseInt(c, 10)) {
			this.setCookie(name, value, seconds)
			return parseInt(value, 10);
		}
		else return parseInt(c, 10);
	}
 
	this.getCookie = function (name) {
 
		name = name + "=";
		var carray = document.cookie.split(';');
 
		for(var i=0;i < carray.length;i++) {
			var c = carray[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
		}
 
		return null;
	}
 
	this.deleteCookie = function (name) {
		this.setCookie(name, "", -1);
	}
 
}