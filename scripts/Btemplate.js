//
// AVVX JS behavior template
//
// the custom behavior can be included as follows:
// 1. in avvx.htm, add <script src="Btemplate.js"></script> (or whatever the template is called)
// 2. in avvx.js, add a new key into 'behaviorKeys' variable. This is used to activate the behavior from the keyboard
// 3. in avvx.js refreshXML() function, append line (replace number 5 below with the number assigned in the 'behaviorKeys'
//		behavior[4] = new Btemplate(groups[group].images, group, window.innerWidth, window.innerHeight, shuffle);
//
var Btemplate = function (images, group, w, h, shuffle)
{
	// -- call superclass first with the name of the Behavior (here "Template")
	Behavior.call(this, "Template", images, group, w, h, shuffle);

	// -- invoked when behavior is activated : perform one-time initialization here
	// -- the example below centers the first image into the screen
	this.init = function ()
	{
		// -- 1. import an image and put it on screen
		this.svg = this.importImage(images, 0);
		document.body.appendChild(this.svg);

		// -- 2. set the position of the first shape and change its color
		var shape = this.getFirstElement(this.svg);
		shape.setAttribute("transform", "translate(100,200)");
		shape.setAttribute("fill", "#FFFF00");
		this.shape = shape;
	};

	// -- invoked when behavior is deactivated
	// -- perform cleanup here
	this.exit = function ()
	{
		document.body.removeChild(this.svg);
	};

	// -- animation loop: invoked at 60 FPS
	this.rot = 0;
	this.scale = 1;
	this.onUpdate = function ()
	{
		this.rot += 1;
		this.shape.setAttribute("transform", "translate(100,200) rotate(" + this.rot + ") scale(" + this.scale + ")");
	};

	// -- user input
	// -- update interaction parameters here
	// -- type "trigger" : keyboard/tap, param is command code (currently keycode)
	// -- type "slider" : touch slider, param is continuous value
	this.onInput = function (type, param)
	{
		if (type == "trigger") switch (param)
		{
			case 39: this.scale += 0.1; break; // right
			case 37: this.scale -= 0.1; break; // left
			default: return false;	// return false if the command code was not handled
		}
		return true;
	};

	// -- invoked when the browser window is resized
	this.onResize = function ()
	{
		this.svg.style.width = this.stageW;
		this.svg.style.height = this.stageH;
	}

	// -- behavior-specific text display
	// -- each item in the array below is shown in a separate line
	this.updateText = function ()
	{
		var s = this.scale.toFixed(1);
		this.textInfo.changeTextB(["scale: " + s, "2nd line", "and so on"]);
	};
};

// -- finally, derive the custom behavior from the superclass
Btemplate.prototype = Object.create(Behavior.prototype);


