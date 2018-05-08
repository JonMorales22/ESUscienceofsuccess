import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import 'whatwg-fetch';
//import {Sidebar} from './Sidebar.js'

/*  
  TestCreator:
    component used by the Researcher to create a test. 
    Currently the data for the questions and trials are being held separately in two different
    keys (arrays?) in this object's state. Maybe I can figure out a way to keep them nested as one object? 
    idk, something about keeping the data separate seems risque to me.
  Props: 
    Trials - number of trials per test
    Questions - number of questions per trial
    possible a readonly state...?
 */

class TestCreator extends Component {
  constructor(props) {
    super(props)
    // these two arrays are used as 'placeholders' for our questions and trials states.
    // right now they are being filled with dummy info fo testing, but later they will be filled with empty strings
    //let trialsArr = this.initializeData(this.props.numberOfTrials, 'trial');
    //let questsArr = this.initializeData(this.props.numberOfQuestions*this.props.numberOfTrials, 'question')
    
    let questsArr = this.initializeData(20, 'question')
    let trialsArr = this.initializeData(5, 'trial');
    this.state = {
      name: '',
      numTrials: 5, //hardcoded at 5 for right now, later we'll figure out how to make this dynamic
      numQuest: 4,  //hardcoded at 4 for right now, later we'll figure out how to make this dynamic
      trials: trialsArr, //dummy placeholder our trials states, when the user fills in the trials questions the state will update
      questions: questsArr, //same idea as above, but this changes the questions state
      error: null,
      submit: false,
      viewOnly: false
    }

    //binding the events to the object
    this.changeTestName = this.changeTestName.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  /*
    initalizeData:  
      Method to create an array of empty strings for our trials and questions. (I call them placeholders)
      We place these arrays into our state and then update them later when the user gives us actual info
    Params:
      number(int) - the number of placeholders to create
      info(string) - the dummy info we want to fill our placeholders with. Later this will probably be removed b/c we'll just need empty strings
    Returns 
      arr - array of empty strings
  */
  initializeData(number, info) {
    let arr = [];
    for(let i=0;i<number;i++){
      arr.push(info + " " + (i+1))
    }
    return arr;
  }

  /*
    renderForms
      creates the forms needed to gather data about questions and trials from the researcher.
      Since questions are embeded in trials, we essentiall have a 2d array (dimensions are 5x4 in default case).
      Unfortunatly, the data doesn't allow for me to manipulate it easliy as a 2d array, 
      so the data is a 1d array but we're treating it as a 2d array.
      I use one loop to create the trials, then I embed another loop to create the questions.
      This seems extremely convoluted, there's probably a much better way to accomplish this. but whatevs, i'll fix later (famous last words)

    params: none
    returns:
      JSX needed to render our forms 
  */
  renderForms() {
    //array to hold our trials forms
    let trialsForms = [];
    let maxRows = this.state.numQuest;

    for(let x=0;x<this.state.numTrials;x++)
    {
      //array to hold our questions forms
      let questForms = [];
      for(let y=0;y<this.state.numQuest;y++) {
        
        //index used to map our 1d array to 2 dimensions
        let index = (x*maxRows)+y;
        questForms.push(
          <div className='question' key={index}>
            <h3>Question {y+1}</h3>
            {
             /* 
              * THIS WORKS JUST COMMENTING THIS OUT FOR DEBUGGIN PURPOSES
              *  <textarea name='question' rows='10' cols='50'  onChange={this.handleInputChange.bind(this, index)} key={y}></textarea>
              */
            }
              <textarea name='question' rows='10' cols='50' value={this.state.questions[index]} onChange={this.handleInputChange.bind(this, index)} key={index}></textarea>
          
          </div>
        )
      }

      trialsForms.push(
        <div className='trial' key={x}>
          <h3>Trial {x+1}</h3>
          <h4>Trial Info:</h4>
          
          {
          /*
           * THIS WORKS JUST COMMENTING THIS OUT FOR DEBUGGING FOR NOW 
           * <textarea name='trial' rows='10' cols='50'  onChange={this.handleInputChange.bind(this, x)} key={x}></textarea> 
          */
          }

          <textarea name='trial' rows='10' cols='50' value={this.state.trials[x]} onChange={this.handleInputChange.bind(this, x)} key={x}></textarea>
          <div className='questions-holder'>
            {questForms}
          </div>
          <hr />
        </div>
      )
    }

    return trialsForms;
  }

  /*
    renderSideBar
      creates our sidebar component, NOT REALLY GOING TO WORRY ABOUT HIS FOR RIGHT NOW!!!
  */
  // renderSideBar(numArr, numQuest) {
  //   return(<Sidebar numbers={numArr} numQuest={numQuest} />)
  // }

  changeTestName(event) {
    this.setState({name: event.target.value})
  }
  
  /*
    !!!!!!! NOTE: I might be manipulating state in a dangerous manner, may run into problems later !!!!
    handleInputChange
      this method is called everytime the Researcher inputs anything into a form on this page (aka whenvever an onChange event occurs).
      we have two types of forms on this page (for right now): trials forms and questions forms
      as the user inputs data into either form, we update the corresponding element (trial or question) in our state
    params:
      index - the corresponding trial or question in our state to update
      event - the event attached to the form that triggered this method 
    returns: nothing?
  */
  handleInputChange(index, event) {
    let type = event.target.name
    let text = event.target.value
    let stateCopy = Object.assign({}, this.state)

    if(type==='trial') {
      //manipulating state in this way might be bad, we'll find out later
      stateCopy.trials[index] = text;
      this.setState(stateCopy)
    }
    else if(type==='question') {
      //manipulating state in this way might be bad, we'll find out later
     stateCopy.questions[index] = text;
     this.setState(stateCopy)
    }
  }
  /*
    handleSubmit
      method that fires when the user submits the forms. This (hopefully) will send all out data to the backend.
    params - event
    returns: 
  */
  handleSubmit(event) {
    event.preventDefault();
    const { name, trials, questions } = this.state; 
    if(!name || !trials || !questions) {
      console.log("Must input a test name and fill out all trials and questions!")
      return;
    }
    fetch('/api/tests', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, trials, questions }) ,
    })
    // .then(res => res.json(){
    //   console.log(res);
    // })

    //test 1
    .then(res => res.json()).then((res) => {
      console.log(res);
      this.setState({submit: true})
    })


    //test 2
    // .then((res) => {
    //   if(!res.success) {
    //     console.log('error in if statement!')
    //     this.setState({ error: res.error.message || res.error });
    // }
    //   else {
    //     console.log('we made it?')
    //     let totalNumberOfQuestions = this.state.numberOfTrials * this.state.numberOfQuestions;
    //     let trialsArr = this.initializeData(this.state.numberOfTrials, 'trial');
    //     let questionsArr = this.initialzeData(totalNumberOfQuestions, 'questions');
    //     this.setState({ testName: "", trials: trialsArr, questions: questionsArr, error: null });
    //   }
    // }).catch((reason) => {
    //   console.log("Caught exception: " + reason);
    // });


    // let testData = this.state.trials
    // let questData = this.state.questions
    
    //WAS ABOUT TO PUT IN METHODS TO BALIDATE TRIALS AND QUESTIONS ARRAY, BUT MAYBE ITS BETTER TO VALIDAE IN OUR SCHEMA!!!
    console.log(name);
    console.log(trials);
    console.log(questions);
    

  }

  /*
    renders: 
      -forms to collect other data (such as test name, # of trials per test, # of questions per trial)
      -the forms for to get info for our trials and questions.
  */
  render() {
    if(this.state.submit === true) {
      return <Redirect to='/' />
    }
    else {
    let forms = this.renderForms();
    return (
      <div className="App">
          	Test Name:
            <input type='text' value={this.state.name}  onChange={this.changeTestName}/>
            {/* <input type='text' value={this.state.testName}  onChange={this.changeTestName} /> */}
            Number of Trials:
            {/* Setting these 2 forms to read only for now, later I'll figure out how to create the number of trials and questions based on user input*/}
            <input type='number' value={this.state.numTrials} readOnly />
            {/* <input type='number' value={this.state.numTrials}  onChange={this.changeNumTrials} /> */}
            
            Numer of Questions per Trial:
            <input type='number' value={this.state.numQuest} readOnly /> 
            {/* <input type='number' value={this.state.numQuest}  onChange={this.changeNumQuest} /> */}
            <hr />

          <form onSubmit={this.handleSubmit}>
            <h1>Test Name: {this.state.name}</h1>

            <div className="trials-holder">
              {forms}
            </div>
            <input type='submit' value='Save Test'/>
          </form>
      </div>
    );
  }
  }
}

export default TestCreator;