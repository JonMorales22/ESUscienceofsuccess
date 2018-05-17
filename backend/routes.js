//server/routes.js
import bodyParser from 'body-parser';
import Test from './models/test';
import Subject from './models/subject';
import Response from './models/response';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  res.render('index')
});


/**************** TEST ROUTES API ************************/

//gets ALL tests from db
router.get('/tests', (req, res) => {
  Test.find((error, tests) => {
    if (error) return res.json({ success: false, error: error });
    return res.json({ success: true, tests: tests });
  });
});

//gets ONE test from db
router.get('/tests/:testId', (req, res) => {
  const { testId } =req.params;
  if(!testId) {
    return res.json({ success: false, error: 'No test id provided!'});
  }
  Test.find({ _id: testId}, (error, test) => {
    if(error) return res.json({ success: false, error });
    return res.json({ success: true, test})
  });
}) 

//adds a new test to the database
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
  test.save(error => {
    if (error) return res.json({ success: false, error: error });
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
  Subject.find((error, subjects) => {
    if (error) return res.json({ success: false, error: error });
    return res.json({ success: true, subjects: subjects });
  });
});

router.post('/subjects', (req, res) => {
	const subject = new Subject();
	const { age, gender, year, ethnicity } = req.body;
	if(!age) {
	    return res.json({
	      success: false,
	      error: 'You must provide an age!'
	    });
	}
  else if (!gender) {
      return res.json({
        success: false,
        error: 'You must provide a gender!'
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
  subject.gender = gender;
  subject.year = year;
  subject.ethnicity = ethnicity;
  subject.save(error => {
    if(error) return res.json({ success: false, error: error});
    return res.json({ success: true });
  });
});
/************************************************************/

//subjectId: 5aed16a156530645e150e51f
//testId: 5aecf96f5e5eea3e81980f70
/**************** RESPONSE ROUTES API ************************/

router.get('/responses', (req, res) => {
  Response.find((error, responses) => {
    if(error) return res.json({ success: false, error: error });
    return res.json({ success: true, responses: responses });
  });
});

router.post('/responses', (req, res) => {
  const response  = new Response();
  const { subjectId, testId, trialIndex, questionIndex, data } = req.body;
  if(!subjectId) {
      return res.json({
        success: false,
        error: 'Need a subjectId!'
      });
  }
  else if (!testId) {
      return res.json({
        success: false,
        error: 'Need a testId!'
      });
  }
  else if (!trialIndex) {
      return res.json({
        success: false,
        error: 'Must provide a test index!!'
      });
  }
  else if (!questionIndex) {
      return res.json({
        success: false,
        error: 'Must provide a question index!'
      });
  }
  else if (!data) {
      return res.json({
        success: false,
        error: 'Must provide data!'
      });
  }
  response.subjectId = subjectId;
  response.testId = testId;
  response.trialIndex = trialIndex;
  response.questionIndex = questionIndex;
  response.data = data;
  response.save(error => {
    if(error) return res.json({ success: false, error: error});
    return res.json({ success: true });
  });
});

router.post('/audioresponse', (req, res) => {
  const response = new Response();
  const audiofile = req.body;
  if(!audiofile) {
      return res.json({
        success: false,
        error: 'no audiofile detected!'
      });
  }
  response.blob = audiofile;
  console.log(audiofile);
  response.save(error => {
    if(error) return res.json({ success: false, error: error});
    return res.json({ success: true });
  });
});

/*************************************************************/

export default router;