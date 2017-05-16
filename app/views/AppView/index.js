import React from 'react';
import PropTypes from 'prop-types';
import Header from 'app/components/Header';
import { themedStyle, themeVars } from 'app/utils';

import style from './style.scss';

const css = themedStyle(style);

const commonApp = props => [
	'goBack',
	'changeView',
	'updateHeader',
	'changeTheme',
	'theme'
].reduce((acc, v) => {
	acc[v] = props[v];
	return acc;
}, {});

const AppView = props => {
	document.body.style.backgroundColor = themeVars(props.theme)('backgroundColor');
	return (
		<div className={css('container', props.theme)}>
			<Header
				disabled={!props.backData}
				current={props.view}
				back={props.backData}
				routes={props.headerRoutes}

				app={commonApp(props)}
			/>
			<div className={css('main')}>
				{React.createElement(props.view.view, {
					app: commonApp(props)
				})}
			</div>
		</div>
	);
};

AppView.propTypes = {
	view: PropTypes.object.isRequired
};

export default AppView;
