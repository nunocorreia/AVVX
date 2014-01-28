
var Bprocessing = function (sketch, group, w, h, shuffle, soundPlaying)
{
	Behavior.call(this, "Processing", sketch, group, w, h, shuffle, soundPlaying);

	this.init = function ()
	{
		var canvas = document.createElement("canvas");
		canvas.style.outline = "none";
		canvas.style.position = "absolute";
		canvas.style.left = canvas.style.top = 0;
		canvas.width = w; canvas.height = h;
		canvas.tabIndex = 1;
		document.body.appendChild(canvas);
		this.canvas = canvas;

		this.p = new Processing(canvas, sketch);
		this.textInfoB = new this.p.ArrayList();
		this.textInfoC = new this.p.ArrayList();
		if (this.p.avvx_init)
			this.title = this.p.avvx_init();
		if (this.p.avvx_resize)
			this.p.avvx_resize(window.innerWidth, window.innerHeight);

		this.canvas.focus();
	};

	this.exit = function ()
	{
		this.p.exit();
		if (this.p.avvx_exit)
			this.p.avvx_exit();
		document.body.removeChild(this.canvas);
	};

	this.onResize = function ()
	{
		if (this.p.avvx_resize)
			this.p.avvx_resize(window.innerWidth, window.innerHeight);
	};

	this.addHandler = function ()
	{
		Behavior.prototype.addHandler.call(this);
		this.running = false;
	}

	this.onInput = function (type, param)
	{
		if (this.p.avvx_interaction)
			return this.p.avvx_interaction(type, param);
	}

	this.updateText = function ()
	{
		if (this.p.avvx_updateText)
		{
			this.textInfoB.clear();
			this.textInfoC.clear();
			this.p.avvx_updateText(this.textInfoB, this.textInfoC);
			this.textInfo.changeTextB(this.textInfoB.toArray());
			this.textInfo.changeTextC(this.textInfoC.toArray());
		}
	};

/*
	// -- the above is generic and common to all processing templates
	// -- the simple bouncing implementation for the spiral thingy is below

	this.x = w / 2;
	this.y = h / 2;
	this.speedX = 5;
	this.speedY = 5;
	this.dirX = 1;
	this.dirY = 1;
	var self = this;

	this.onInput = function (type, param)
	{
		return this.p.avvx_interaction(type, param);
		var dx = 0, dy = 0;
		if (type == "trigger") switch(param)
		{
			case 40: if (this.speedY > 0) dy = -1; break; // down
			case 38: dy = 1; break; // up
			case 39: dx = 1; break; // right
			case 37: if (this.speedX > 0) dx = -1; break; // left
			case 67: this.p.setParams2(Math.random(), Math.random(), Math.random()); break; // c
			default: return false;
		}
		if (dx != 0) this.speedX += dx;
		else if (dy != 0) this.speedY += dy;
		return true;
	}

	this.updateText = function ()
	{
		this.textInfoB.clear();
		this.textInfoC.clear();
		this.p.avvx_updateText(this.textInfoB, this.textInfoC);
		this.textInfo.changeTextB(this.textInfoB.toArray());
		this.textInfo.changeTextC(this.textInfoC.toArray());
	}; */
};
Bprocessing.prototype = Object.create(Behavior.prototype);
