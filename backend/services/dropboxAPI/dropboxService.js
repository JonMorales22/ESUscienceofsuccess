require('isomorphic-fetch');
var Dropbox = require('dropbox').Dropbox;
var dbx = new Dropbox({ accessToken: 'tk0SIp3rdvAAAAAAAAAAGD_969WY93_KCvoVQdKx3e-rKpxUTX_gOrwK4MGE28H2'});

export class dropboxTest {
	constructor() {

	}

	saveTest() {
		console.log('dropboxservice: save test');

		dbx.filesListFolder({path: ''})
		  .then(function(response) {
		    console.log(response);
		  })
		  .catch(function(error) {
		    console.log(error);
		  });
	}
}

export let dropboxtest = new dropboxTest();