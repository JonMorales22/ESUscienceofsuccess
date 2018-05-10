import React, { Component } from 'react';

class DemographicSurvey extends Component {
	constructor(props) {
		super(props);
		this.state = ({
			age: 18,
			gender: 'male',
			year: 'freshman',
			ethnicity: 'white',
			submit: false,
		});

		this.handleChange = this.handleChange.bind(this);
	}

	renderAgeForm() {
		let options = [];

		for(let i=0;i<100;i++) {
			options.push(<option value={i}  key={i}> {i} </option>)
		}
		return (<select name='age' value={this.state.age} onChange={this.handleChange}> {options} </select>)
	}

	handleChange(event) {
		let type = event.target.name;
		let value = event.target.value;
		if(type === 'age') {
			this.setState({ age: value });
		}
		else if(type === 'gender') {
			this.setState({ gender: value })
		}
		else if(type === 'year') {
			this.setState({ year: value});
		}
		else if(type === 'ethnicity'){
			this.setState({ ethnicity: value});
		}	
	}

	render () {
		let ageForm = this.renderAgeForm();
		return (
				<div className='demographic-survey'>
					<h3>Demographic Questions</h3>
					Age: {ageForm}
					
					<br/>
					Please select gender:
					<select name='gender' value={this.state.gender} onChange={this.handleChange}>
						<option value='male'>Male</option>
						<option value='female'>Female</option>
						<option value='nonbinary'>Non-Binary</option>
						<option value='other'>Other</option>
						<option value='na'>Prefer not to answer</option>
					</select>

					<br/>
					Please select current/closest year of education:
					<select name='year' value={this.state.year} onChange={this.handleChange}>
						<option value='freshman'>Freshman</option>
						<option value='sophomore'>Sophomore</option>
						<option value='junior'>Junior</option>
						<option value='senior'>Senior</option>
						<option value='na'>Prefer not to answer</option>
					</select>

					<br/>
					Please select ethnicity:
					<select name='ethnicity' value={this.state.ethnicity} onChange={this.handleChange}>
						<option value='white'>White</option>
						<option value='black'>Black</option>
						<option value='hispanic/latino'>Hispanic/Latino</option>
						<option value='asian'>Asian</option>
						<option value='native american'>Native American</option>
						<option value='pacific islander'>Pacific Islander</option>
						<option value='other'>Other</option>
						<option value='na'>Prefer not to answer</option>
					</select>
				</div>
		)
	}
}

export default DemographicSurvey;