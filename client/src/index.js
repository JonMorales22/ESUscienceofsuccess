import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TestCreator from './components/TestCreator';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<TestCreator numberOftrials={5} numberOfQuestions={4} />, document.getElementById('root'));
registerServiceWorker();
