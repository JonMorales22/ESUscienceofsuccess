import React, { Component } from 'react';
import {ReactMic} from 'react-mic';
import { observer } from "mobx-react";
import recordIcon from '../assets/record-icon.png';

let initialState = ({
	record: false,
	latency: -1,
	audiofile: {
		blob: null,
		blobURL: 'test',
	}
});

@observer
export class AudioRecorder extends Component {
	constructor(props) {
		super(props);
		this.state = (initialState);
		this.startRecording = this.startRecording.bind(this)
		this.stopRecording = this.stopRecording.bind(this)
		this.onStop = this.onStop.bind(this)
	}

	componentDidMount() {
		this.startTime = new Date();
		console.log("Start Time: " + this.startTime);
	}

	startRecording() {
		this.endTime = new Date();
		let latency = -1;
		if(this.state.latency < 0) {
			latency = this.findLatency(this.startTime, this.endTime);
			this.setState({ latency: latency });
		}

		console.log("End Time: " + this.endTime);		
		console.log("Latency: "+ latency);
		
		this.setState({ record: true });
	}

	stopRecording() {
		this.setState({
			record: false
		});
	}

	// onData(recordedBlob) {
	// 	console.log('chunk of real-time data');
	// }

	onStop(recordedBlob) {
		console.log(recordedBlob);
		if(recordedBlob) {
			this.props.store.setResponse();
			this.props.store.setAudiofile(recordedBlob);
			console.log('Recorded blob is:', recordedBlob);
			this.setState({
				audiofile: recordedBlob
			})
		}
	}

	findLatency(startTime, endTime) {
		return (endTime-startTime)/1000; //divide by 1000 to strip the miliseconds
	}

	render() {
		let isRecording;
		if(this.state.record)
			isRecording = <img className='record-icon-on' src={recordIcon} alt='' />;
		else
			isRecording = <img className='record-icon-off' src={recordIcon} alt='' />;
		return(
			<div className='audio-recorder'>
				{isRecording}
				<ReactMic
					record={this.state.record}
					className='sound-wave'
					onStop={this.onStop}
					strokeColor='#000000'
					backgroundColor='#FFF' />
				<div className='button-holder'>
					<button onClick={this.startRecording} type='button'>Start Recording</button>
					<button onClick={this.stopRecording} type='button'>Stop Recording</button>
				</div>
			</div>
		)
	}
}

class AudioPlayer extends Component {
  render() {
    return(
    	<div>
          <audio ref="audio_tag" src={this.props.source} controls autoPlay/>
         </div>
      )
  }
}

export default AudioRecorder