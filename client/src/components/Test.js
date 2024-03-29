import React, { Component } from 'react';
import Modal from 'react-modal';
import { observer } from "mobx-react";
import DevTools from "mobx-react-devtools";

import Question from './Question';
import AudioRecorder from './audio-recorder';
import DemographicSurvey from './DemographicSurvey';

import ResponseStore from '../stores/ResponseStore.js';
import UserStore from '../stores/UserStore';

import 'whatwg-fetch';


//creates a response store
let responseStore = new ResponseStore(20);

//custom CSS used for our Modal,
const customStyles = {
  content : {
  	textAlign			  : 'center',
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

//test_id: 5af5c709ca254a0704f3bef2 <-- currently using this for debugging... UPDATE: probably not using it anymore LUL
/*TODO
	-if a test doesn't load from db, add a way for subject to try again or take them back to dashboard
*/

/*
	TestTaker
		component used to show questions and receive responses from subject. 
		When component first renders, subject is shown a modal that shows them the Test Name, the current trial, and the current question.
		this modal appears everytime the subject starts a new trial. I added this functionality so it was EXPLICITLY clear that subject started
		a new trial so that they would be more likey to read the trial prompt

		I also added functionality that allows a subject to skip a question... however I feel like that will probably be removed in the future.

		Props:
			none
		Stores:
			UserStore
			ResponseStore
*/
@observer
class TestTaker extends Component {
	constructor() {
		super();
		this.state = ({
			test_id: '',
			test: null,
			testname: null,
			trials: null,
			questions: null,
			questionsIndex: 0, //index used to keep track of what question the Subject is currently answering
			trialsIndex: 0, //index used to keep track of what trial the subject is currently on
			questionsPerTrial: 0,
			modalIsOpen: true, //show modal which notifies the Subject what trial they are on
		});
		this.handleClick = this.handleClick.bind(this);
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	//loads our test from DB when component mounts
	componentDidMount() {
		this.loadTest();
	}

	//loads test from and stores it in state... maybe it would be better to create Test Store and store test in the TestDashboard component
	//that would be 1 less call to the database
	loadTest = () => {
		let test_id = UserStore.testId;
		fetch(`/api/tests/${test_id}`, { method: 'GET' })
		.then(data => data.json())
		.then((res) => {
			if(!res.success) this.setState({ error: res.error});
			else {
				let testname = res.test[0].name;
				let trials = res.test[0].trials;
				let questions = res.test[0].questions;
				let questionsPerTrial = Math.floor(questions.length / trials.length);
				this.setState({ test: res.test[0],  testname: testname, trials: trials, questions: questions, questionsPerTrial: questionsPerTrial })
			} 
		})
	}

	//saves our AudioResponse data to DB
	saveResponse = () => {
		let index = responseStore.index;
		let response = responseStore.responses[index];
		let audiofile = response.audiofile;
		let blob = audiofile.blob;
		let blobURL = audiofile.bloblURL
		if(!blob) {
			console.log('audiofile doesn not exist!');
			return;
		}
		//let foo = new Buffer(audiofile,'binary').toString("base64");
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			let base64 = reader.result;
			//base64 = base64.substr(base64.indexOf(',')+1);
			fetch('/api/audioresponse', {
				method: 'POST',
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ base64 }),
			})
			.then(res => res.json()).then((res) => {
				console.log(res);
			});
		});
		reader.readAsDataURL(blob);
	}

	//
	incrementTrialsIndex() {
		this.setState(prevState => {
			if(this.state.trialsIndex < this.state.trials.length-1){
				return {trialsIndex: prevState.trialsIndex+1}
			}
		})	
	}

	incrementQuestionsIndex(){
		this.setState(prevState => {
			if(this.state.questionsIndex < this.state.questions.length){
				return {questionsIndex: prevState.questionsIndex+1}
			}
		})
	}

	handleClick(event) {
		let type = event.target.name;
		if(type === 'next') {
			//save two values from ResponseStore in placeholder variables, I think its more readable this way
			let index = responseStore.index;
			let response = responseStore.responses[index];

			//checks response store to see if we have a response, or if the user can skip the question
			if(!response.hasResponse && !response.canSkip) {
				alert('Warning: You have not recorded a response! If you wish to skip the question, click the next button again.');
				responseStore.setSkip();
			}
			else if( response.hasResponse || response.canSkip) {
				//this.saveResponse();
				//if we are on question 0,4,8,12,16 then we show the modal
				if(this.state.questionsIndex % this.state.questionsPerTrial === 3 && this.state.trialsIndex < this.state.trials.length-1) {
					this.incrementTrialsIndex();
					this.openModal();
				}
				if(this.state.questionsIndex < this.state.questions.length-1) {
					responseStore.incrementIndex();
					this.incrementQuestionsIndex();
				}
			}
		}
	}

	openModal() {
		this.setState({modalIsOpen: true});
	}


	closeModal() {
		this.setState({modalIsOpen: false});
	}

	/*
	  Render
	  	first we check to make sure we actually have test data pulled from DB, if not we notify the Subject
	  	NEED TO ADD A LINK THAT TAKES USER BACK TO DASHBOARD!!!!
	*/
	render() {
		if(this.state.trials && this.state.questions) {
			return(
				<div className='test-taker'>
					<div>
						<Modal
				          isOpen={this.state.modalIsOpen}
				          onAfterOpen={this.afterOpenModal}
				          onRequestClose={this.closeModal}
				          style={customStyles}
				          contentLabel="Example Modal"
				        >
				          <h2>{this.state.test.name}</h2>
				          <b>Scenario {this.state.trialsIndex+1}:</b>
				          <div>
				          	The following questions all have to deal with Scenario {this.state.trialsIndex+1}, which is printed at the top. 
				          	<p>Please read the scenario carefully and answer the questions that follow.</p>
				          </div>
				          
				          <hr/>
				          <button name='modal-button' onClick={this.closeModal}>Okay</button>
				        </Modal>
					</div>

					<h1>Scenario {this.state.trialsIndex+1}</h1>
					<textarea name='trial' rows='10' cols='50' value={this.state.trials[this.state.trialsIndex]} readOnly></textarea>

					<hr />
					<Question text={this.state.questions[this.state.questionsIndex]} number={this.state.questionsIndex+1} />
					<AudioRecorder store={responseStore} key={this.state.questionsIndex}/>
					<button name='next' onClick={this.handleClick}> Next Question</button>

					<DevTools/>
				</div>
			);
		}
		else {
			return (
				<p>Sorry! We seem to have lost that information...</p>
			)
		}
	}
}

export default TestTaker;