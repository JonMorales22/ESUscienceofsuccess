import { observable, action } from "mobx";

//FOR DEBUGGING ONLY

export class UserStore {
	@observable isLoggedIn = false;
	@observable answeredSurvey = false;
	@observable subjectId = '5b09ce69bafb62293dc97b20';
	@observable testId = '5b09ce59bafb62293dc97b1f';
	@observable testName = 'newTest';
	

	@action.bound
	setSubjectId(subjectId) {
		this.subjectId = subjectId;
	}

	@action.bound
	setTestId(testId) {
		this.testId = testId; 
	}

	@action.bound
	setTestName(testName) {
		this.testName = testName;
	}

	@action.bound
	logIn() {
		this.isLoggedIn = !this.isLoggedIn;
	}

}

const userStore = new UserStore();


export default userStore;