import React, { Component } from 'react';
import {RadioGroup, Radio} from 'react-radio-group'
import { Redirect, Link } from 'react-router-dom'
import { observer } from "mobx-react";
import DevTools from "mobx-react-devtools";

import UserStore from '../stores/UserStore';
import 'whatwg-fetch';

class TestDashboard extends Component {
	constructor() {
		super()
		this.state = {
			tests: [],
			username: '',
			password: '',
			view: false,
			error: null,
			index: -1,
			submit: false,
		}
		this.handleClick = this.handleClick.bind(this);
		this.handleListChange = this.handleListChange.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	renderSingleTest(index) {
		let trialsForms = [];
		if(index >= 0) {
			let test = this.state.tests[index];
			let trials = test.trials;
			let questions = test.questions;
			let maxRows = 4;
			trialsForms.push(<h1>Test Name:{test.name}</h1>)
			trialsForms.push(<h3>Test Id:{test._id}</h3>)
		    for(let x=0;x<trials.length;x++)
		    {
		      //array to hold our questions forms
		      let questForms = [];
		      for(let y=0;y<4;y++) {
		        
		        //index used to map our 1d array to 2 dimensions
		 		//console.log(i)
		        let i = (x*maxRows)+y;
		        questForms.push(
		          <div className='question' key={i}>
		            <h3>Question {y+1}</h3>
		              <textarea name='question' rows='10' cols='50' value={questions[i]} key={i} readOnly></textarea>
		          
		          </div>
		        )
		      }

		      trialsForms.push(
		        <div className='trial' key={x}>
		          <h3>Trial {x+1}</h3>
		          <h4>Trial Info:</h4>
		      
		          <textarea name='trial' rows='10' cols='50' value={trials[x]} key={x} readOnly></textarea>
		          <div className='questions-holder'>
		            {questForms}
		          </div>
		          <hr />
		        </div>
		      )
		    }
		}

		return trialsForms
	}

	renderTestList() {
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
			<RadioGroup name='list' selectedValue={this.state.selectedValue} onChange={this.handleListChange}>
				{listItems}
			</RadioGroup>
		)
	}

	componentDidMount() {
		this.loadTestsFromServer();
	}
	
	onDeleteTest = () => {
		if(this.state.tests.length>0&&this.state.index>0) {
			const { username, password } = this.state;
			let test = this.state.tests[this.state.index];
			let id = test._id;
			fetch(`/api/tests/${id}`, { 
				method: 'DELETE',
		    	headers: { "Content-Type": "application/json" },
		    	body: JSON.stringify({ username, password }),
		    })
			.then(res => res.json()).then((res) => {
				if(!res.success) { 
					this.setState({ error: res.error})
					alert(res.error);
				}
				else {
					let data = [
						...this.state.tests.slice(0,this.state.index),
						...this.state.tests.slice(this.state.index+1)
					]
					this.setState({ tests: data,index: -1 })
					alert('Test successfully deleted!')
				};
			})
		}
	}

	loadTestsFromServer = () => {
		fetch('/api/tests')
			.then(data => data.json())
			.then((res) => {
				if(!res.success) this.setState({});
				else this.setState({ tests: res.tests })
			})
	}

	handleListChange(value) {
		this.setState({ index: value})
	}

	handleInputChange(event) {
		let type = event.target.name;
		let text = event.target.value;

		if(type === 'username')
			this.setState({ username: text });
		else if(type === 'password')
			this.setState({ password: text });
	}

	handleClick(event) {
		let type = event.target.name;
		if(type === 'view') {
			this.setState({ view: !this.state.view})
		}
		else if(type === 'delete') {
			this.onDeleteTest();
		}
		else if(type === 'export') {
			console.log('export');
		}
		else if(type === 'take-test') {
			this.setState({ submit: true });
			UserStore.setTestId(this.state.tests[this.state.index]._id);
			console.log("Test Id:" + UserStore.testId);
		}
	}

	render() {
		let testList = this.renderTestList();
		let test = [];

		if(this.state.view)
			test= this.renderSingleTest( this.state.index );
		else
			test = [];

		if(this.state.submit === true){
			return <Redirect to='/demographic-survey' />
		}
		else if(UserStore.isLoggedIn) {
			return(
				<div className='dashboard'>
				<DevTools />
				Login:
	            <p>
	              Username:<input name='username' type='text' value={this.state.username}  onChange={this.handleInputChange}/>
	              Password:<input name='password' type='password' value={this.state.password}  onChange={this.handleInputChange}/>
	            </p>
							<hr/>
							<div className='testlist'>
								<h1>Tests:</h1>
								<Link to="/test-creator"> <button>Create New Test</button> </Link>
								{testList}
							</div>
							<div className = 'btn-holder'>
								<button name='view' onClick={this.handleClick}> View </button>
								<button name='export' onClick={this.handleClick}> Export </button>
								<button name='delete' onClick={this.handleClick}> Delete </button>
								<button name='take-test' onClick={this.handleClick}> Take Test </button>
							</div>
							<div className = 'test-holder'>
								{test}
							</div>
				</div>
			)
		}
		else{
			return(
				<div className='dashboard'>
				<DevTools />
							<hr/>
							<div className='testlist'>
								<h1>Tests:</h1>
								{testList}
							</div>
							<div className = 'btn-holder'>
								<button name='take-test' onClick={this.handleClick}> Take Test </button>
							</div>
				</div>
			)
		
		}
	}
}



export default TestDashboard;