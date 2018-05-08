import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import 'whatwg-fetch';

class TestViewer extends Component {

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
  renderData(trialsArray, questionsArray) {
    //array to hold our trials forms
    let trialsForms = [];
    let maxRows = questionsArray.length;

    for(let x=0;x<trialsArray.length;x++)
    {
      //array to hold our questions forms
      let questForms = [];
      for(let y=0;y<questionsArray.length;y++) {
        
        //index used to map our 1d array to 2 dimensions
        let index = (x*maxRows)+y;
        questForms.push(
          <div className='question' key={index}>
            <h3>Question {y+1}</h3>
              <textarea name='question' rows='10' cols='50' value={questionsArray[index]} key={index} readOnly></textarea>
          
          </div>
        )
      }

      trialsForms.push(
        <div className='trial' key={x}>
          <h3>Trial {x+1}</h3>
          <h4>Trial Info:</h4>
      
          <textarea name='trial' rows='10' cols='50' value={trialsArray[x]} key={x} readOnly></textarea>
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

  /*
    renders: 
      -forms to collect other data (such as test name, # of trials per test, # of questions per trial)
      -the forms for to get info for our trials and questions.
  */
  render(props) {
  	let tempQ = [];
  	let tempT = [];
	let forms = this.renderData(tempT,tempQ);
    return (
      <div className="App">
      	{forms}
      </div>
		 );
  }
}

export default TestViewer;