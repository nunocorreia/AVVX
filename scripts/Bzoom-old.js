var Bzoom = function (images, group, w, h, shuffle, soundPlaying)
{
	// -- input params
	var centerX = w / 2;
	var centerY = h / 2;

	// -- interaction params
	var angle = 0;
	var maxFrame = 60;

	// -- runtime
	var maxMC = 4;
	var emptyMC = [];
	var rotateMC = [];
	var normalScale = [];
	var counter = 0;
	var indexMC = 0;
	var seqCounter = 0;

	var self = this;
	Behavior.call(this, "Zoom", images, group, w, h, shuffle, soundPlaying);

	this.init = function ()
	{
		for (var i = 0; i < maxMC; i++)
		{
			emptyMC[i] = document.createElement("div");
			emptyMC[i].style.width = this.stageW;
			emptyMC[i].style.height = this.stageH;
			emptyMC[i].style.position = "absolute";
			emptyMC[i].style.left = emptyMC[i].style.top = 0;
			document.body.appendChild(emptyMC[i]);
		}
		zoomRefresh();
	};
	this.exit = function ()
	{
		for (var i = 0; i < emptyMC.length; i++)
			document.body.removeChild(emptyMC[i]);
	};

	var defaultSettings = function (index)
	{
		//var x = centerX; //+ (Math.random() * centerX / 2 - centerX / 4);
		var adjustedCenterX = window.innerWidth/2-(window.innerWidth-800)/2;
		var x = adjustedCenterX;
		var y = window.innerHeight/2; //+ (Math.random() * centerY / 2 - centerY / 4);
		var svg = emptyMC[index].children[0];
		//self.getFirstElement(svg).setAttribute("transform", "translate(" + x + "," + y + ") rotate(0) scale(0.1)");
		self.getFirstElement(svg).setAttribute("transform", "translate(" + x + "," + y + ") rotate(0) scale(0.1)");
		emptyMC[index].scaleX = 100;
		emptyMC[index].scaleY = 100;
		emptyMC[index].rotation = 0;
		svg.style.opacity = Math.random() * 0.6 + 0.2;
		rotateMC[index] = Math.round(Math.random());
		normalScale[index] = 0;
	}

	this.onUpdate = function ()
	{
		for (var i = 0; i < maxMC; i++)
		{
			emptyMC[i].scaleX = normalScale[i] + 0.05;
			emptyMC[i].scaleY = normalScale[i] + 0.05;
			normalScale[i] = emptyMC[i].scaleX;
			emptyMC[i].scaleX *= 1 + this.soundLevel / 10;
			emptyMC[i].scaleY *= 1 + this.soundLevel / 10;
			if (angle)
			{
				if (rotateMC[i]) emptyMC[i].rotation += angle;
				else emptyMC[i].rotation -= angle;
			}

			if (emptyMC[i].children.length > 0)
			{
				var rot = emptyMC[i].rotation % 360;
				if (rot < 0) rot += 360;
				var svg = this.getFirstElement(emptyMC[i].children[0]);
				var ss = svg.transform.baseVal.getItem(1);
				ss.setRotate(rot, 0, 0);
				ss = svg.transform.baseVal.getItem(2);
				ss.setScale(emptyMC[i].scaleX, emptyMC[i].scaleY);
			}
		}

		counter++;
		if (counter >= maxFrame)
		{
			counter = 0;
			zoomRefresh();
		}
	}

	var zoomRefresh = function ()
	{
		// -- SVG
		var svgdoc;
		if (self.shuffle)
		{
			var randomSVG = Math.floor(Math.random() * self.images.length);
			svgdoc = self.images[randomSVG];
		}
		else
		{
			svgdoc = self.images[seqCounter++];
			if (seqCounter >= self.images.length)
				seqCounter = 0;
		}
		var svg = document.importNode(svgdoc.documentElement, true);
		svg.style.width = self.stageW;
		svg.style.height = self.stagH;
		self.getFirstElement(svg).setAttribute("transform", "translate(0,0) rotate(0) scale(1)");

		if (emptyMC[indexMC].children.length > 0)
			emptyMC[indexMC].removeChild(emptyMC[indexMC].children[0]);
		emptyMC[indexMC].appendChild(svg);
		defaultSettings(indexMC);

		indexMC++;
		if (indexMC == maxMC)
			indexMC = 0;
	}

	this.onResize = function ()
	{
		for (var i = 0; i < maxMC; i++)
		{
			emptyMC[i].style.width = this.stageW;
			emptyMC[i].style.height = this.stageH;
		}
	};

	this.onInput = function (type, param)
	{
		if (type == "trigger") switch (param)
		{
			case 38: angle += 1; break; // up
			case 40: angle -= 1; break; // down
			case 37: if (maxFrame > 6) maxFrame -= 6; break; // left
			case 39: if (maxFrame < 150) maxFrame += 6; break; // right
			default: return false;
		}
		return true;
	};

	this.updateText = function ()
	{
		var maxSec = (maxFrame / 60).toFixed(1);
		this.textInfo.changeTextB(["rotation: " + angle, "timer: " + maxSec + "s"]);
	};
};
Bzoom.prototype = Object.create(Behavior.prototype);