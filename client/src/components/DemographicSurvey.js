import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { observer } from "mobx-react";

import UserStore from '../stores/UserStore';
/*
	Demographic Survey:
		component used to gather the demographic info from our Subject. This is the 1st part of the Test.
		All data is gathered from drop down lists. I figured this was the easiest and most foolproof way of collecting this data.
		Unfortunately I (at this point) do not know how to make test not render the 1st choice from drop down, maybe I'll set them all
		to the 'prefer not to answer' selection...
	Params:
		none
	Stores:
		UserStore
*/



@observer
class DemographicSurvey extends Component {
	constructor(props) {
		super(props);
		//unfortunately I can't figure out how to make the default values not show the top choice in the drop down list
		this.state = ({
			age: 18,
			gender: 'male',
			year: 'highschool',
			ethnicity: 'white',
			religion: 1,
			submit: false,
		});

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	//saves our demographic info to the DB using a POST request. 
	//Receives the subject id in the response body, which is saved in UserStore
	saveSubject() {

		const {age, gender, ethnicity, year, religion} = this.state;
		
		const testId = UserStore.testId;
		const testName = UserStore.testName;

		if(!age || !gender || !ethnicity || !year || !religion) {
			alert("Must input age, gender, ethnicity, relgiosity, and year!");
			return;
		}
		else if(!testId || !testName) {
			alert("Oops! TestId or testName doesn't exist! Something went wrong, please return to dashboard and try again.");
		}
		fetch('api/subjects', {
			method: 'POST',
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ age, gender, ethnicity, year, religion, testId, testName }),
		})
		//subject's id should be in the response body, which is saved in UserStore.
		.then(res => res.json()).then((res) => {
			if(res.success === true ) {
				UserStore.setAnsweredSurvey();
				UserStore.setUserId(res.subjectId)
				console.log("TestStore.userId: " + UserStore.userId);
				this.setState({ submit: true});
			}
			else if (res.success === false) {
				alert("Oops! Something went wrong, please return to dashboard and try again.");
			}
		});
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
			this.setState({ year: value });
		}
		else if(type === 'ethnicity'){
			this.setState({ ethnicity: value });
		}
		else if(type === 'religion')
			this.setState({ religion: value });	
	}

	handleSubmit(event) {
		event.preventDefault();
		this.saveSubject();
	}

	renderAgeForm() {
		let options = [];

		for(let i=0;i<100;i++) {
			options.push(<option value={i}  key={i}> {i} </option>)
		}
		return (<select name='age' value={this.state.age} onChange={this.handleChange}> {options} </select>)
	}

	render () {
		let ageForm = this.renderAgeForm();
		if(this.state.submit){
			return <Redirect to='/debriefing'/>
		}
		return (
			<form onSubmit={this.handleSubmit}>
				<div className='demographic-survey'>
					<h1>Demographic Questions</h1>
					<h3>Please fill out the following information:</h3>
					
					<p>Age:</p>
					{ageForm}
					<br/>

					<p>Gender:</p>
					<select name='gender' value={this.state.gender} onChange={this.handleChange}>
						<option value='male'>Male</option>
						<option value='female'>Female</option>
						<option value='nonbinary'>Non-Binary</option>
						<option value='other'>Other</option>
						<option value='none'>Prefer not to answer</option>
					</select>
					<br/>

					<p>Highest Level of Education:</p>
					<select name='year' value={this.state.year} onChange={this.handleChange}>
						<option value='highschool'>High School</option>
						<option value='freshman'>Freshman</option>
						<option value='sophomore'>Sophomore</option>
						<option value='junior'>Junior</option>
						<option value='senior'>Senior</option>
						<option value='bachelor'>Associates</option>
						<option value='bachelor'>Bachelors</option>
						<option value='masters'>Masters</option>
						<option value='doctorate'>Doctorate</option>
						<option value='other'>Other</option>
						<option value='none'>Prefer not to answer</option>
					</select>
					<br/>

					<p>Ethnicity:</p>
					<select name='ethnicity' value={this.state.ethnicity} onChange={this.handleChange}>
						<option value='white'>White</option>
						<option value='black'>Black</option>
						<option value='hispanic/latino'>Hispanic/Latino</option>
						<option value='asian'>Asian</option>
						<option value='native american'>Native American</option>
						<option value='pacific islander'>Pacific Islander</option>
						<option value='other'>Other</option>
						<option value='none'>Prefer not to answer</option>
					</select>
					<br/>

					<p>Level of Religiosity: (4=high level of religiosity)</p>
					<select name='religion' value={this.state.religion} onChange={this.handleChange}>
						<option value='1'>1</option>
						<option value='2'>2</option>
						<option value='3'>3</option>
						<option value='4'>4</option>
						<option value='none'>Prefer not to answer</option>
					</select>
					<br/>

				</div>
				<input type='submit' value='Submit'/>
			</form>
		)
	}
}

export default DemographicSurvey;