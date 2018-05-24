//server/routes.js
import bodyParser from 'body-parser';
import User from './models/user';
import Test from './models/test';
import Subject from './models/subject';
import Response from './models/response';
import passport from './passport-config';
import {handleAudioService} from './services/HandleAudioService.js';
import {dropboxService} from './services/DropboxService.js';
//dropbox.saveTest();

var fs = require('fs');
var express = require('express');
var router = express.Router();

//var dropboxService = require('/Users/jonathanmorales/documents/projects/MERN/researchly-ejected/backend/services/dropboxAPI');


//var dropbox = require('');

//var passport = require('passport');

router.get('/', function(req, res){
  res.render('index')
});

// function checkAuthentication(req, res, next) {
//   if(req.user) {
//     next();
//   }
//   else {
//     res.json({ success:false, error: 'user not authenticated!'});
//   }
// }

router.post('/audioresponse', (req, res) => {
  const { subjectId, testId, trialsIndex , questionsIndex, audio } = req.body;
  const response = new Response();

  console.log("subjectId:" + subjectId);
  console.log("testId:" + testId);
  console.log("trialsIndex:" + trialsIndex);
  console.log("questionsIndex:" + questionsIndex);

  //!trialsIndex returns true when trialsIndex = 0, same for questionsIndex... therefore I used this ugly syntax 
  if(!subjectId || !testId || !audio || trialsIndex === null || questionsIndex === null ) {
    res.status(400);
    return res.json({ success: false, error: 'Missing one or more of the following: subjectId, testId, trialIndex, questionIndex, audio.'})
  } 

  response.subjectId = subjectId;
  response.testId = testId;
  response.trialsIndex = trialsIndex;
  response.questionsIndex = questionsIndex;

  response.save(error => {
    if(error) { 
      res.status(502);
      return res.json({ success: false, error: error});
    }
    else {
      //audioconverter.saveAudio(audio);
      handleAudioService.handleAudio(audio);
      return res.json({ success: true });
    }
  });
});





function checkAuthentication(req, res, next) {
  const {username, password } = req.body;
  
  console.log("in checkauth");
  console.log("\tUsername:" + username);
  console.log("\tpassword:" + password);

  passport.authenticate('local', function(error, user, info) {
    if(error) { return res.json({ success: false, error: error}); }
    if(!user) { 
      return res.json({ success: false, error: "Incorrect username or password!"}); 
    }
    req.logIn(user, function(error) {
      if(error) { 
        console.log(error);
        return res.json({ success: false, error: error });
       }
       console.log("User:" + user);
       next();
    });
  })(req, res, next);
}

/**************** LOGIN ROUTES API ************************/
// router.post('/login', (req,res) => {
//   let user = User.findOne({});
//   let data = user.validatePassword("@esu2018");
//   return res.json({ success: true, data: data});
// })

//saves a new user in db
passport.initialize();
router.post('/register', (req,res) => {
  const user = new User();
  const {username, password} = req.body;
  if(!username || !password) return ({ success:false, error: 'Need to provide both username and password!' });
  user.username = username;
  user.savePassword(password);
  user.save(error => {
    if (error) return res.json({ success: false, error: error });
    return res.json({ success: true });
  });
})

// router.get('/checkauth', checkAuthentication,(req,res, next) => {
//   return res.json({ success: true });
// })

// router.post('/login', function(req, res) {

// });

router.post('/login', 
  passport.authenticate('local', {failureRedirect: 'login'}),
  function(req, res) {
    return res.json({success: true});
  });

router.get('/users', (req,res) => {
  User.find((error, users) => {
    if (error) return res.json({ success: false, error: error });
    return res.json({ success: true, users: users });
  });
})


/**********************************************************/

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
    if(error) 
      return res.json({ success: false, error });
    else{
      return res.json({ success: true, test})
    }
  });
}) 

//saves a new test to the database
router.post('/tests', (req, res, next) => {
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


  /*this unwieldy statement does the following:
    1. saves a test in the database
    2. creates a corresponding folder in Dropbox

    if an error occurs in the 2nd step, we have to ensure that the test is DELETED FROM THE DATABASE.
    if test is saved in database but a corresponding folder wasn't created in Dropbox...
    ERRORS WILL OCCUR AND APP WILL IMPLODE!!!
  */
  test.save((error) => {
    if (error) {
      console.log("Error: test name already exists in database! Rename test and try again.");
      return res.json({ success: false, error: 'Error: test name already exists in database! Rename test and try again.' });
    }
    else {
      console.log('Successfully saved test in database!');
      //if test is saved, attempt to create a directory in dropbox
      var path = '/' + name;
      dropboxService.createFolder(path)
      .then(() => {
        //if successfully saved directory in dropbox, returns true and everything is kosher 
        console.log("Successfully saved test in database and created corresponding folder in dropbox at following path:" + path);
        return res.json({ success: true });
      })
      .catch(error => {
        console.log("Error creating folder in dropbox! Deleting test in database Please try again.");
        /*if directroy couldn't be created in dropbox, attempts to delete newly created test from database.
        we only get to this statement if the test was successfully created in the database.
        However, if we create the test in the database but couldn't create a corresponding folder in dropbox... 
        ERRORS WILL OCCUR AND APP WILL IMPLODE!!!
       
        So we have to ensure that if for some reason there was an error creating directory in dropbox, that we delete the test from the database!
        */        
        Test.remove({ name: name }, (error) => {
          //if for some reason the app couldn't delete the test from database, notify user and HOPEFULLY THEY WILL TAKE CARE OF IT.... (I realize that this is really bad and the user probably won't delete the test, but I have no other options :'(... )
          if(error) return res.json({ success: false, error: "Warning! Test was saved to database, but the app could not create corresponding folder in Dropbox! This can lead to errors and the app will implode! Please delete the test you just created from manually from the dashboard and try again!"})
        });
      })//catch
    } //else
  });//test.save
});

// When a researcher deletes a test, api has to ensure that all corresponding 
// Subjects and Responses gets deleted as well!!!!!
router.delete('/tests/:testId', (req, res, next) => {
  const { testId } = req.params;
  const { testName, trials, questions } = req.body;

  console.log('testName: ' + testName)

  if(!testId) {
    res.status(400);
    return res.json({ success: false, error: 'No test id provided!'});
  }
  else if(! testName || !trials || !questions) {
    res.status(400);
    return res.json({ success: false, error: 'testName, trials, or questions missing from request!'});
  }

  //THIS IS GONNA GET WILD
  Test.remove({ _id: testId}, error => {
    if(error) {
      console.log('could not remove test')
      res.status(502);
      return res.json({ sucess: false, error: error });
    }
    else {
      var path = '/' + testName;
      dropboxService.deleteFolder(path)
      .then(response => {
        console.log('successfully deleted directory at following path: ' + path);
        return res.json({ success: true });
      })
      .catch(error => {
        console.log('Directory not deleted from Dropbox! Undoing test delete from database!!');
        
        const test = new Test();
        test.name = testName;
        test.trials = trials;
        test.questions = questions;

        test.save(error => {
          if(error) {
            console.log('test save error!');
            res.status(502)
            return res.json({ success:false, error: 'Test deletion could not be undone from database!!! HUGE ERROR APP WILL IMPLODE!' });
          }
        });
        //res.status(502);
        //return res.json({ success: false, error: 'Directory not deleted from Dropbox! Undoing test delete from database!!' });
      })
    }//else
  });//test.delete
})
/************************************************************/

/**************** SUBJECT ROUTES API ************************/
//get all subjects info
router.get('/subjects', (req, res) => {
  Subject.find((error, subjects) => {
    if (error) return res.json({ success: false, error: error });
    return res.json({ success: true, subjects: subjects });
  });
});

//saves subject to database
router.post('/subjects', (req, res) => {
	const subject = new Subject();
	const { age, gender, year, ethnicity, testId, testName } = req.body;
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
  else if (!testId) {
      res.status(400);
      return res.json({
        success: false,
        error: 'You must provide a testId!'  
      })
  }
  else if(!testName) {
      res.status(400);
      return res.json({
        success: false,
        error: 'Error occured. This error was not caused by you, it was caused by the app! Please return to the dashboard and try again'  
      })
  }
  subject.age = age;
  subject.gender = gender;
  subject.year = year;
  subject.ethnicity = ethnicity;
  subject.testId = testId;

  subject.save((error, subject) => {
    if(error){
      res.status(502);
      return res.json({ success: false, error: error})
    }
    else {
      // console.log('Successfully created subject in database!');
      // var directory = '/' + 
      // dropboxService.createFolder('/' + subject._id +'/')
      return res.json({ success: true, subjectId: subject._id });
    }

  });
});
/************************************************************/

//subjectId: 5aed16a156530645e150e51f
//testId: 5aecf96f5e5eea3e81980f70
/**************** RESPONSE ROUTES API ************************/

//get responses from DB
router.get('/responses', (req, res) => {
  Response.find((error, responses) => {
    if(error) return res.json({ success: false, error: error });
    return res.json({ success: true, responses: responses });
  });
});

//save response
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

//USING THIS FOR TESTING


/*************************************************************/

export default router;