require('isomorphic-fetch');
var Dropbox = require('dropbox').Dropbox;
var dbx = new Dropbox({ accessToken: 'tk0SIp3rdvAAAAAAAAAAGD_969WY93_KCvoVQdKx3e-rKpxUTX_gOrwK4MGE28H2'});
var fs = require('fs');

export class dropboxTest {

	saveAudio(filename,resp) {
		console.log('in dropboxservice -> save test');

		var audiofile = fs.readFile(filename, (error,data) => {
			if(error) {
				console.log('error:' + error);
				throw error;
			}
			var params = {
				contents: data,
				path: '/test2/trial1/subject1/test2.wav',
				mode:
					{
						'.tag': 'overwrite'
					},
				autorename: true,
				mute: true,
			}

			dbx.filesUpload(params)
			.then(response => {
				console.log('file uploaded!');
			})
			.catch(error => {
				console.log(error);
			})
		});

	}
}

export let dropboxtest = new dropboxTest();