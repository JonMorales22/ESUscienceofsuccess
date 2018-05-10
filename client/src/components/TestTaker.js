import React, { Component } from 'react';
import DemographicSurvey from './DemographicSurvey'

class TestTaker extends Component {
	constructor() {
		super();
		this.state = ({
			showDemographicSurvey: true,
		});
		//this.handleClick = this.handleClick.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	// handleClick(event) {
	// 	let type = event.target.name;
	// 	let value = event.target.value;
	// 	if(type === 'continue') {
			
	// 	}
	// }

	handleSubmit(event) {
		event.preventDefault();
		console.log('handle submit')
		
		let type = event.target.name;
		let value = event.target.value;
		
		if(type === 'demographics') {
			this.saveSubject();
			this.setState({ showDemographicSurvey: false })
		}
	}

	render() {
		let submitButton = (<button name='continue' type='submit' onClick={this.handleClick}> Continue...? </button>)
		if(this.state.showDemographicSurvey) {
			return(
				<form name='demographics' onSubmit={this.handleSubmit}>
					<div className='demographic-survey'>
						<h1>Test Taker</h1>
						<DemographicSurvey />
						<input type='submit' value='Submit'/>
					</div>
				</form>
			)
		}
		else {
			return (
				<div className='test-taker'>
					<h1>Trial 1</h1>
					<textarea name='trial' rows='10' cols='50' value='This is the info for trial 1.' readOnly></textarea>
				</div>
			)
		}

	}
}

export default TestTaker;