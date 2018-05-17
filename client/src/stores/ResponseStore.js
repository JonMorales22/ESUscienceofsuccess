import { observable, computed, action } from "mobx";

class ResponseStore {
	@observable responses = [];
	@observable index = 0;

	constructor(numOfResponses) {
		for(let i=0; i<numOfResponses; i++)
			this.responses.push({
				hasResponse: false,
				canSkip: false,
			});
	}

	@action.bound
	incrementIndex() {
		if(this.index < this.responses.length-1)
			this.index++
	}

	@action.bound
	setSkip() {
		this.responses[this.index].canSkip = true;
	}

	@action.bound
	setResponse() {
		console.log('setResponse');
		this.responses[this.index].hasResponse = true;
	}
}

export default ResponseStore;