
var AVVX = function ()
{
	var groupKeys = { 'Q': 0, 'W': 1, 'E': 2, 'R': 3, 'T': 4, 'Y': 5, 'U': 6, 'I': 7, 'O': 8, 'P': 9 };
	var behaviorKeys = { 'A': 0, 'S': 1, 'D': 2, 'F': 3, 'G': 4 };
	var behavior = [0, 0, 0, 0, 0];
	var credits = [];
	var groups = [];
	var sketches = [];
	var isiPad;
	var touchUI;
	var audioEngine;
	var self = this;
	var hasSketches = false;

	// command mapping
	// 08 = BACKSPACE (not used: sound is now toggled with ENTER)
	// 13 = ENTER
	// 16 = SHIFT
	// 17 = CONTROL (can't use TAB since it jumps between content and address bar)
	// 32 = SPACE
	// 77 = M
	// 76 = L
	var commands = { 8: 'obsolete', 13: 'sound', 16: 'background', 17: 'shuffle', 32: 'textinfo', 77: 'mic', 76:'uitoggle' };

	this.imageGroup1 = this.imageGroup2 = 0;
	var behaviorIndex = -1;
	var shuffle = false;
	var bgimage;
	var backgroundOn = false;
	var textVisible = true;
	var soundPlaying = false;
	var bMic = false;

	this.refreshXML = function (newindex)
	{
		var group = self.imageGroup1 + self.imageGroup2;
		console.log("gr1:"+self.imageGroup1/10+", gr2:"+self.imageGroup2 +", "+group);
		//if (group >= groups.length) return;
		if (group >= groups.length){
			group=groups.length-1;
			self.imageGroup1 = Math.floor(group / 10)*10;
			self.imageGroup2 = group%10;
			console.log("Maxed! gr1:"+self.imageGroup1/10+", gr2:"+self.imageGroup2 +", "+group);
		}

		var img = document.getElementById("backimg");
		img.src = groups[group].background ? groups[group].background : bgimage;

		if (behaviorIndex >= 0)
			behavior[behaviorIndex].removeHandler();
		if (newindex != undefined) 
		{
			if (newindex == behavior.length-1 && !hasSketches);
			else behaviorIndex = newindex;
		}


		behavior[0] = new Btrail(groups[group].images, group, window.innerWidth, window.innerHeight, shuffle, soundPlaying);
		behavior[1] = new Bslide(groups[group].images, group, window.innerWidth, window.innerHeight, shuffle, soundPlaying);
		behavior[2] = new Bzoom(groups[group].images, group, window.innerWidth, window.innerHeight, shuffle, soundPlaying);
		behavior[3] = new BzoomOut(groups[group].images, group, window.innerWidth, window.innerHeight, shuffle, soundPlaying);

		var visualCredits = groups[group].author;
		if (hasSketches && behaviorIndex == 4)	// bugfix
		{
			behavior[4] = new Bprocessing(sketches[group], group, window.innerWidth, window.innerHeight, shuffle, soundPlaying);
			visualCredits = this.sketchLoader.sketches[group].author;
		}
		behavior[behaviorIndex].addHandler();
		behavior[behaviorIndex].setCredits(visualCredits, credits[2]);

		//workaround to initiate background info:
		var b = behavior[behaviorIndex];
		b.textInfo.changeTextA(b.shuffle, b.micInput, backgroundOn);
	};

	this.onCommand = function(cmd)
	{
		switch (cmd)
		{
			case 'shuffle':
				var b = behavior[behaviorIndex];
				b.shuffle = shuffle = !shuffle;
				b.textInfo.changeTextA(b.shuffle, b.micInput, backgroundOn);
				break;
			case 'background': // todo: fade in/out
				var b = behavior[behaviorIndex];
				backgroundOn = !backgroundOn;
				var img = document.getElementById("backimg");
				img.style.display = backgroundOn ? "block" : "none";
				b.textInfo.changeTextA(b.shuffle, b.micInput, backgroundOn);
				break;
			case 'textinfo':
				textVisible = !textVisible;
				var texinfo = document.getElementById("textInfo");
				texinfo.style.display = textVisible ? "block" : "none";
				break;
			case 'sound':
				var b = behavior[behaviorIndex];
				b.soundPlaying = soundPlaying = !soundPlaying;
				audioEngine.play(soundPlaying);
				if (!soundPlaying)
					b.getSoundInfo(0);
				break;
			case 'mic':
				if (!isiPad)
				{
					var b = behavior[behaviorIndex];
					b.micInput = bMic = !bMic;
					audioEngine.activate("mic", bMic);
					b.textInfo.changeTextA(b.shuffle, b.micInput, backgroundOn);
				}
				break;
			case 'uitoggle':
				var ui = document.getElementById("touchSurface");
				if (ui.style.display == "none") ui.style.display = "block";
				else ui.style.display = "none";
				break;
		}
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
				var group = self.imageGroup1 + self.imageGroup2;
				if (e.dir == "up") group++
				else if (e.dir == "down") group--;
				if (group < 0 || group >= groups.length) return;
				self.imageGroup1 = group % 10;
				self.imageGroup2 = Math.floor(group / 10);
			}
			self.refreshXML(b);
		}
		else if(e.type=="tap"){
			//console.log(e.code);
			this.onCommand(commands[e.code]);
		}
		else if(e.type=="hold"){
			//console.log(e.code);
			this.onCommand(commands[e.code]);
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
			self.imageGroup1 = (keyCode - 48) * 10;
			self.imageGroup2 = 0;
			self.refreshXML();
		}
		else
		{
			// -- commands
			if (Object.keys(commands).indexOf(keyCode.toString()) >= 0)
				this.onCommand(commands[keyCode]);
			else
			{
				var char = String.fromCharCode(keyCode);

				// -- qwertyuiop
				if (Object.keys(groupKeys).indexOf(char) >= 0)
				{
					self.imageGroup2 = groupKeys[char];
					self.refreshXML();
				}
				// -- asdfg
				else if (Object.keys(behaviorKeys).indexOf(char) >= 0)
				{
					var index = behaviorKeys[char];
					self.refreshXML(index);
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
		xhr.open("get", xmlURL, false);
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
			bgimage = avvx.mediapath + bgimage; // 2014-04-14
			var img = document.getElementById("backimg");
			img.src = bgimage;
			img.style.display = "block";
			backgroundOn = true;
		}

		// -- groups and images (they are small, so load them all)
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
					if (sketchesLoaded) self.refreshXML(defaultBehavior);
				}
			});
		}

		// -- processing sketches
		var xmlsketches = xml.evaluate('/media/sketches', xml, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

		hasSketches = xmlsketches.singleNodeValue != null;
		if (!hasSketches)
		{
			sketchesLoaded = true;
			behaviorKeys['G'] = undefined;
		}
		else

		self.sketchLoader = new SketchLoader(xmlsketches.singleNodeValue, function (s)
		{
			sketches = s;
			sketchesLoaded = true;
			if (groupstoload <= 0)
			{
				var defaultBehavior = 3;
				self.refreshXML(defaultBehavior);
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
		document.addEventListener("keydown", onKey.bind(self));
	};

	// 2014-04-14
	avvx = this;
	var author = window.location.hash;
	if (author)
	{
		author = author.substring(1);
		avvx.mediapath = "../library/" + author + "/";
	}
	else avvx.mediapath = "./";
	var xmlURL = avvx.mediapath + "media.xml";

	init();
	return this;
}

function avvxinit()
{
	new AVVX();
}


