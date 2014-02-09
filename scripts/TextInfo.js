var TextInfo = function (title)
{
	this.title = title;
	this.info = document.getElementById("textInfo");
	this.info.children[0].innerHTML = this.title;
	var self = this;

	this.init = function (group, shuffle, mic, title)
	{
		if (!title) title = self.title;
		var groupString;
		if(group<10) groupString = "0"+group; else groupString=group;
		self.info.children[0].innerHTML = title + " " + groupString;
		self.info.children[1].innerHTML = "shuffle: " + shuffle;
		self.info.children[2].innerHTML = "mic: ";
		self.info.children[3].innerHTML = "back:";
		self.info.children[4].innerHTML = "";
		self.info.children[5].innerHTML = "";
		self.info.children[6].innerHTML = "";
		self.info.children[7].innerHTML = "";
		self.info.children[8].innerHTML = "";
	};

	this.setCredits = function (visualCredits, soundCredits)
	{
		self.visualCredits = visualCredits;
		self.soundCredits = soundCredits;
		if (visualCredits) self.info.children[0].innerHTML += "<br/>" + "by:" + visualCredits;
		if (soundCredits) self.info.children[2].innerHTML += "<br/>" + "by:"+ soundCredits;
	};

	this.changeTextA = function (shuffle, mic,background)
	{
		self.info.children[1].innerHTML = "shuffle: " + shuffle;
		self.info.children[2].innerHTML = "mic: " + mic;
		self.info.children[3].innerHTML = "back:"+background;
		if (self.soundCredits) self.info.children[2].innerHTML += "<br/>" + "by:" + self.soundCredits;
	};

	this.changeTextB = function (params)
	{
		for (var i = 0; i < params.length; i++)
			self.info.children[i+4].innerHTML=params[i];
	};

	this.changeTextC = function (params)
	{
		for (var i = 0; i < params.length; i++)
			self.info.children[i+4].innerHTML=params[i];
	};

};
