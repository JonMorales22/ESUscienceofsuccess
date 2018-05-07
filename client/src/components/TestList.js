import React from 'react';

const TestList(props) {
	return{
		<h3>Test Name: {props.testName}</h3>
		<h3>Trials: {props.trials}</h3>
		<h3>Questions: {props.questions}</h3>
	}
}

export default TestList;