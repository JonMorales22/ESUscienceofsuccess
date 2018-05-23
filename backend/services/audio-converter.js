//import {googlespeech} from '../googleAPI/googleAPI.js';
//import {dropboxtest} from '../dropboxAPI/dropboxService.js';

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
		var filename = './audio/audio.webm';
		
		return new Promise(function(resolve, reject) {
			fs.writeFile(filename, audio, (err,res) => {
				if(err) 
					reject(err);
				else {
					resolve('Audio successfully converted!')
				} 
				//this.checkFiles('audio/output.wav', 'audio/outputMono.wav', this.convertAudio(filename));
			})	
		})
	}

	convertAudio(filename) {
		var filename1 = 'filename'
		this.checkFiles()
		shell.exec('./services/ffmpegAPI/./ffmpeg -i ./audio/audio.webm -vn audio/output.wav -loglevel quiet', function(err) {
			//console.log('in 1st convert');
			if(err) throw err;
      		shell.exec('./services/ffmpegAPI/./ffmpeg -i output.wav -ac 1 audio/outputMono.wav -loglevel quiet', function(err) {
      			//console.log('in 2nd convert');
      			if(err) throw err;
      			return 'successfully converted audio.'
      			//dropboxtest.saveAudio('outputMono.wav');
      			//googlespeech.analyzeSpeech('outputMono.wav');
      		});
      	});
	}

	convertToWav() {

	}

	convertWavToMono() {

	}

	checkFiles(file1, file2, callback) {
		//console.log('in checkfiles');
		var flag;
		if(shell.test('-e', file1)) {
			flag = true;
		    shell.rm(file1);
		}

		if (shell.test('-e', file2)){
			flag = true;
		    shell.rm(file2);
		}
		// if(flag)
		// 	return 'One or both of the files already exists! Deleting existing file(s).';
		// else
		// 	return 'Neither file exists. Creating new files...';
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