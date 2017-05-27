import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import Header from 'app/components/Header';
import Prompt from 'app/components/Prompt';
import { themedStyle, themeVars } from 'app/utils';

import style from './style.scss';

const css = themedStyle(style);

const commonApp = props => Object.keys(props).filter(v => !([
	'view',
	'backData',
	'headerRoutes',
	'modal'
].includes(v))).reduce((acc, v) => {
	acc[v] = props[v];
	return acc;
}, {});

const modalSelector = modal => {
	switch (modal.type) {
		case 'prompt':
			return [(
				<Prompt
					send={
						(...p) => {
							modal.options.continuation(...p);
							modal.exitStrategy();
						}
					}
				/>
			)];
		default:
			return [];
	}
};

const AppView = props => {
	document.body.style.backgroundColor = themeVars(props.theme)('backgroundColor');
	return (
		<div className={css('container', props.theme)}>
			<Dialog
				open={Object.keys(props.modal).length !== 0}
				title={props.modal.message}
				actions={modalSelector(props.modal)}
				onRequestClose={props.modal.exitStrategy}

				contentClassName={css('content')}
				actionsContainerClassName={css('actionsContainer')}
				titleClassName={css('title')}
			/>
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
