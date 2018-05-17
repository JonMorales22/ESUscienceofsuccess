//client/routes.js
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TestCreator from './components/TestCreator';
import TestDashboard from './components/TestDashboard';
//import TestViewer from './components/TestViewer';
import TestTaker from './components/TestTaker';
import DiscloseAgreement from './components/DiscloseAgreement';
import DemographicSurvey from './components/DemographicSurvey'


const Routes = () => (
	<div className='App'>
		<Switch>
			<Route exact path='/' component={DiscloseAgreement} />
			<Route exact path='/dashboard' component={TestDashboard} />
			<Route exact path='/test-creator' component={TestCreator} />
			<Route exact path='/test-taker' component={TestTaker} />
			<Route exact path='/demographic-survey' component={DemographicSurvey} />
		</Switch>
	</div>
);

// const TestViewerRoute = (props) => {
// 	return (
// 		<TestViewer trials={[]} questions={[]}
// 		{...props}
// 		/> 
// 	);
// }

// const renderMergedProps = (component, ...rest) => {
//   const finalProps = Object.assign({}, ...rest);
//   return (
//     React.createElement(component, finalProps)
//   );
// }

// const PropsRoute = ({ component, ...rest }) => {
//   return (
//     <Route {...rest} render={routeProps => {
//       return renderMergedProps(component, routeProps, rest);
//     }}/>
//   );
// }

export default Routes;