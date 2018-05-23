import { observable, action } from "mobx";

//FOR DEBUGGING ONLY

export class UserStore {
	@observable isLoggedIn = true;
	@observable answeredSurvey = false;
	@observable userId = '';
	@observable testId = '';
	@observable testName = '';
	

	@action.bound
	setUserId(userId) {
		this.userId = userId; //commented out for debugging only
	}

	@action.bound
	setTestId(testId) {
		this.testId = testId; //commented out for debugging only
	}

	@action.bound
	setTestName(testName) {
		this.testName = testName; //commented out for debugging only
	}

	@action.bound
	setAnsweredSurvey() {
		this.answeredSurvey = true;
	}

	@action.bound
	logIn() {
		this.isLoggedIn = !this.isLoggedIn;
	}

}

const userStore = new UserStore();

//FOR DEBUGGING ONLY
//userStore.setUserId('5b0406ea63112b5a43062a30');
userStore.setTestId('5b05d99bd305b68e1847c16e');
userStore.setTestName('exampleTest');

export default userStore;