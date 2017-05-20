import React from 'react';
import PropTypes from 'prop-types';
import Header from 'app/components/Header';
import { themedStyle, themeVars } from 'app/utils';

import style from './style.scss';

const css = themedStyle(style);

const commonApp = props => Object.keys(props).filter(v => !([
	'view',
	'backData',
	'headerRoutes'
].includes(v))).reduce((acc, v) => {
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

AppView.defaultProps = {
	backData: null
};

AppView.propTypes = {
	view: PropTypes.object.isRequired,
	theme: PropTypes.string.isRequired,

	backData: PropTypes.any,
	headerRoutes: PropTypes.any.isRequired,
};

export default AppView;
