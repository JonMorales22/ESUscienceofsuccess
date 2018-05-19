import React, { Component } from 'react';
import { observer } from "mobx-react";
import 'whatwg-fetch';

import DevTools from "mobx-react-devtools";

class Login extends Component {
	constructor() {
		super();
		this.state = ({
			username: '',
			password: '',
			submit: false
		})
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		let type = event.target.name;
		let value = event.target.value;
		if(type === 'username')
			this.setState({ username: value });
		else if(type === 'password')
			this.setState({ password: value });
	}

	validateForm() {

	}

	handleSubmit() {

	}

	render() {
		return(
			<div className='login'>
				<h1>Researchly Login:</h1>
				<p><b>This page is for those with adminstrative access only!</b></p>
				<p>Researchly does not require you to create a username/password or sign in to take a test! </p>
				<p>If you got here on accident, please click here to return.</p>
				<br/>
				<form onSubmit={this.handleSubmit}>
					<br/>
					Username:
					<input type='text' name='username' value={this.state.username} onChange={this.handleChange} />
					
					<br/>
					Password:
					<input type='password' name='password' value={this.state.password} onChange={this.handleChange} />

					<br/>
					<button type='submit'>Submit</button>
				</form>
			</div>
		)
	}
}

export default Login;