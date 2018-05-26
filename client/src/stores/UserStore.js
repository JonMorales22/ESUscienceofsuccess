import { observable, action } from "mobx";

//FOR DEBUGGING ONLY

export class UserStore {
	@observable isLoggedIn = true;
	@observable answeredSurvey = false;
	@observable subjectId = '5b08e157c01d1b407cba1902';
	@observable testId = '5b08e14ec01d1b407cba1901';
	@observable testName = 'exampleTest';
	

	@action.bound
	setSubjectId(subjectId) {
		//this.subjectId = subjectId;
	}

	@action.bound
	setTestId(testId) {
		//this.testId = testId; 
	}

	@action.bound
	setTestName(testName) {
		//this.testName = testName;
	}

	@action.bound
	logIn() {
		this.isLoggedIn = !this.isLoggedIn;
	}

}

const userStore = new UserStore();


export default userStore;