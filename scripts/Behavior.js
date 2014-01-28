
var Behavior = function (name, images, group, w, h, shuffle, soundPlaying)
{
	this.images = images;
	this.textInfo = new TextInfo(name);
	this.group = group;
	this.stageW = w;
	this.stageH = h;
	this.shuffle = shuffle;
	this.soundPlaying = soundPlaying;
	this.micInput = false;
	this.running = false;
	this.soundLevel = 0;
};

Behavior.prototype =
{
	constructor: Behavior,

	// -- overridables
	init: function () { },
	exit: function () { },
	updateText: function () { },
	onUpdate: function () { },
	onInput: function (type, param) { },
	onResize: function () { },

	// -- init/exit
	addHandler: function ()
	{
		this.init();
		this.textInfo.init(this.group, this.shuffle, false, this.title);
		this.updateText();

		document.addEventListener("keydown", this.key.bind(this), false);
		window.addEventListener("resize", this.resize.bind(this));

		var self = this;
		var update = function ()
		{
			self.onUpdate();
			if (self.running)
				window.requestAnimationFrame(update);
		};
		this.running = true;
		update();
	},
	removeHandler: function ()
	{
		this.running = false;
		window.removeEventListener("resize", this.resize);
		document.removeEventListener("keydown", this.key);
		this.exit();
	},

	getSoundInfo: function (peakLevel) { this.soundLevel = peakLevel; },

	// -- event handlers
	resize: function (e)
	{
		this.stageW = window.innerWidth;
		this.stageH = window.innerHeight;
		this.onResize();
	},
	key: function (e)
	{
		if (this.onInput("trigger", e.which))
			this.updateText();
		e.stopPropagation();
	},
	touch: function (e)
	{
		var update = false;
		switch (e.type)
		{
			case "tap": update = this.onInput("trigger", e.code); break;
			case "swipe": update = this.onInput("swipe", e.dir); break;
			case "slider": update = this.onInput("slider", e); break;
			case "transform": update = this.onInput("transform", e); break;
		}
		if (update)
			this.updateText();
	},

	// -- helper function to import an SVG image
	importImage: function (images, index)
	{
		var svg = null;
		var image = images[0];
		if (image)
		{
			svg = document.importNode(image.documentElement, true);
			svg.style.width = this.stageW;
			svg.style.height = this.stageH;
			svg.style.position = "absolute";
			svg.style.left = svg.style.top = 0;
		}
		return svg;
	},

	// -- helper function to return the first element/shape in the svg
	getFirstElement: function (svgdoc)
	{
		for (i = 0; i < svgdoc.childNodes.length; i++)
			if (svgdoc.childNodes[i].nodeType == 1) return svgdoc.childNodes[i];
		return null;
	}

};