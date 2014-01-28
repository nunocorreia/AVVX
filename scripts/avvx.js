
var AVVX = function ()
{
	var groupKeys = { 'Q': 0, 'W': 1, 'E': 2, 'R': 3, 'T': 4, 'Y': 5, 'U': 6, 'I': 7, 'O': 8, 'P': 9 };
	var behaviorKeys = { 'A': 0, 'S': 1, 'D': 2, 'F': 3, 'G': 4 };
	var behavior = [0, 0, 0, 0];
	var credits = [];
	var groups = [];
	var sketches = [];
	var isiPad;
	var touchUI;
	var audioEngine;

	var imageGroup1 = imageGroup2 = 0;
	var behaviorIndex = -1;
	var shuffle = false;
	var bgimage;
	var backgroundOn = false;
	var textVisible = true;
	var soundPlaying = false;
	var bMic = false;

	// https://github.com/mrdoob/three.js/wiki/How-to-run-things-locally
	// http://stackoverflow.com/questions/7981100/how-do-i-dynamically-insert-an-svg-image-into-html
	var refreshXML = function (newindex)
	{
		var group = imageGroup1 + imageGroup2;
		if (group >= groups.length) return;

		var img = document.getElementById("backimg");
		img.src = groups[group].background ? groups[group].background : bgimage;

		if (behaviorIndex >= 0)
			behavior[behaviorIndex].removeHandler();
		if (newindex != undefined) behaviorIndex = newindex;

		behavior[0] = new Btrail(groups[group].images, group, window.innerWidth, window.innerHeight, shuffle, soundPlaying);
		behavior[1] = new Bslide(groups[group].images, group, window.innerWidth, window.innerHeight, shuffle, soundPlaying);
		behavior[2] = new Bzoom(groups[group].images, group, window.innerWidth, window.innerHeight, shuffle, soundPlaying);
		behavior[3] = new BzoomOut(groups[group].images, group, window.innerWidth, window.innerHeight, shuffle, soundPlaying);
		behavior[4] = new Bprocessing(sketches[group], group, window.innerWidth, window.innerHeight, shuffle, soundPlaying);
		behavior[behaviorIndex].addHandler();
		//workaround to initiate background info:
		var b = behavior[behaviorIndex];
		b.textInfo.changeTextA(b.shuffle, b.micInput, backgroundOn);
	};

	this.onTouch = function (e)
	{
		// -- test swipes by changing behavior (left/right) or group (up/down)
		if (e.type == "swipe" && e.count >= 1)
		{
			var b;
			if (e.dir == "left" || e.dir == "right")
			{
				b = behaviorIndex;
				if (e.dir == "left") b++;
				else if (e.dir == "right") b--;
				if (b < 0 || b > 4) return;
			}
			else
			{
				var group = imageGroup1 + imageGroup2;
				if (e.dir == "up") group++
				else if (e.dir == "down") group--;
				if (group < 0 || group >= groups.length) return;
				imageGroup1 = group % 10;
				imageGroup2 = Math.floor(group / 10);
			}
			refreshXML(b);
		}
		else if(e.type=="tap"){
			console.log(e.code);
			switch(e.code)
			{
				case 17: // CONTROL (can't use TAB since it jumps between content and address bar)
					var b = behavior[behaviorIndex];
					b.shuffle = shuffle = !shuffle;
					b.textInfo.changeTextA(b.shuffle, b.micInput,backgroundOn);
					break;
				case 16: // SHIFT (todo: fade in/out)
					var b = behavior[behaviorIndex];
					backgroundOn = !backgroundOn;
					var img = document.getElementById("backimg");
					img.style.display = backgroundOn ? "block" : "none";
					b.textInfo.changeTextA(b.shuffle, b.micInput, backgroundOn);
					break;
				case 32: // SPACE
					textVisible = !textVisible;
					var texinfo = document.getElementById("textInfo");
					texinfo.style.display = textVisible ? "block" : "none";
					break;
				case 8: break; // BACKSPACE : was stop sound -- now toggled with ENTER
				case 13: // ENTER
					var b = behavior[behaviorIndex];
					b.soundPlaying = soundPlaying = !soundPlaying;
					audioEngine.play(soundPlaying);
					if (!soundPlaying)
						b.getSoundInfo(0);
					break;
			}

		}
		else behavior[behaviorIndex].touch(e);
		
	}
	this.onAudio = function (averageEnergy)	// between 0..1 and logarithmic
	{
		behavior[behaviorIndex].soundLevel = averageEnergy;
		// console.log(averageEnergy);
	}

	function onKey(e)
	{
		var keyCode = e.which; // parseInt(e.keyIdentifier.substr(2), 16);

		// -- 1234567890
		if (48 <= keyCode && keyCode <= 57)
		{
			imageGroup1 = (keyCode - 48) * 10;
			imageGroup2 = 0;
			refreshXML();
		}
		else switch (keyCode)
		{
			case 17: // CONTROL (can't use TAB since it jumps between content and address bar)
				var b = behavior[behaviorIndex];
				b.shuffle = shuffle = !shuffle;
				b.textInfo.changeTextA(b.shuffle, b.micInput,backgroundOn);
				break;
			case 16: // SHIFT (todo: fade in/out)
				var b = behavior[behaviorIndex];
				backgroundOn = !backgroundOn;
				var img = document.getElementById("backimg");
				img.style.display = backgroundOn ? "block" : "none";
				b.textInfo.changeTextA(b.shuffle, b.micInput, backgroundOn);
				break;
			case 32: // SPACE
				textVisible = !textVisible;
				var texinfo = document.getElementById("textInfo");
				texinfo.style.display = textVisible ? "block" : "none";
				break;
			case 8: break; // BACKSPACE : was stop sound -- now toggled with ENTER
			case 13: // ENTER
				var b = behavior[behaviorIndex];
				b.soundPlaying = soundPlaying = !soundPlaying;
				audioEngine.play(soundPlaying);
				if (!soundPlaying)
					b.getSoundInfo(0);
				break;
			case 77: // M (Mic)
				if (!isiPad)
				{
					var b = behavior[behaviorIndex];
					b.micInput = bMic = !bMic;
					audioEngine.activate("mic", bMic);
					b.textInfo.changeTextA(b.shuffle, b.micInput, backgroundOn);
				}
				break;
			default:
				{
					var char = String.fromCharCode(keyCode);

					// -- qwertyuiop
					if (Object.keys(groupKeys).indexOf(char) >= 0)
					{
						imageGroup2 = groupKeys[char];
						refreshXML();
					}
					// -- asdfg
					else if (Object.keys(behaviorKeys).indexOf(char) >= 0)
					{
						var index = behaviorKeys[char];
						refreshXML(index);
					}
				}
		}
		e.preventDefault();
		e.stopPropagation();
	}

	var loadXML = function ()
	{
		// -- get media.xml (synchronous)
		var xhr = new XMLHttpRequest();
		xhr.open("get", "media.xml", false);
		xhr.overrideMimeType("text/xml");
		xhr.send(null);
		if (xhr.status != 200)
			return false;
		var xml = xhr.responseXML;
		var media = xml.firstChild;

		// -- sound
		audioEngine.init(media.getAttribute("sound"));
		credits[2] = media.getAttribute("soundauthor");
		credits[3] = media.getAttribute("soundurl");

		// -- background 
		bgimage = media.getAttribute("bgimage");
		if (bgimage)
		{
			var img = document.getElementById("backimg");
			img.src = bgimage;
			img.style.display = "block";
			backgroundOn = true;
		}

		// -- groups and images (they are small, so load them all
		// -- todo: timeout
		var xmlgroups = xml.evaluate('/media/group', xml, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		var groupstoload = xmlgroups.snapshotLength;
		var sketchesLoaded = false;
		for (var i = 0; i < xmlgroups.snapshotLength; i++)
		{
			groups[i] = new Group(xmlgroups.snapshotItem(i), function (group)
			{
				if (--groupstoload <= 0)
				{
					var defaultBehavior = 3;
					if (window.location.hash) defaultBehavior = parseInt(window.location.hash.substring(1));
					if (sketchesLoaded) refreshXML(defaultBehavior);
				}
			});
		}

		// -- processing sketches
		var xmlsketches = xml.evaluate('/media/sketches', xml, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
		var sketchLoader = new SketchLoader(xmlsketches.singleNodeValue, function (s)
		{
			sketches = s;
			sketchesLoaded = true;
			if (groupstoload <= 0)
			{
				var defaultBehavior = 3;
				if (window.location.hash) defaultBehavior = parseInt(window.location.hash.substring(1));
				refreshXML(defaultBehavior);
			}
		});

		return true;
	};

	var init = function ()
	{
		isiPad = navigator.userAgent.match(/iPad/i) != null;
		touchUI = new TouchUI();
		audioEngine = new AudioEngine();
		loadXML();
		document.addEventListener("keydown", onKey);
	};

	init();
	return this;
}

var avvx;
function avvxinit()
{
	avvx = new AVVX();
}


