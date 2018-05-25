import {dropboxtest} from './dropboxService.js'; 
import {googleSpeechService} from './googleSpeechService.js';
import {audioconverter} from './audio-converter.js';

export class HandleAudioService {

	handleAudio(audio, filename) {
		
		return new Promise((resolve, reject) => {
			audioconverter.saveAudio(audio, filename)
			.then(result => {
				console.log(result)
				return;
			})
			.then(result => {
				audioconverter.convertAudio(filename)
				.then(newFileName => {
					resolve(newFileName);
				})
			})
			.catch(error => {
				throw error;
			})
		})
	}
		// test
		// .then((result) => {
		// 	console.log(result);
		// 	return;
		// })
		// .then(result => {
		// 	audioconverter.convertAudio(filename)
		// 	.then(newFileName => {
		// 		googleSpeechService.analyzeSpeech(newFileName)
		// 		.then(data => {
		// 			console.log("Audio successfully transcribed!");
		// 			console.log(data)
		// 			return;
		// 		})
		// 		return;
		// 	})
		// 	return;
		// })
		// .catch(error => {
		// 	console.log(error);
		// 	throw error;
		// })

	sendAudioToExternalService(fileName) {
		return new Promise((resolve, reject) => {
			googleSpeechService.analyzeSpeech(fileName)
			.then(data => {
				resolve(data);
			})
			.catch(error => {
				reject(error);
			})
		})

	}


}

export let handleAudioService = new HandleAudioService();