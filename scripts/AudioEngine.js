var AudioEngine = function ()
{
	var buffersize = 2048;
	var micStream, micNode;
	var audioContext, analyserNode, scriptNode;
	var audioElement, elementNode;
	var active = false;
	var activeMic = false;

	this.init = function (soundfile)
	{
		audioContext = new (AudioContext||webkitAudioContext)();
		analyserNode = audioContext.createAnalyser();
		scriptNode = audioContext.createScriptProcessor(buffersize, 1, 1);
		scriptNode.onaudioprocess = onProcess;
		audioElement = document.querySelector("audio");
		analyserNode.fftSize = buffersize;
		analyserNode.maxDecibels = 0;
		if (soundfile)
		{
			audioElement.src = avvx.mediapath + "sounds/" + soundfile; // 2014-04-14
			elementNode = audioContext.createMediaElementSource(audioElement);
			elementNode.connect(analyserNode);
			analyserNode.connect(scriptNode);
			scriptNode.connect(audioContext.destination);
			elementNode.connect(audioContext.destination);
		}
	}

	this.play = function (doit)
	{
		active = doit;
		if (doit) audioElement.play();
		else audioElement.pause();
	}

	this.activate = function (source, onoff)
	{
		activeMic = onoff;
		if (source == "mic")
		{
			if (onoff)
			{
				navigator.webkitGetUserMedia({ audio: true },
				function (stream)
				{
					micStream = stream;
					micNode = audioContext.createMediaStreamSource(stream);
					analyserNodeMic = audioContext.createAnalyser();
					analyserNodeMic.fftSize = buffersize;
					analyserNodeMic.maxDecibels = 0;
					scriptNodeMic = audioContext.createScriptProcessor(buffersize, 1, 1);
					scriptNodeMic.onaudioprocess = onProcessMic;

					analyserNodeMic.connect(scriptNodeMic);
					scriptNodeMic.connect(audioContext.destination);
					micNode.connect(audioContext.destination);
					micNode.connect(analyserNodeMic);
				},
				function (err) { console.log("getUserMedia errorCode: " + err.code); });
			}
			else if (micStream)
			{
				micNode.disconnect();
				micStream.stop();
				micStream = null;
			}
		}
	}

	function onProcess()
	{
		if (!active) return;
		var spectrum = new Uint8Array(analyserNode.frequencyBinCount);
		analyserNode.getByteFrequencyData(spectrum);

		var integral = 0;
		var length = spectrum.length;
		for (var i = 0; i < length; i++)
			integral += spectrum[i];
		var average = integral / length;
		avvx.onAudio(average * 0.01);
	}
	function onProcessMic()
	{
		if (!activeMic) return;
		var spectrum = new Uint8Array(analyserNodeMic.frequencyBinCount);
		analyserNodeMic.getByteFrequencyData(spectrum);

		var integral = 0;
		var length = spectrum.length;
		for (var i = 0; i < length; i++)
			integral += spectrum[i];
		var average = integral / length;
		avvx.onAudio(average * 0.01);
	}
};
