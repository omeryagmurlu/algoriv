import React from 'react';
import PropTypes from 'prop-types';
import Header from 'app/components/Header';

import { main } from './style.scss';
const AppView = props => (
	<div>
		<Header
			current={props.view}
			back={props.backData}
			routes={props.headerRoutes}

			goBack={props.goBack}
			changeView={props.changeView}
		/>
		{React.createElement(props.view.view, {
			changeView: props.changeView,
			updateHeader: props.updateHeader,
			className: main
		})}
	</div>
);

AppView.propTypes = {
	view: PropTypes.object.isRequired,
	changeView: PropTypes.func.isRequired,
	updateHeader: PropTypes.func.isRequired
};

export default AppView;
