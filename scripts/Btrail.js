var Btrail = function (images, group, w, h, shuffle, soundPlaying)
{
	// -- interaction params
	var size = 1;
	var alpha = 10;
	var angle = 0;
	var angleSum =0;
	var spacing = 1;

	// -- runtime
	var counter = 0;
	var rate = 1;
	var depth = 0;
	var depthMax = 20;
	var seqCounter = 0;
	var posX = posY = 0;
	var speedX = speedY = 1;
	var falpha = 1;
	var trailers = [];
	var container;

	Behavior.call(this, "Trails", images, group, w, h, shuffle, soundPlaying);

	this.init = function ()
	{
		container = document.createElement("div");
		container.style.width = this.stageW;
		container.style.height = this.stageH;
		container.style.position = "absolute";
		container.style.left = container.style.top = 0;
		document.body.appendChild(container);
		trailers = [];
		posX = Math.random() * (this.stageW / 2) + this.stageW / 4;
		posY = Math.random() * (this.stageH / 2) + this.stageH / 4;
	};

	this.exit = function ()
	{
		document.body.removeChild(container);
	};

	this.onUpdate = function ()
	{
		var svgdoc;

		if (counter % rate == 0)
		{
			if (trailers.length > depthMax)
			{
				container.removeChild(trailers[0]);
				trailers.splice(0, 1);
			}

			if (this.shuffle)
			{
				var randomSVG = Math.floor(Math.random() * this.images.length);
				svgdoc = this.images[randomSVG];
			}
			else
			{
				svgdoc = this.images[seqCounter++];
				if (seqCounter >= this.images.length)
					seqCounter = 0;
			}

			var trailer = document.importNode(svgdoc.documentElement, true);
			trailer.style.width = this.stageW;
			trailer.style.height = this.stageH;
			trailer.style.position = "absolute";
			trailer.style.left = 0;
			trailer.style.top = 0;
			
			var newPosX=posX - (800 - parseInt(trailer.getAttribute("width")))/2
			var newPosY=posY - (600 - parseInt(trailer.getAttribute("height")))/2
			var xform = "translate(" + newPosX + " " + newPosY + ")";
			xform += " scale(" + (size + this.soundLevel) + ")";
			xform += " rotate(" + angleSum + ")";
			var svgroot = this.getFirstElement(trailer);
			svgroot.setAttribute("transform", xform);
			trailer.style.opacity = falpha;
			
			container.appendChild(trailer);
			this.updateLayers();
			trailers.push(trailer);

			if (++depth >= depthMax)
				depth = 0;

			var r = svgroot.getBoundingClientRect();
			if (r.left < 0-r.width/4) { changeDirectionX(); }
			else if (r.right > this.stageW+r.width/4) { changeDirectionX(); speedX *= -1; }
			if (r.top < 0-r.height/4) { changeDirectionY(); }
			else if (r.bottom > this.stageH+r.height/4) { changeDirectionY(); speedY *= -1; }
		}

		// -- movement
		posX += speedX * spacing;
		posY += speedY * spacing;
		angleSum += angle;

		counter++;

		//audio reactive background if shuffle is on
		var img = document.getElementById("backimg");
		if (this.shuffle){
			img.style.webkitTransform = "scale(" + 2 * this.soundLevel + 1 +"," + 2 * this.soundLevel + 1 +")";
		}else{
			img.style.webkitTransform = "scale(1,1)";
		}

	};

	var changeDirectionX = function () { speedX = Math.random() * 3.5 + 1.5; };
	var changeDirectionY = function () { speedY = Math.random() * 3.5 + 1.5; };

	this.onInput = function (type, param)
	{
		if (type == "trigger") switch (param)
		{
			case 38: angle += 1; break; // up
			case 40: angle -= 1; break; // down
			case 39: if (alpha < 10) alpha++; falpha = alpha * 0.1; break; // left
			case 37: if (alpha > 0) alpha--; falpha = alpha * 0.1; break; // right
			case 88: size += 0.1; break; // x
			case 90: if (size > 0.1) size -= 0.1; break; // z
			case 86: spacing += 1; break; // v
			case 67: if (spacing > 0) spacing -= 1; break; // c
			case 78: rate += 1; break; // n
			case 66: if (rate > 1) rate -= 1; break; // b
			default: return false;
		}
		else if (type == "slider")
		{
			// slider #1
			if (param.id == "s1")
			{
				var value = Math.round(30 * (param.value - 50) / 50);
				if (value != angle) angle = value;
				else return false;	// no need to change text
			}
			// slider #2
			if (param.id == "s2")
			{
				var value = param.value;
				if (value != falpha) falpha = value/100;
				else return false;	// no need to change text
			}
			// slider #3
			if (param.id == "s3")
			{
				var value = 10*(param.value);
				if (value != size) size = value/100;
				else return false;	// no need to change text
			}
			// slider #4
			if (param.id == "s4")
			{
				var value = Math.round(20*(param.value/100));
				if (value != spacing) spacing = value;
				else return false;	// no need to change text
			}
			// slider #5
			if (param.id == "s5")
			{
				var value = Math.round(20*(param.value/100));
				if (value != rate) rate = value;
				else return false;	// no need to change text
			}


		}
		return true;
	};

	this.updateText = function ()
	{
		var s = size.toFixed(1);
		var a = falpha.toFixed(1);
		this.textInfo.changeTextB(["rotation: " + angle, "alpha: " + a, "size: " + s, "spacing: " + spacing, "speed: " + rate]);
	};
};
Btrail.prototype = Object.create(Behavior.prototype);
