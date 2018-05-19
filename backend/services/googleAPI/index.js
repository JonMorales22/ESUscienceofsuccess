// Imports the Google Cloud client library
const fs = require('fs');
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();

//allows the use of shelljs, which is an external NPM package that allows JS to call shell scripts
var shell = require('shelljs');

//first: program removes wav audio files if they already exist... if we dont do this, porgram implodes
//second: the webm audio is converted to a mono wav file
//lasty: mono wav file is sent to google for processing
checkFiles('output.wav','outputMono.wav', doProgram());


//checks to see if files exist, if they do then it removes them
//then it performs callback  
function checkFiles(file1, file2, callback) {
  if(shell.test('-e', file1)) 
     shell.rm(file1);
  if (shell.test('-e', file2))
    shell.rm(file2);
  callback;
}

//converts webmfile to mono wave, then sends to google for analysis
function doProgram() {
  shell.exec('./ffmpeg -i webmfile.webm -vn output.wav', function() {
      shell.exec('./ffmpeg -i output.wav -ac 1 outputMono.wav', function() {
        
        //google stuff
        const filename = 'outputMono.wav';
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
      }) //<--convert to stero wav to mono wav
    }); //<--convert webm to wav
}