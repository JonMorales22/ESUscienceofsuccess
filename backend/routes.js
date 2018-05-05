//server/routes.js
import bodyParser from 'body-parser';
import Test from './models/test'
import Subject from './models/subject'

var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  res.render('index')
});


/**************** TEST ROUTES API ***********************/
router.get('/tests', (req, res) => {
  Test.find((err, tests) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, tests: tests });
  });
});

router.post('/tests', (req, res) => {
  const test = new Test();
  // body parser lets us use the req.body
  const { name, trials, questions } = req.body;
  if (!name) {
    // we should throw an error. we can do this check on the front end
    return res.json({
      success: false,
      error: 'You must provide a Test name!'
    });
  }
  else if (!trials) {
    // we should throw an error. we can do this check on the front end
    return res.json({
      success: false,
      error: 'You must provide an array of trials!'
    });
  }
  else if (!questions) {
    // we should throw an error. we can do this check on the front end
    return res.json({
      success: false,
      error: 'You must provide an array of questions!'
    });
  }
  test.name = name;
  test.trials = trials;
  test.questions = questions;
  test.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// When a researcher deletes a test, api has to ensure that all corresponding 
// Subjects and Responses gets deleted as well!!!!!
router.delete('/tests/:testId', (req, res) => {
  const { testId } = req.params;
  if(!testId) {
    return res.json({ success: false, error: 'No test id provided!'});
  }
  Test.remove({ _id: testId}, (error, test) => {
    if(error) return res.json({ sucess: false, error });
    return res.json({ success: true });
  });
})
/************************************************************/

/**************** SUBJECT ROUTES API ************************/
router.get('/subjects', (req, res) => {
  Subject.find((err, subjects) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, subjects: subjects });
  });
});

router.post('/subjects', (req, res) => {
	const subject = new Subject();
	const { age, year, ethnicity } = req.body;
	if(!age) {
	    return res.json({
	      success: false,
	      error: 'You must provide an age!'
	    });
	}
	else if (!year) {
	    return res.json({
	      success: false,
	      error: 'You must provide a year!'
	    });
	}
	else if (!ethnicity) {
	    return res.json({
	      success: false,
	      error: 'You must provide an ethnicity!'
	    });
	}
  subject.age = age;
  subject.year = year;
  subject.ethnicity = ethnicity;
  subject.save(err => {
    if(err) return res.json({ success: false, error: err});
    return res.json({ success: true });
  });
});
/************************************************************/


export default router;