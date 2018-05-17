import React, { Component } from 'react';
import Modal from 'react-modal';
import Question from './Question';
import AudioRecorder from './audio-recorder';
import 'whatwg-fetch';

import { observer } from "mobx-react";
import ResponseStore from '../stores/ResponseStore.js';
import DevTools from "mobx-react-devtools";

const fs = require('fs');

//for right now just going to implement a question store which will be simpler, later I can implement a full test store if necessary.
// class TestStore {
// 	@observable questions = [];
// 	@observable trials = [];
// 	@observable test;
// 	@observable index;

// 	@action.bound 
// 	incrementIndex() {
// 		let max = this.trials.length * this.questions.length;
// 		if(this.index < this.trials.length-1)
// 		{
// 			this.index++;
// 		}
// 	}
// }
// class QuestionStore {
// 	@observable questions = [];
// 	@observable index = 0;

// 	@action.bind
// 	addQuestion(question) {
// 		this.questions.push(question);
// 	}

// 	@action.bind
// 	incrementIndex() {
// 		if(this.index < this.questions.length-1)
// 			this.index++
// 	}

// }

let responseStore = new ResponseStore(20);

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

//test_id: 5af5c709ca254a0704f3bef2 <-- currently using this for debugging
@observer
class TestTaker extends Component {
	constructor() {
		super();
		this.state = ({
			test_id: '5af5c709ca254a0704f3bef2',
			test: null,
			trials: null,
			questions: null,
			questionsIndex: 0,
			trialsIndex: 0,
			questionsPerTrial: 0,
			modalIsOpen: true,
		});
		this.handleClick = this.handleClick.bind(this);
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	componentDidMount() {
		this.loadTest();
		//responseStore = new ResponseStore(20);
	}

	//
	loadTest = () => {
		let test_id = this.state.test_id;
		fetch(`/api/tests/${test_id}`, { method: 'GET' })
		.then(data => data.json())
		.then((res) => {
			if(!res.success) this.setState({ error: res.error});
			else {
				let trials = res.test[0].trials;
				let questions = res.test[0].questions;
				let questionsPerTrial = Math.floor(questions.length / trials.length);
				this.setState({ test: res.test[0], trials: trials, questions: questions, questionsPerTrial: questionsPerTrial })
				console.log('Success!');
			} 
		})
	}

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

	incrementTrialsIndex() {
		this.setState(prevState => {
			//console.log("trials length: " + this.state.trials.length);
			if(this.state.trialsIndex < this.state.trials.length-1){
				//console.log("trials index: " + this.state.trialsIndex);
				return {trialsIndex: prevState.trialsIndex+1}
			}
		})	
	}

	incrementIndex(){
		this.setState(prevState => {
			if(this.state.questionsIndex < this.state.questions.length){
				return {questionsIndex: prevState.questionsIndex+1}
			}
		})
	}

	handleClick(event) {
		let type = event.target.name;
		//let value = event.target.value;
		if(type === 'next') {
			let index = responseStore.index;
			let response = responseStore.responses[index];
			if(!response.hasResponse && !response.canSkip) {
				alert('Warning: You have not recorded a response! If you wish to skip the question, click the next button again.');
				responseStore.setSkip();
			}
			else if( response.hasResponse || (!response.hasResponse && response.canSkip)) {
				this.saveResponse();
				// if(this.state.questionsIndex % this.state.questionsPerTrial === 3 && this.state.trialsIndex < this.state.trials.length-1) {
				// 	this.incrementTrialsIndex();
				// 	this.openModal();
				// }
				// if(this.state.questionsIndex < this.state.questions.length-1) {
				// 	responseStore.incrementIndex();
				// 	this.incrementIndex();
				// }
			}
		}
	}

	// handleSubmit(event) {
	// 	event.preventDefault();
	// 	let type = event.target.name;
	// 	let value = event.target.value;
	// }

	openModal() {
		this.setState({modalIsOpen: true});
	}


	closeModal() {
		this.setState({modalIsOpen: false});
	}


	render() {
		//let index = responseStore.index;
		//let response = responseStore.responses[index];
		if(this.state.trials && this.state.questions && !this.state.showStartDialogue) {
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

				          <h3>Scenario {this.state.trialsIndex+1}:</h3>
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
				<p>There's nothing here!</p>
			)
		}
	}
}

export default TestTaker;