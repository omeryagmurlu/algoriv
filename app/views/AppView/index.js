import React from 'react';
import PropTypes from 'prop-types';
import Header from 'app/components/Header';

import { main } from './style.scss';

const commonApp = props => [
	'goBack',
	'changeView',
	'updateHeader',
	'changeTheme',
	'theme',
	'availableThemes'
].reduce((acc, v) => {
	acc[v] = props[v];
	return acc;
}, {});

const AppView = props => (
	<div>
		<Header
			current={props.view}
			back={props.backData}
			routes={props.headerRoutes}

			app={commonApp(props)}
		/>
		<div className={main}>
			{React.createElement(props.view.view, {
				app: commonApp(props)
			})}
		</div>
	</div>
);

AppView.propTypes = {
	view: PropTypes.object.isRequired
};

export default AppView;
