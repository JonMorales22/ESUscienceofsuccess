import React, { Component } from 'react';
import {RadioGroup, Radio} from 'react-radio-group'
import { Link } from 'react-router-dom'
import 'whatwg-fetch';

class TestDashboard extends Component {
	constructor(props) {
		super(props)
		this.state = {
			tests: [],
			error: null,
			index: 0
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	renderTests() {
		// let testsArray = this.state.tests;
		// let listItems = testsArray.map((test) => 
		// 	<li key={test._id}>
		// 		{test.name}
		// 	</li>
		// );
		// return listItems;

		let testsArray = this.state.tests;
		let listItems = testsArray.map((test, index) => 
			<label id={test._id} key={test._id}>
				<Radio value={index}/>{test.name}<br/>
			</label>
		);
		return (
			<RadioGroup name='test' selectedValue={this.state.selectedValue} onChange={this.handleChange}>
				{listItems}
			</RadioGroup>
		)
	}

	componentDidMount() {
		this.loadTestsFromServer();
	}

	handleSubmit(event) {
		event.preventDefault();

		let selectedTest = this.state.tests[this.state.index]
		console.log(selectedTest)
	}

	loadTestsFromServer = () => {
		fetch('/api/tests')
			.then(data => data.json())
			.then((res) => {
				if(!res.success) this.setState({});
				else this.setState({ tests: res.tests })
			})
	}

	handleChange(value) {
		this.setState({ index: value })
	}

	render() {
		let testList = this.renderTests();
		return(
			<div className='App'>
				<Link to="/test-creator"> <button>Test Creator</button> </Link>
				<form onSubmit={this.handleSubmit}>
					{/*<button type='button'>Create New Test</button>*/}
						<div className='testlist'>
							<h1>Tests:</h1>
							{testList}
							{/*
							<RadioGroup name='test' selectedValue={this.state.selectedValue} onChange={this.handleChange}>
								<Radio value='test1'/>Test1<br/>
								<Radio value='test2'/>Test2<br/>
							</RadioGroup>
							*/}
						</div>
						<button type='submit'>Export</button>
						<button type='button'>Delete</button>
				</form>
			</div>
		)
	}
}

export default TestDashboard;