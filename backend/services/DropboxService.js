require('isomorphic-fetch');
var Dropbox = require('dropbox').Dropbox;
var dbx = new Dropbox({ accessToken: 'tk0SIp3rdvAAAAAAAAAAGD_969WY93_KCvoVQdKx3e-rKpxUTX_gOrwK4MGE28H2'});
var fs = require('fs');

//link to dropboxAPI: http://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesPropertiesAdd__anchor

export class DropboxService {

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

	createFolder(path) {
		console.log('in dropboxservice -> create folder')
		var params = {
			path: path,
			autorename: false,
		}
		return new Promise(function(resolve, reject) {
			dbx.filesCreateFolderV2(params)
			.then(response => {
				var message = 'Folder created at: reseachly' + path;
				resolve(message);
			})
			.catch(error => {
				reject(error)
			})
		})

		// .then(response => {
		// 	return );
		// })
		// .catch(error => {
		// 	throw(error);
		// })
	}
}

export let dropboxService = new DropboxService();