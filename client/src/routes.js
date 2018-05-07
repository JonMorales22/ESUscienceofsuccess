//client/routes.js
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TestCreator from './components/TestCreator';
import TestDashboard from './components/TestDashboard';

const Routes = () => (
	<Switch>
		<Route exact path='/' component={TestDashboard} />
		<Route exact path='/test-creator' component={TestCreator} />
	</Switch>
);

export default Routes;