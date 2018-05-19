// server.js

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

//connect to mongoDB
const db = {
  dbName: 'researchly-test'
}

mongoose.connect('mongodb://localhost:27017/', {dbName: 'researchly-test'} ,(error) => {
	if(error) {
		console.error("Couldn't connect to MongoDB!!")
		throw error;
	}
	console.log("Connected to mongodb://localhost:27017/" + db.dbName);
})


// now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({secret: 'poop'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));


/********************* ROUTES!!!!! ***************************/
// now we can set the route path & initialize the API
// router.get('/', (req, res) => {
//   res.json({ message: 'Hello, World!' });
// });

// router.get('/tests', (req, res) => {
//   Test.find((err, tests) => {
//     if (err) return res.json({ success: false, error: err });
//     return res.json({ success: true, data: tests });
//   });
// });

// router.post('/tests', (req, res) => {
//   const test = new Test();
//   // body parser lets us use the req.body
//   const { name, trials, questions } = req.body;
//   if (!name) {
//     // we should throw an error. we can do this check on the front end
//     return res.json({
//       success: false,
//       error: 'You must provide a Test name!'
//     });
//   }
//   else if (!trials) {
//     // we should throw an error. we can do this check on the front end
//     return res.json({
//       success: false,
//       error: 'You must provide an array of trials!'
//     });
//   }
//   else if (!questions) {
//     // we should throw an error. we can do this check on the front end
//     return res.json({
//       success: false,
//       error: 'You must provide an array of questions!'
//     });
//   }
//   test.name = name;
//   test.trials = trials;
//   test.questions = questions;
//   test.save(err => {
//     if (err) return res.json({ success: false, error: err });
//     return res.json({ success: true });
//   });
// });
/*************************************************************/

// Use our router configuration when we call /api
app.use('/api', router);

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));