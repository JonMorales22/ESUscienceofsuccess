import {googlespeech} from '../googleAPI/googleAPI.js';

var shell = require('shelljs');
var atob = require('atob');
var fs = require('fs');

//var reader = new FileReader();

export class audioConverter {
	constructor() {}

	//this surprisngly works synchronously... pretty I'm gonna have to make sure this works asynchronously later
	//I see this as a source of blocking
	saveAudio(base64Audio) {
		//blocking may occur here in this function call... idk how quickly the base64 webmfile can be converted to binary data
		var audio = this.convertDataURIToBinary(base64Audio); 
		var filename = './audio/audio.webm'
		fs.writeFile(filename, audio, (err,res) => {
			if(err) throw err;
			else this.checkFiles('output.wav', 'outputMono.wav', this.convertAudio(filename));
		})	
	}

	convertAudio(filename) {
		shell.exec('./services/ffmpegAPI/./ffmpeg -i ./audio/audio.webm -vn output.wav -loglevel quiet', function(err) {
			//console.log('in 1st convert');
			if(err) throw err;
      		shell.exec('./services/ffmpegAPI/./ffmpeg -i output.wav -ac 1 outputMono.wav -loglevel quiet', function(err) {
      			//console.log('in 2nd convert');
      			if(err) throw err;
      			googlespeech.analyzeSpeech('outputMono.wav');
      		});
      	});
	}

	checkFiles(file1, file2, callback) {
		//console.log('in checkfiles');
		if(shell.test('-e', file1)) 
		    shell.rm(file1);
		if (shell.test('-e', file2))
		    shell.rm(file2);
		return callback;
	}

	convertDataURIToBinary(dataURI) {
	  var BASE64_MARKER = ';base64,';	 	
	  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
	  var base64 = dataURI.substring(base64Index);
	  var raw = atob(base64);
	  var rawLength = raw.length;
	  var array = new Uint8Array(new ArrayBuffer(rawLength));

	  for(var i = 0; i < rawLength; i++) {
	    array[i] = raw.charCodeAt(i);
	  }
	  return array;
	}
}

export let audioconverter = new audioConverter();