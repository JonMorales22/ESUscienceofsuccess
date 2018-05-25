const fs = require('fs');
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();

const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 48000,
      languageCode: 'en-US',
      enableWordTimeOffsets: true
    };

export class googleSpeechService {
	constructor(){}

  // readFile(fileName) {
  //   console.log("in gooleSpeechService => readFile");
  //   return new Promise((resolve, reject) => {

  //   })
  // }

	analyzeSpeech(filename) {
        console.log('in googleapi -> analyze speech');
        //google stuff
        
        const audio = {
          content: fs.readFileSync(filename).toString('base64'),
        };

        const request = {
          config: config,
          audio: audio,
        };

        return new Promise((resolve, reject) => {

        })
        client
          .recognize(request)
		  .then(data => {
		    const response = data[0];
        
        let seconds = response.results[0].alternatives[0].words[0].startTime.seconds;
        let nanos = response.results[0].alternatives[0].words[0].startTime.nanos / 100000000;
        let start = seconds + '.' + nanos;

        //console.log('Start Time in seconds: ' + start);


        const transcription = response.results
          .map(result => result.alternatives[0].transcript)
          .join('\n');
        //console.log(`Transcription: `, transcription);

        // var data1 = { transcript: transcription, start: start }

        // return (data1);
		  })
		    .catch(err => {
		        console.error('ERROR:', err);
		    });  
		}

    extractData() {

    }
}

export let googlespeech = new googleSpeechService();