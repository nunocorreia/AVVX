var BzoomOut = function (images, group, w, h, shuffle, soundPlaying)
{
	// -- input params
	var centerX = w / 2;
	var centerY = h / 2;

	// -- interaction params
	var angle = 0;
	var maxFrame = 40;

	// -- runtime
	var maxMC = 4;
	var emptyMC = [];
	var rotateMC = [];
	var normalScale = [];
	var counter = 0;
	var indexMC = 0;
	var seqCounter = 0;
	var distCenter = 100;

	var self = this;
	Behavior.call(this, "ZoomOut", images, group, w, h, shuffle, soundPlaying);

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
	this.exit = function ()	// probably identical with Bzoom
	{
		for (var i = 0; i < emptyMC.length; i++)
			document.body.removeChild(emptyMC[i]);
	};

	var defaultSettings = function (index)
	{
		var w = emptyMC[index].svgwidth;
		var h = emptyMC[index].svgheight;
		var adjustedCenterX = window.innerWidth/2-(window.innerWidth-w)/2;
		var x = adjustedCenterX + (Math.random() * 2-1)*distCenter;
		var adjustedCenterY = window.innerHeight/2-(window.innerHeight-h)/2;
		var y = adjustedCenterY + (Math.random() * 2 - 1) * distCenter;

		var svg = emptyMC[index].children[0];
		self.getFirstElement(svg).setAttribute("transform", "translate(" + x + "," + y + ") rotate(0) scale(0)");
		emptyMC[index].scaleX = 100;
		emptyMC[index].scaleY = 100;
		emptyMC[index].rotation = 0;
		emptyMC[index].children[0].style.opacity = Math.random() * 0.6 + 0.2;
		rotateMC[index] = Math.round(Math.random());
		normalScale[index] = 5;
	}

	this.onUpdate = function ()
	{
		for (var i = 0; i < maxMC; i++)
		{
			emptyMC[i].scaleX = normalScale[i];
			emptyMC[i].scaleY = normalScale[i];
			var zspeed = 0.05;
			if (emptyMC[i].scaleX > zspeed)
			{
				emptyMC[i].scaleX -= zspeed;
				emptyMC[i].scaleY -= zspeed;
			}
			normalScale[i] = emptyMC[i].scaleX;
			emptyMC[i].scaleX *= 1 + this.soundLevel;
			emptyMC[i].scaleY *= 1 + this.soundLevel;
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
			//audio reactive background if shuffle is on
			var img = document.getElementById("backimg");
			if (self.shuffle){
				img.style.webkitTransform = "scale(" + 2 * this.soundLevel + 1 +"," + 2 * this.soundLevel + 1 +")";
			}else{
				img.style.webkitTransform = "scale(1,1)";
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
		svg.style.height = self.stageH;
		emptyMC[indexMC].svgwidth = parseInt(svg.getAttribute("width"));
		emptyMC[indexMC].svgheight = parseInt(svg.getAttribute("height"));

		if (emptyMC[indexMC].children.length > 0) // && emptyMC[indexMC].scaleX <= 0.1)
			emptyMC[indexMC].removeChild(emptyMC[indexMC].children[0]);

		emptyMC[indexMC].appendChild(svg);
		self.updateLayers();
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
			case 90: if (distCenter > 0) distCenter -= 10; break; // Z
			case 88: if (distCenter < 500) distCenter += 10; break; // X
			default: return false;
		}
		else if (type == "slider")
		{
			// slider #1
			if (param.id == "s1")
			{
				var value = Math.round(15 * (param.value - 50) / 50);
				if (value != angle) angle = value;
				else return false;	// no need to change text
			}
			// slider #2
			else if (param.id == "s2")
			{
				var value = 6 + Math.round((150 - 6) * param.value / 100);
				if (value != maxFrame) maxFrame = value;
				else return false;	// no need to change text
			}
			// slider #3
			else if (param.id == "s3")
			{
				var value = Math.round(500 * (param.value / 100));
				if (value != distCenter) distCenter = value;
				else return false;	// no need to change text
			}
		}
		return true;
	};

	this.updateText = function ()
	{
		var maxSec = (maxFrame / 60).toFixed(1);
		this.textInfo.changeTextB(["rotation: " + angle, "timer: " + maxSec + "s", "decenter: "+distCenter]);
	};
};
BzoomOut.prototype = Object.create(Behavior.prototype);