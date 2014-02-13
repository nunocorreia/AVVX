var TouchUI = function ()
{
	var onSlider = function (e)
	{
		var slider = e.target;
		var ymax = window.innerHeight - slider.offsetHeight;
		var y = slider.y + e.gesture.deltaY;
		if (y < 0) y = 0;
		else if (y > ymax) y = ymax;
		if (y != slider.offsetTop)
		{
			slider.style.top = y;
			var value = 100 - Math.round(100 * y / ymax);
			avvx.onTouch({ type: "slider", id: slider.id, value: value });
		}
		if (e.type == "dragend")
			slider.y = slider.offsetTop;
	};

	var onGesture = function (e)
	{
		var params = {};
		if (e.type == "tap")
		{
			// based on ...
			var x = e.gesture.center.pageX;
			var y = e.gesture.center.pageY;
			// ... this method should determine a command code that identifies
			// the grid item that was tapped. The command code is one of the
			// keyboard codes (see avvx.js onKey method). The command code
			// should be put into this field:
			params.code = 0;
			if(x>0 && x<window.innerWidth*(1/7) && y>0 && y<40) params.code = 32; //top left corner - text on/off
			if(x>window.innerWidth*(6/7) && x<window.innerWidth && y>0 && y<40) params.code = 13; //top right corner - mp3 start/pause
			if(x>0 && x<window.innerWidth*(1/7) && y>window.innerHeight-40 && y<window.innerHeight) params.code = 17; //bottom left corner - shuffle on/off
			if(x>window.innerWidth*(6/7) && x<window.innerWidth && y>window.innerHeight-40 && y<window.innerHeight) params.code = 16; //bottom right corner - background on/off
			if(x>window.innerWidth-40 && x< window.innerWidth && y>40 && y<window.innerHeight-40){
				var bID = Math.floor(y/(window.innerHeight/12))-1;
				avvx.imageGroup2=bID;
				avvx.refreshXML();
			}
			if(x>0 && x< 40 && y>40 && y<window.innerHeight-40){
				console.log(Math.floor(y/(window.innerHeight/12))-1);
				if(Math.floor(y/(window.innerHeight/12))-1<5){
					var bID = Math.floor(y/(window.innerHeight/12))-1;
					avvx.refreshXML(bID);
				}
			}

		}
		else if (e.type == "hold")
		{
			var x = e.gesture.center.pageX;
			var y = e.gesture.center.pageY;
			if(x>window.innerWidth-40 && x< window.innerWidth && y>40 && y<window.innerHeight-40){
				console.log("long!");
				var bID = Math.floor(y/(window.innerHeight/12))-1;
				avvx.imageGroup1=bID*10;
				avvx.refreshXML();
			}
			if(x>window.innerWidth*(6/7) && x<window.innerWidth && y>0 && y<40) params.code = 77; //top right corner - mic on/off
			if(x>0 && x<window.innerWidth*(1/7) && y>0 && y<40) params.code = 76; //top left corner - UI on/off
		}
		else if (e.type == "swipe")
		{
			params.dir = e.gesture.direction;
			params.count = e.gesture.touches.length;
		}
		else if (e.type == "transform")
		{
			params.x = e.gesture.center.pageX;
			params.y = e.gesture.center.pageY;
			params.dx = e.gesture.deltaX;
			params.dy = e.gesture.deltaY;
			params.angle = e.gesture.angle;
			params.vx = e.gesture.velocityX;
			params.vy = e.gesture.velocityY;
			params.scale = e.gesture.scale;
			params.rotation = e.gesture.rotation;
		}
		params.type = e.type;
		avvx.onTouch(params);
	};

	// -- buttons right
	var rbuttons = document.querySelectorAll(".rbutton");
	for (var i = 0; i < rbuttons.length; i++)
	{
		var rbutton = rbuttons[i];
		rbutton.style.left = window.innerWidth-40;
		rbutton.style.top = window.innerHeight/12*(i+1);
	}

	// -- buttons left
	var lbuttons = document.querySelectorAll(".lbutton");
	for (var j = 0; j < lbuttons.length; j++)
	{
		var lbutton = lbuttons[j];
		lbutton.style.left = 0;
		lbutton.style.top = window.innerHeight/12*(j+1);
	}


	// -- surface catches taps and swipes
	// -- removed transform for the moment, since it seems to slow things down
	var surface = document.body; // getElementById("touchSurface");
	//var hammerG = Hammer(surface, { hold: false, swipe_max_touches: 2, swipe_velocity: 0.7 });
	var hammerG = Hammer(surface, { swipe_max_touches: 2, swipe_velocity: 0.7 });
	hammerG.on("tap swipe hold", onGesture);	// transform

	// -- sliders
	var sliders = document.querySelectorAll(".slider");
	for (var i = 0; i < sliders.length; i++)
	{
		var slider = sliders[i];
		slider.style.left = window.innerWidth/7 + slider.offsetWidth * i + "px";
		slider.y = slider.offsetTop;
		var hammerS = Hammer(slider, { hold: false, drag_min_distance: 5, drag_max_touches: 0 });
		hammerS.on("drag dragend", onSlider);
	}


	document.addEventListener("touchmove", function (e) { e.preventDefault(); }, false)
};
