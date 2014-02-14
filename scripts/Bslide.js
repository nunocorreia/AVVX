var Bslide = function (images, group, w, h, shuffle, soundPlaying)
{
	// -- interaction params
	var sDirection = 1;
	var directionText = "down";
	var maxRotation = 10;
	var maxSpeed = 13;
	var maxSize = 2;
	var directions = [];

	// -- runtime
	var nSlides = 20;
	var counterMax = 500;
	var counter = 0;
	var posX = posY = 0;

	var rate = 1;
	var depth = 0;
	var depthMax = 20;
	var seqCounter = 0;
	var speedX = speedY = 1;
	var falpha = 1;
	var trailers = [];

	var slideset1, slideset2;
	var opacity = [];
	var scale = [];
	var speed1 = [];
	var speed2 = [];
	var angle1 = [];
	var angle2 = [];

	var self = this;
	Behavior.call(this, "Slide", images, group, w, h, shuffle, soundPlaying);

	this.init = function ()
	{
		slideset1 = document.createElement("div");
		slideset2 = document.createElement("div");
		document.body.appendChild(slideset1);
		document.body.appendChild(slideset2);
		slideset1.style.width = slideset2.style.width = this.stageW;
		slideset1.style.height = slideset2.style.height = this.stageH;
		slideset1.style.position = slideset2.style.position = "absolute";
		slideset1.style.left = slideset2.style.left = 0;
		slideset1.style.top = slideset2.style.top = 0;

		directions["down"] = 1;
		directions["up"] = 2;
		directions["left"] = 3;
		directions["right"] = 4;

		for (var i = 0; i < nSlides; i++)
		{
			scale.push(Math.random() * 0.75 + 0.25);
			speed1.push(Math.random() + 1);
			speed2.push(speed1[i]);
			angle1.push(Math.random());
			angle2.push(angle1[i]);
			opacity.push(1);
			//opacity.push(Math.random() * 0.6 + 0.2);
		}
		refreshSlide(slideset1, speed1, angle1, this.stageW, this.stageH);
		refreshSlide(slideset2, speed2, angle2, this.stageW, this.stageH);
	};
	this.exit = function ()
	{
		document.body.removeChild(slideset1);
		document.body.removeChild(slideset2);
	};

	this.onUpdate = function ()
	{
		if (slideset1.children.length == nSlides)
		{
			containerUpdate(slideset1, speed1, angle1);
			// console.log("set1");
		}
		if (slideset2.children.length == nSlides)
		{
			containerUpdate(slideset2, speed2, angle2);
			// console.log("set2");
		}
		counter++;
		if (counterMax % 2 != 0)
			counterMax--;
		if (counter == counterMax / 2)
			refreshSlide(slideset1, speed1, angle1, this.stageW, this.stageH);
		if (counter == counterMax)
		{
			refreshSlide(slideset2, speed2, angle2, this.stageW, this.stageH);
			counter = 0;
		}
		//audio reactive background if shuffle is on
		var img = document.getElementById("backimg");
		if (self.shuffle){
			img.style.webkitTransform = "scale(" + 2 * this.soundLevel + 1 +"," + 2 * this.soundLevel + 1 +")";
		}else{
			img.style.webkitTransform = "scale(1,1)";
		}
	}

	var containerUpdate = function (slideset, speed, angle)
	{
		var soundLevel = self.soundLevel;
		for (var i = 0; i < nSlides; i++)
		{
			var dx = dy = 0;
			var newspeed = speed[i] * maxSpeed;
			switch (sDirection)
			{
				case 1: dy += newspeed;  break;
				case 2: dy -= newspeed; break;
				case 3: dx -= newspeed; break;
				case 4: dx += newspeed; break;
			}
			slideset.children[i].x += dx;
			slideset.children[i].y += dy;
			slideset.children[i].rotation += angle[i] * maxRotation;

			var svg = self.getFirstElement(slideset.children[i]);
			svg = self.getFirstElement(svg);
			var ss = svg.transform.baseVal.getItem(0);
			ss.setTranslate(slideset.children[i].x, slideset.children[i].y);
			ss = svg.transform.baseVal.getItem(1);
			ss.setRotate(slideset.children[i].rotation % 360, 0, 0);
			ss = svg.transform.baseVal.getItem(2);
			ss.setScale(scale[i] * maxSize + soundLevel*2, scale[i] * maxSize + soundLevel*2);
		}
	};

	var refreshSlide = function (container, speed, angle, w, h)
	{
		for (var i = 0; i < nSlides; i++)
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
			svg.style.width = w;
			svg.style.height = h;
			var svgwidth = parseInt(svg.getAttribute("width"));
			var svgheight = parseInt(svg.getAttribute("height"));

			// -- position
			switch (sDirection)
			{
				case 1:// down
					posX = Math.random() * window.innerWidth - (window.innerWidth - svgwidth) / 2;
					posY = - window.innerHeight*0.5 - Math.random() * window.innerHeight * 8;
					directionText = "down";
					break;
				case 2:// up
					posX = Math.random() * window.innerWidth - (window.innerWidth - svgwidth) / 2;;
					posY = window.innerHeight*0.5 + Math.random() * window.innerHeight * 8;
					directionText = "up";
					break;
				case 3:// left
					posX = window.innerWidth*0.5 + Math.random() * window.innerWidth * 6;
					posY = Math.random() * window.innerHeight - (window.innerHeight - svgheight) / 2;;
					directionText = "left";
					break;
				case 4:// right
					posX = -window.innerWidth*0.5 - Math.random() * window.innerWidth * 6;
					posY = Math.random() * window.innerHeight - (window.innerHeight - svgheight) / 2;;
					directionText = "right";
					break;
			}

			var svgroot = self.getFirstElement(svg);
			svgroot.setAttribute("transform", "translate(" + posX + "," + posY + ") rotate(0) scale(0)");

			// -- slide
			var slide = document.createElement("div");
			slide.style.position = "absolute";
			slide.style.left = slide.style.top = 0;
			slide.x = slide.y = slide.rotation = 0;
			slide.appendChild(svg);
			if (container.children.length == nSlides)
				container.removeChild(container.children[0]);
			container.appendChild(slide);
			self.updateLayers();

			slide.x = posX;
			slide.y = posY;
			slide.style.opacity = opacity[i];
		}
	};

	this.onResize = function ()
	{
		resizeSet(slideset1, this.stageW, this.stageH);
		resizeSet(slideset2, this.stageW, this.stageH);
	};

	var resizeSet = function (slideset, w, h)
	{
		slideset.style.width = w;
		slideset.style.height = h;
		for (var i = 0; i < slideset.children.length; i++)
		{
			var div = slideset.children[i];
			div.children[0].style.width = w;
			div.children[0].style.height = h;
		}
	}

	this.onInput = function (type, param)
	{
		if (type == "trigger") switch (param)
		{
			case 38: if(sDirection<4) sDirection++; else sDirection=1; break; // down
			case 40: if(sDirection>1) sDirection--; else sDirection=4; break; // up
			case 39: maxRotation++; break; // x
			case 37: if (maxRotation > 0) maxRotation--; break; // z
			case 88: maxSpeed++; break; // v
			case 90: if (maxSpeed > 10) maxSpeed--; break; // c
			case 86: maxSize++; break; // n
			case 67: if (maxSize > 0) maxSize--; break; // b
			default: return false;
		}
		else if (type == "slider")
		{
			// slider #1
			if (param.id == "s1")
			{
				var value = Math.round(3 * (param.value / 100))+1;
				if (value != sDirection) sDirection = value;
				else return false;	// no need to change text
			}
			// slider #2
			if (param.id == "s2")
			{
				var value = Math.round(30*(param.value/100));
				if (value != maxRotation) maxRotation = value;
				else return false;	// no need to change text
			}
			// slider #3
			if (param.id == "s3")
			{
				var value = Math.round(20*(param.value/100))+10;
				if (value != maxSpeed) maxSpeed = value;
				else return false;	// no need to change text
			}
			// slider #4
			if (param.id == "s4")
			{
				var value = Math.round(5*(param.value))+100;
				if (value != maxSize) maxSize = value/100;
				else return false;	// no need to change text
			}
		}
		return true;
	};

	this.updateText = function ()
	{
			switch (sDirection)
			{
				case 1: directionText="down"; break;
				case 2: directionText="up"; break;
				case 3: directionText="left"; break;
				case 4: directionText="right"; break;
			}

		this.textInfo.changeTextB(["direction: "+directionText, "rotation: " + maxRotation, "speed: " + maxSpeed, "size: " + maxSize]);
	};
};
Bslide.prototype = Object.create(Behavior.prototype);