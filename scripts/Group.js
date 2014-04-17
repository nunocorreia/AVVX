
var Group = function (xmlgroup, onloaded)
{
	this.images = [];
	this.background = null;
	var self = this;

	var id = xmlgroup.getAttribute("id");
	this.author = xmlgroup.getAttribute("author");
	var url = xmlgroup.getAttribute("url");
	self.background = xmlgroup.getAttribute("bgimage");
	if (self.background) self.background = avvx.mediapath + self.background;	// 2014-04-14

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

		// 2014-04-14
		xhr.open("get", avvx.mediapath + "images/" + svgfile, true);
		xhr.send(null);
	});
};
