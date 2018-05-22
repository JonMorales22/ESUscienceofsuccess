const fs = require('fs');
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();

export class googleSpeechService {
	constructor(){}

	analyzeSpeech(filename) {
        console.log('in google speecha pi')
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
		    response.results.forEach(result => {
		      console.log(`Transcription: ${result.alternatives[0].transcript}`);
		      
		      //google responds with an object that contains a lot of bs, I'm just pulling out what I need.
		      //the object actually contains time stamps for ALL the words in the transcription, but I only need the time stamp
		      //for the 1st word which is equal to the latency
		      let seconds = result.alternatives[0].words[0].startTime.seconds;
		      let nanos = result.alternatives[0].words[0].startTime.nanos / 100000000;
		      console.log('Start Time in seconds: ' + seconds + '.' + nanos);

		      });
		  })
		    .catch(err => {
		        console.error('ERROR:', err);
		    });  
		}
}

export let googlespeech = new googleSpeechService();