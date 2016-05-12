
// center a div within a container
center = function(elem, container) {

	var g = document.getElementById(elem);
	g.style.margin = 'auto auto';
	var gHt = g.offsetHeight;
	var gWid = g.offsetWidth;
	
	var f = document.getElementById(container);
	var fHt = f.offsetHeight;
	var fWid = f.offsetWidth;

	// center horizontally
	var w = fWid - gWid;
	if (w) {
		var left = Math.floor(w / 2);
		var pct = Math.floor((left/fWid) * 100);
		g.style.margin = 'auto ' + pct + '%';
	}		

	// center vertically
	var h = fHt - gHt;
	if (h) {
		var top = Math.floor(h / 2);
		g.style.top = top + 'px';
	}
}

hasClass = function(ele,cls) {
	if (!ele || !ele.className) {
		return false;
	}
	return ele.className.match(new RegExp("(\\s|^)"+cls+"(\\s|$)"));
}

addClass = function(ele,cls) {
	if (!ele) {
		return false;
	}
	if (!hasClass(ele,cls)) {
		ele.className+=" "+cls;
	}
}

removeClass = function(ele,cls) {
	if (hasClass(ele,cls)) {
		var reg=new RegExp("(\\s|^)"+cls+"(\\s|$)");
		ele.className=ele.className.replace(reg," ")
	}
}


