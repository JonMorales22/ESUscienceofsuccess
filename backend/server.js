// server.js
require('dotenv').load();
// first we import our dependencies…
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import Test from './models/test'
import router from './routes'
import passport from './passport-config';
//import session from './express-session';
// and create our instances
const app = express();
const session = require('express-session');
//const router = express.Router();

// set our port to either a predetermined port number if you have set it up, or 3001
const API_PORT = process.env.API_PORT || 3001;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

//connect to mongoDB
const db = {
  dbName: 'esu-science-of-success'
}

console.log(DB_USER);
console.log(DB_PASSWORD);


// mongoose.connect('mongodb://localhost:27017/', {dbName: 'researchly-test'} ,(error) => {
// 	if(error) {
// 		console.error("Couldn't connect to MongoDB!!")
// 		throw error;
// 	}
// 	console.log("Connected to mongodb://localhost:27017/" + db.dbName);
// })
// .catch(error => {
// 	console.log('error: ' + error);
// })

mongoose.connect('mongodb://' + DB_USER + ':' + DB_PASSWORD + '@ds135540.mlab.com:35540/esu-science-of-success', {dbName: 'esu-science-of-success'} ,(error) => {
	if(error) {
		console.error("Couldn't connect to MongoDB!!")
		throw error;
	}
	console.log("Connected datbase at mlab: " + db.dbName);
})


// now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(session({secret: 'poop', cookie: {maxAge: 60000 }}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));


// Use our router configuration when we call /api
app.use('/api', router);

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));