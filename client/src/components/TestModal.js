import React, { Component } from 'react';
import Modal from 'react-modal';

const customStyles = {
  content : {
  	textAlign			  : 'center',
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class TestModal extends Component {

	constructor(props) {
	    super(props);

	    this.state = {
	      modalIsOpen: false,
	    };

	    this.openModal = this.openModal.bind(this);
	    //this.afterOpenModal = this.afterOpenModal.bind(this);
	    this.closeModal = this.closeModal.bind(this);
	  }

	openModal() {
		this.setState({modalIsOpen: true});
	}

	// afterOpenModal() {
	// 	// references are now sync'd and can be accessed.
	//     this.subtitle.style.color = '#f00';
	// }

	closeModal() {
		this.setState({modalIsOpen: false});
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		let newState = prevState;
		newState.modalIsOpen = nextProps.modalIsOpen
		console.log("NextProps: " + nextProps.modalIsOpen);

		return newState;
	}

	render() {
		return (
			<div>
				<Modal
		          isOpen={this.state.modalIsOpen}
		          onAfterOpen={this.afterOpenModal}
		          onRequestClose={this.closeModal}
		          style={customStyles}
		          contentLabel="Example Modal"
		        >

		          <h3>Scenario {this.props.text}:</h3>
		          <div>
		          	The following questions all have to deal with Scenario {this.props.text}, which is printed at the top. 
		          	<p>Please read the scenario carefully and answer the questions that follow.</p>
		          </div>
		          
		          <hr/>
		          {/*<button onClick={this.closeModal}>Okay</button>*/}
		        </Modal>
			</div>
		)
	}
}

export default TestModal;