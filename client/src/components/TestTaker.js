import React, { Component } from 'react';
import DemographicSurvey from './DemographicSurvey'
import Modal from 'react-modal';
import Question from './Question'
import AudioRecorder from './audio-recorder'
import 'whatwg-fetch';

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

//test_id: 5af3d1221b046d57ae4dd0d2 <-- currently using this for debugging
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
		this.handleSubmit = this.handleSubmit.bind(this);
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	componentDidMount() {
		this.loadTest();
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
		let value = event.target.value;
		if(type === 'next') {
			if(this.state.questionsIndex % this.state.questionsPerTrial === 3 && this.state.trialsIndex < this.state.trials.length-1){
				this.incrementTrialsIndex();
				this.openModal();
			}
			if(this.state.questionsIndex < this.state.questions.length-1) {
				this.incrementIndex();
			}
		}
	}

	handleSubmit(event) {
		event.preventDefault();
		let type = event.target.name;
		let value = event.target.value;
	}

	openModal() {
		this.setState({modalIsOpen: true});
	}


	closeModal() {
		this.setState({modalIsOpen: false});
	}


	render() {
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
					<AudioRecorder />
					<button name='next' onClick={this.handleClick}> Next Question</button>
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