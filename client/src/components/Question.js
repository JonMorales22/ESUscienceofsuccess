import React from 'react';
import AudioRecorder from './audio-recorder'

function Question(props){
	return (
		<div className='question'>
			<h1>Question {props.number}</h1>
			<textarea name='trial' rows='10' cols='50' value={props.text} readOnly></textarea>
			<AudioRecorder />
		</div>
	)
}

export default Question;