import {dropboxtest} from './dropboxService.js'; 
import {googlespeech} from './googleService.js';
import {audioconverter} from './audio-converter.js';

export class HandleAudioService {
	
	handleAudio(base64audio) {
		var test = audioconverter.saveAudio(base64audio);
		test
		.then((result) => {
			console.log(result);
			return;
		})
		.catch(error => {
			console.log(error);
		})

	}


}

export let handleAudioService = new HandleAudioService();