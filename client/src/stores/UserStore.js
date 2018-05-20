import { observable, action } from "mobx";

export class UserStore {
	@observable isLoggedIn = false;
	@observable answeredSurvey = false;
	@observable userId = '';
	@observable testId = '';
	
	@action.bound
	setUserId(userId) {
		this.userId = userId;
	}

	@action.bound
	setTestId(testId) {
		this.testId = testId;
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

export default userStore;