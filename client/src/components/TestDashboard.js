import React, { Component } from 'react';
import {RadioGroup, Radio} from 'react-radio-group'
import { Route, Redirect, Link } from 'react-router-dom'
import 'whatwg-fetch';
import TestViewer from './TestViewer'

class TestDashboard extends Component {
	constructor(props) {
		super(props)
		this.state = {
			tests: [],
			view: false,
			error: null,
			index: -1
		}
		this.handleClick = this.handleClick.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	renderSingleTest(index) {
		let trialsForms = [];
		if(index >= 0) {
			let test = this.state.tests[index];
			let trials = test.trials;
			let questions = test.questions;
			let maxRows = 4;
			trialsForms.push(<h1>Test Name:{test.name}</h1>)
		    for(let x=0;x<trials.length;x++)
		    {
		      //array to hold our questions forms
		      let questForms = [];
		      for(let y=0;y<4;y++) {
		        
		        //index used to map our 1d array to 2 dimensions
		 		console.log(i)
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
			<RadioGroup name='test' selectedValue={this.state.selectedValue} onChange={this.handleChange}>
				{listItems}
			</RadioGroup>
		)
	}

	componentDidMount() {
		this.loadTestsFromServer();
	}
	
	onDeleteTest = () => {
		if(this.state.tests.length>0) {
			let test = this.state.tests[this.state.index];
			let id = test._id;
			let data = [
				...this.state.tests.slice(0,this.state.index),
				...this.state.tests.slice(this.state.index+1)
			]
			this.setState({ tests: data,index: -1 })
			fetch(`/api/tests/${id}`, { method: 'DELETE' })
			.then(res => res.json()).then((res) => {
				if(!res.success) this.setState({ error: res.error});
				else console.log('Deleted!');
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

	handleChange(value) {
		this.setState({ index: value })
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
	}

	render() {
		let testList = this.renderTestList();
		let test = [];

		if(this.state.view)
			test= this.renderSingleTest( this.state.index );
		else
			test = [];

		return(
			<div className='dashboard'>
				<Link to="/test-creator"> <button>Create New Test</button> </Link>
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
						<div className = 'test-holder'>
							{test}
						</div>
			</div>
		)
	}
}



export default TestDashboard;