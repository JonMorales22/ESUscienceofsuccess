import {dropboxtest} from './dropboxService.js'; 
import {googlespeech} from './googleService.js';
import {audioconverter} from './audio-converter.js';

export class HandleAudioService {
	
	handleAudio(audio, filename) {
		var test = audioconverter.saveAudio(audio, filename);
		test
		.then((result) => {
			console.log(result);
			return;
		})
		.then(result=> {
			audioconverter.convertAudio(filename)
			.then(newFileName => {
				googlespeech.analyzeSpeech(newFileName)
				.then(data => {
					console.log("Audio successfully transcribed!");
					console.log(data)
					return;
				})
				return;
			})
			return;
		})
		.then()
		.catch(error => {
			console.log(error);
		})

	}


}

export let handleAudioService = new HandleAudioService();