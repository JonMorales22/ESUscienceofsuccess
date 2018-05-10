import React, { Component } from 'react';
import {ReactMic} from 'react-mic';

export class AudioRecorder extends Component {
	constructor(props) {
		super(props);
		this.state = ({
			record: false,
			latency: -1,
			audiofile: {
				blob: null,
				blobURL: "test"
			}
		})
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
		}

		console.log("End Time: " + this.endTime);		
		console.log("Latency: "+ latency);
		
		this.setState({
			record: true,
			latency: latency	
		});
	}

	stopRecording() {
		this.setState({
			record: false
		});
	}

	onData(recordedBlob) {
		console.log('chunk of real-time data');
	}

	onStop(recordedBlob) {
		console.log('Recorded blob is:', recordedBlob);
		this.setState({
			audiofile: recordedBlob
		})
	}

	findLatency(startTime, endTime) {
		return (endTime-startTime)/1000; //divide by 1000 to strip the miliseconds
	}

	render() {
		return(
			<div className='audio-recorder'>
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
				<div>
					<AudioPlayer source={this.state.audiofile.blobURL}/>
				</div>
				<div>
					<h3>Latency: {this.state.latency}</h3>
				</div>
			</div>
		)
	}
}

class AudioPlayer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
    	<div>
          <audio ref="audio_tag" src={this.props.source} controls autoPlay/>
         </div>
      )
  }
}

export default AudioRecorder