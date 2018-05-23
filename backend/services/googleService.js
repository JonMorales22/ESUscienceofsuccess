const fs = require('fs');
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();

export class googleSpeechService {
	constructor(){}

	analyzeSpeech(filename) {
        console.log('in googleapi -> analyze speech');
        //google stuff
        //const filename = 'outputMono.wav';
        const encoding = 'LINEAR16';
        const sampleRateHertz = 48000;
        const languageCode = 'en-US';

        const config = {
          encoding: encoding,
          sampleRateHertz: sampleRateHertz,
          languageCode: languageCode,
          enableWordTimeOffsets: true
        };
        const audio = {
          content: fs.readFileSync(filename).toString('base64'),
        };

        const request = {
          config: config,
          audio: audio,
        };

        // Detects speech in the audio file
        client
          .recognize(request)
		  .then(data => {
		    const response = data[0];
        const transcription = response.results
          .map(result => result.alternatives[0].transcript)
          .join('\n');
        console.log(`Transcription: `, transcription);
		  })
		    .catch(err => {
		        console.error('ERROR:', err);
		    });  
		}
}

export let googlespeech = new googleSpeechService();