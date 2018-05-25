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


//DEBUGGING ONLY
router.put('/updateSubjects', (req,res) => {
  console.log('router get /updateSubjects')
  const { oldTestId, newTestId } = req.body;

  if(!oldTestId || !newTestId) {
    res.status(400);
    res.json({success: false, error: 'Missing 1 or both of the following: oldTestId, newTestId'})
  }

  updateSubjects(oldTestId, newTestId)
  .then(resolve => {
    return res.json({ success: true })
  })
  .catch(error => {
    res.status(500);
    return res.json({ success: false, error: error });
  })
})


router.get('/', function(req, res){
  res.render('index')
});

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

  response.save((error, data) => {
    if(error) { 
      res.status(502);
      return res.json({ success: false, error: error});
    }
    else {
      var filename = 'trial'+ (trialsIndex+1) + '-question' + (questionsIndex+1);
      let testName = 'exampleTest'; //<----REMOVE LATER
      handleAudio(audio, filename, testName , subjectId, data._id);
      return res.json({ success: true });
    }
  });
});

function handleAudio(audio, filename, testName, subjectId, responseId, ) {

  handleAudioService.handleAudio(audio, filename)
  .then(convertedAudioFile => {
    console.log("returned to routes => handleAudio");
    console.log(convertedAudioFile);
    
    var ass = convertedAudioFile.substring(convertedAudioFile.indexOf('/')+1);
    //console.log(convertedAudioFile);
    var path = '/'+ testName + '/' + subjectId + '/' + ass;
    var promise1 = handleAudioService.sendAudioToExternalService(convertedAudioFile);
    var promise2 = dropboxService.saveAudio(convertedAudioFile, path);

    Promise.all([promise1, promise2]).then(responses => {

      Response.updateOne({ _id: responseId }, {data: responses[0]}, (error, res) => {
        if(error)
          throw error
        else 
          console.log(res);
      })

      console.log(responses[0]);
      console.log(responses[1]);
    })
  })
  .catch(error => {
    console.log(error);
  })
}


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

  /*
    I am sorry for creating this monstronsity... I was forced to do it because I couldn't figure out how to get the mongoose prehooks/middleware to work.
    I attempted to maintiain some ACID between my DB and the dropbox folder with this remove statement (ie: trying to make sure that if one of the operations fail, then all of them fail)
    However I don't think ACID is be possible without using the Mongoose middleware... RIP me
  
    I'm going to attempt to comment this and explain whats going on just in case some poor soul inherits this catastrophe.

    The following steps occur:
      1. Attempt to delete test from database
      2. if test deleted, then remove folder from dropbox
      3. if folder successfully deleted from dropbpox, then delete all subjects from database,
         if folder not succesfully deleted, go to step 5.
      4. if subjects deleted from database, then delete all responses
      5. if step 2 fails, then attempt to resave test into database 
          -->REMEMBER TEST IS ALREADY DELETED FROM DATABASE!!! THIS CASUSES A LOT OF HEADACHES!
          So when we resave test, the test has a new _id. 
          Since responses and subjects reference the testId, we must go through and update the testId for all responses and subjects!!!
      6. if test could not be resaved to database, APP WILL IMPLODE AND THERE IS NO SAVING IT (thats hyperbole, but its still pretty FUCKING bad if it reaches that point)
      7. update all subjects with the NEW TEST ID
      8. update all responses with the NEW TEST ID
      9. I haven't gotten to this error, so I'm not sure what would happen.... :)
  */
  //1
  Test.remove({ _id: testId}, error => { 
    if(error) {
      console.log('could not remove test')
      res.status(502);
      return res.json({ sucess: false, error: error });
    }
    else {
      var path = '/' + testName;
      dropboxService.deleteFolder(path)
      //2: remove folder from dropbox
      .then(response => {
        console.log('successfully deleted directory at following path: ' + path);
        console.log('Attempting to delete subjects...')
        return;
      })
      //3: attempt to delete subjects that reference the deleted test from DB
      .then(response => {
        deleteSubjects(testId);
        console.log('successfully deleted subjects!');
        console.log('Attempting to delete responses...')
        return;
      })
      //4: attemp to delete responses that reference deleted test from DB
      .then(response => {
        deleteResponses(testId);
        console.log('successfully deleted responses!');
        return res.json({ success: true });
      })
      //5: if for some reason couldn't remove folder from dropbox, attempt to rever changes
      .catch(error => {
        console.log('Error! Undoing test delete from database!!');
        const test = new Test();
        test.name = testName;
        test.trials = trials;
        test.questions = questions;
        test.save((error, test) => {
          if(error) {
            //6: if app reaches this state... then only god can help you now.
            console.log('test save error!');
            res.status(502)
            return res.json({ success:false, error: 'Test deletion could not be undone from database!!! HUGE ERROR APP WILL IMPLODE!' });
          }
          else {
            console.log('Test successfully undeleted!')
            console.log('Now attempting to update all subjects...');
            //7: test resaved to database! now update subjects with new test id
            updateSubjects(testId, test._id)
            .then(resolve => {
              console.log("Subjects successfully updated!");
              console.log('Now attempting to update all responses...');
              return;
            })
            //8: update all responses with new test id
            .then(resolve => {
              updateResponses(testId, test._id)
              console.log('Successfully updated responses!')
              return;
            })
            //9: ?????????
            .catch(error => {
              console.log(error);
              res.status(502);
              return res.json({ success: false, error: 'Directory not deleted from Dropbox! Undoing test delete from database!!' });
            }) 
          }//else
          res.status(502);
          return res.json({ success: false, error: 'Directory not deleted from Dropbox! Undoing test delete from database!! To fix this error: create a folder in dropbox that has the same name as the test you are trying to delete!' });
        });
      })//1st catch
    }
  });//test.delete
})

function updateSubjects(oldTestId, newTestId) {
  console.log("in updateSubjects function!");
  return new Promise(function(resolve, reject) {
    var query = {testId: oldTestId}
    Subject.updateMany(query, {testId: newTestId}, error => {
      if(error){
        console.log('error:' + error);
        throw (error);
      }
      else 
        resolve('Successfully updated all subjects!');
    });
  })
}

function updateResponses(oldTestId, newTestId) {
  return new Promise(function(resolve, reject) {
    var query = {testId: oldTestId}
    Response.updateMany(query, {testId: newTestId}, error => {
      if(error){
        console.log('error:' + error);
        throw (error);
      }
      else 
        resolve('Successfully updated all Responses!');
    });
  })
}

function deleteSubjects(testId) {
  return new Promise(function(resolve, reject) {
    Subject.remove( { testId: testId}, (error) => {
      if(error) {
        console.log(error);
        throw error;
      }
      else {
        resolve('Deleted all subjects corresponding to following test:' + testId);
      }
    })
  })
}

function deleteResponses(testId) {
  return new Promise(function(resolve, reject) {
    Response.remove( { testId: testId}, (error) => {
      if(error) {
        console.log(error);
        throw error;
      }
      else {
        resolve('Deleted all responses corresponding to following test:' + testId);
      }
    })
  })
}



/************************************************************/

/**************** SUBJECT ROUTES API ************************/
//get all subjects info
router.get('/subjects', (req, res) => {
  Subject.find((error, subjects) => {
    if (error) return res.json({ success: false, error: error });
    return res.json({ success: true, subjects: subjects });
  });
});

//save a subject to database
router.post('/subjects', (req, res) => {
  const subject = new Subject();
  const { testId, testName } = req.body;
  if (!testId || !testName) {
      res.status(400);
      return res.json({ success: false, error: 'Error! Both Test Id and Test Name are required!' })
  }

  subject.testId = testId;
  subject.save((error, subject) => {
    if(error){
      res.status(502);
      return res.json({ success: false, error: error})
    }
    else {
      console.log('New subject added to databse!');
      var path = '/' + testName + '/' + subject._id;
      dropboxService.createFolder(path)
      .then(() => {
        //if successfully saved directory in dropbox, returns true and everything is kosher 
        console.log("Successfully directory in dropbox at following path: " + path);
        return res.json({ success: true });
      })
      .catch(error => {
        console.log("Error creating folder in dropbox! Deleting subject in database Please try again.");
        /*if directroy couldn't be created in dropbox, attempts to delete newly created test from database.
        we only get to this statement if the test was successfully created in the database.
        However, if we create the test in the database but couldn't create a corresponding folder in dropbox... 
        ERRORS WILL OCCUR AND APP WILL IMPLODE!!!
       
        So we have to ensure that if for some reason there was an error creating directory in dropbox, that we delete the test from the database!
        */        
        Subject.remove({ _id: subject._id }, (error) => {
          //if for some reason the app couldn't delete the test from database, notify user and HOPEFULLY THEY WILL TAKE CARE OF IT.... (I realize that this is really bad and the user probably won't delete the test, but I have no other options :'(... )
          if(error){
            res.status(502);
            return res.json({ success: false, error: "Warning! Subject was saved to database, but the app could not create corresponding folder in Dropbox! This can lead to errors and the app will implode! Please delete the subject directory in dropbox manually!" });
          } 
        });
      })//catch
    }
  });
});

//subject to database
//commented out for now
// router.put('/subjects', (req, res) => {
// 	const subject = new Subject();
// 	const { age, gender, year, religion, ethnicity, testId, testName } = req.body;
// 	if(!age || !gender || !year || !ethnicity || !religion) {
// 	    res.status(400)
//       return res.json({ success: false, error: 'One or more of the following data are missing: age, gender, year of education, ethnicity, religiosity.' });
// 	}
//   else if (!testId || !testName) {
//       res.status(400);
//       return res.json({ success: false, error: 'Error! Both Test Id and Test Name are required!' })
//   }

//   subject.age = age;
//   subject.gender = gender;
//   subject.year = year;
//   subject.ethnicity = ethnicity;
//   subject.testId = testId;
//   subject.religion = religion;
      
    //this should probaby be something other than subject.save, probably subject.put or something
//   subject.save((error, subject) => {
//     if(error){
//       res.status(502);
//       return res.json({ success: false, error: error})
//     }
//     else {
//       return res.json({ success: true, subjectId: subject._id });
//     }

//   });
// });
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
  const { subjectId, testId, trialsIndex, questionsIndex, data } = req.body;
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
  else if (!trialsIndex) {
      return res.json({
        success: false,
        error: 'Must provide a trial index!!'
      });
  }
  else if (!questionsIndex) {
      return res.json({
        success: false,
        error: 'Must provide a question index!'
      });
  }
  // else if (!data) {
  //     return res.json({
  //       success: false,
  //       error: 'Must provide data!'
  //     });
  // }
  response.subjectId = subjectId;
  response.testId = testId;
  response.trialsIndex = trialsIndex;
  response.questionsIndex = questionsIndex;
  //response.data = data;
  response.save(error => {
    if(error) return res.json({ success: false, error: error});
    return res.json({ success: true });
  });
});

//USING THIS FOR TESTING


/*************************************************************/

export default router;