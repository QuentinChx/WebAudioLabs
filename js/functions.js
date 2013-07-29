//(function() {
    var context, 
        soundSource, 
        soundBuffer,
        url = 'http://thelab.thingsinjars.com/web-audio-tutorial/hello.mp3';
		
		var volumeNode;

    // Step 1 - Initialise the Audio Context
    // There can be only one!
    function init() {
        if (typeof AudioContext !== "undefined") {
            context = new AudioContext();
        } else if (typeof webkitAudioContext !== "undefined") {
            context = new webkitAudioContext();
        } else {
            throw new Error('AudioContext not supported. :(');
        }
    }

    // Step 2: Load our Sound using XHR
    function startSound() {
        // Note: this loads asynchronously
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        // Our asynchronous callback
        request.onload = function() {
            var audioData = request.response;
            audioGraph(audioData);
        };

        request.send();
    }
	
    // Finally: tell the source when to start
    function playSound() {
        // play the source now
		
        soundSource.noteOn(context.currentTime);
		
    }

    function stopSound() {
        // stop the source now
		if(typeof soundSource == 'object')
			soundSource.noteOff(context.currentTime);
    }

	window.onload = function(){
		// Events for the play/stop bottons
		document.querySelector('.play').addEventListener('click', startSound);
		document.querySelector('.stop').addEventListener('click', stopSound);
		init();
	}
	

    // This is the code we are interested in
    function audioGraph(audioData) {
        // create a sound source
        soundSource = context.createBufferSource();

        // The Audio Context handles creating source buffers from raw binary
        soundBuffer = context.createBuffer(audioData, true/* make mono */);
		
        // Add the buffered data to our object
        soundSource.buffer = soundBuffer;
		
		volumeNode = context.createGainNode();
		volumeNode.gain.value = 1;
		
		
		panner = context.createPanner();
		panner.setPosition(-4, 2, 3);
		
		/*filterNode = context.createBiquadFilter();
		filterNode.type=1;
		filterNode.frequency.value=650;*/
		
        // Plug the cable from one thing to the other
		/*soundSource.connect(volumeNode);
		volumeNode.connect(panner);*/
		soundSource.connect(panner);
		panner.connect(volumeNode);
		//volumeNode.connect(filterNode);
        volumeNode.connect(context.destination);
		
		//context.listener.setPosition(30,-10,0);
        
        // Finally
        playSound(soundSource);
    }
    //init();
//}());