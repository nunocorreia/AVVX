
var Group = function (xmlgroup, onloaded)
{
	this.images = [];
	this.background = null;
	var self = this;

	var id = xmlgroup.getAttribute("id");
	var author = xmlgroup.getAttribute("author");
	var url = xmlgroup.getAttribute("url");
	self.background = xmlgroup.getAttribute("bgimage");

	var svgstoload = [];
	for (var i = 0; i < xmlgroup.childNodes.length; i++)
	{
		var node = xmlgroup.childNodes[i];
		if (node.nodeType == 1)
		{
			var svgfile = node.textContent;
			svgstoload.push(svgfile);
		}
	}

	// -- load images
	var loadcount = svgstoload.length;
	svgstoload.forEach(function (svgfile)
	{
		var xhr = new XMLHttpRequest();
		xhr.onload = function ()
		{
			var svg = xhr.responseXML;
			self.images.push(svg);
			/* var div = document.createElement("div");
			div.innerHTML = xhr.responseText;
			document.body.appendChild(div); */
			if (--loadcount <= 0) onloaded(self);
		};
		xhr.open("get", "images/" + svgfile, true);
		xhr.send(null);
	});
};
