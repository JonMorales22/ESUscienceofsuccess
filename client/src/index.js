import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import Routes from './routes'
import './index.css';
//import TestCreator from './components/TestCreator';
//import TestDashboard from './components/TestDashboard'
import registerServiceWorker from './registerServiceWorker';

//ReactDOM.render(<TestCreator numberOfTrials={5} numberOfQuestions={4} />, document.getElementById('root'));
ReactDOM.render(
	<BrowserRouter>
		<Routes />
	</BrowserRouter>, document.getElementById('root')
);
registerServiceWorker();
