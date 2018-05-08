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
			index: -1
		}
		this.handleClick = this.handleClick.bind(this);
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
	
	//testid: 5af0a171aab97e1305007f0d
	//testName: submitTest2
	onDeleteTest = () => {
		let test = this.state.tests[this.state.index];
		let id = test._id;
		let data = [
			...this.state.tests.slice(0,this.state.index),
			...this.state.tests.slice(this.state.index+1)
		]
		this.setState({ tests: data })
		fetch(`/api/tests/${id}`, { method: 'DELETE' })
		.then(res => res.json()).then((res) => {
			if(!res.success) this.setState({ error: res.error});
			else console.log('Deleted!');
		})
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

	handleClick(event) {
		let type = event.target.name;
		if(type === 'view') {
			console.log('view');
		}
		else if(type === 'delete') {
			this.onDeleteTest();
		}
		else if(type === 'export') {
			console.log('export');
		}
	}

	render() {
		let testList = this.renderTests();
		return(
			<div className='App'>
				<Link to="/test-creator"> <button>Test Creator</button> </Link>
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
						<div className = 'btn-holder'>
							<button name='view' onClick={this.handleClick}> View </button>
							<button name='export' onClick={this.handleClick}> Export </button>
							<button name='delete' onClick={this.handleClick}> Delete </button>
						</div>
			</div>
		)
	}
}

export default TestDashboard;