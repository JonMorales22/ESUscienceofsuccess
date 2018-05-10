import React, { Component } from 'react';
import DemographicSurvey from './DemographicSurvey'
import Question from './Question'
import 'whatwg-fetch';

//test_id: 5af3d1221b046d57ae4dd0d2 <-- currently using this for debugging
class TestTaker extends Component {
	constructor() {
		super();
		this.state = ({
			test_id: '5af3e21638d174616eb06011',
			test: null,
			trials: null,
			questions: null,
			showTrial: true,
			showQuestion: false,
		});
		this.handleClick = this.handleClick.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		this.loadTest();
	}

	loadTest = () => {
		let test_id = this.state.test_id;
		fetch(`/api/tests/${test_id}`, { method: 'GET' })
		.then(data => data.json())
		.then((res) => {
			if(!res.success) this.setState({ error: res.error});
			else {
				this.setState({ test: res.test[0], trials: res.test[0].trials, questions: res.test[0].questions })
				console.log('Success!');
			} 
		})
	}

	handleClick(event) {
		let type = event.target.name;
		let value = event.target.value;
		if(type === 'next') {
			this.setState({ showTrial: !this.state.showTrial, showQuestion: !this.state.showQuestion });

		}
	}

	handleSubmit(event) {
		event.preventDefault();
		let type = event.target.name;
		let value = event.target.value;
	}

	render() {
		let nextButton = <button name='next' onClick={this.handleClick}> Next </button>
		if(this.state.trials && this.state.showTrial) {
			return(
				<div className='test-taker'>
					<h1>Trial 1</h1>
					<textarea name='trial' rows='10' cols='50' value={this.state.trials[0]} readOnly></textarea>
					{nextButton}
				</div>
			);
		}
		else if(this.state.questions && this.state.showQuestion) {
			return (
				<div className='test-taker'>
					<Question text={this.state.questions[0]} number={1} />
					{nextButton}
				</div>
			)
		}
		else {
			return (
				<p>There's nothing here!</p>
			)
		}
	}
}

export default TestTaker;