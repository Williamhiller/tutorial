function setCookie(sName, sValue, dExpires, sDomain, sPath, bSecure) {
	var sStr = "";

	/* cock */
	sStr += sName;
	sStr += "=";
	sStr += escape(sValue);
	if(dExpires != null){ sStr += "; expires=" + dExpires.toGMTString(); }
	if(sDomain != null){ sStr += "; domain=" + sDomain; }
	if(sPath != null){ sStr += "; path=" + sPath; }
	if(bSecure == true){ sStr += "; secure"; }

	/* bake */
	document.cookie = sStr;
}

function getCookie(sName) {
	var nLen = ("" + sName).length + 2;
	var sCookie = " " + document.cookie;
	var nStart = sCookie.indexOf(" " + sName + "=");
	var nEnd = sCookie.indexOf(";", nStart + nLen);

	/* name is nothing */
	if(nStart == -1){ return null; }

	/* search end point */
	if(nEnd == -1){ nEnd = sCookie.length; }

	/* eat and return */
	return unescape(sCookie.substring(nStart + nLen, nEnd));
}

function removeCookie(sName) {
	var dExpires = new Date();
	var sValue = getCookie(sName);

	// HTTP protocol judgment!!
	var bSecure = false;
	if (window.location.protocol.indexOf( "https") != -1){
		bSecure = true;
	}

	/* set expire to past */
	if(sValue != null){ setCookie(sName, sValue, dExpires,null,null,bSecure); }
}

function getCookieNames(){
	var sCookie = " " + document.cookie;

	if(sCookie.length > 2){
		var array = new Array();
		var startPoint = 0;
		while(true){
			var headPoint = sCookie.indexOf(" ", startPoint);
			if(headPoint == -1){ break; }
			var tailPoint = sCookie.indexOf("=", headPoint);
			var name = sCookie.substring(headPoint + 1, tailPoint);
			array[array.length] = name;
			startPoint = sCookie.indexOf(";", tailPoint);
			if(startPoint == -1){ break; }
		}
		return array;
	}
	else{
		return new Array();
	}
}
