
var SketchLoader = function (xmlsketches, onloaded)
{
	this.sketches = [];
	var self = this;

	var key = xmlsketches.getAttribute("key");
	var author = xmlsketches.getAttribute("author");
	var url = xmlsketches.getAttribute("url");

	var sketchestoload = [];
	for (var i = 0; i < xmlsketches.childNodes.length; i++)
	{
		var node = xmlsketches.childNodes[i];
		if (node.nodeType == 1)
		{
			var pdefile = node.textContent;
			sketchestoload.push(pdefile);
		}
	}

	// -- load sketches
	var loadcount = sketchestoload.length;
	sketchestoload.forEach(function (pdefile)
	{
		var xhr = new XMLHttpRequest();
		xhr.onload = function ()
		{
			var pde = xhr.responseText;
			self.sketches.push(pde);
			if (--loadcount <= 0) onloaded(self.sketches);
		};

		// 2014-04-14
		xhr.open("get", avvx.mediapath + "sketches/" + pdefile, true);
		xhr.send(null);
	});
};
