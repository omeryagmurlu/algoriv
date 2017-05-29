import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
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

const modalSelector = pops => (
	<div>
		<Dialog
			open={Object.keys(pops.modal).length !== 0 && [
				'prompt'
			].includes(pops.modal.type)}
			title={pops.modal.message}
			actions={((() => {
				switch (pops.modal.type) {
					case 'prompt':
						return [(
							<Prompt
								send={
									(...p) => {
										pops.modal.options.continuation(...p);
										pops.modal.exitStrategy();
									}
								}
								underlineFocusStyle={{
									borderColor: themeVars(pops.theme)('primary2Color')
								}}
								underlineStyle={{
									borderColor: themeVars(pops.theme)('primary1Color')
								}}
							/>
						)];
					default:
						return [];
				}
			})())}
			onRequestClose={pops.modal.exitStrategy}

			overlayClassName={css('overlay', pops.theme)}
			contentClassName={css('content', pops.theme)}
			actionsContainerClassName={css('actions-container', pops.theme)}
			titleClassName={css('title', pops.theme)}
		/>
		<Snackbar
			open={Object.keys(pops.modal).length !== 0 && [
				'alert'
			].includes(pops.modal.type)}
			message={pops.modal.message || ''}
			autoHideDuration={1500 * (pops.modal.durationModifier || 1)}
			onRequestClose={pops.modal.exitStrategy}

			className={css('snackbar', pops.theme)}
		/>
	</div>
);

const AppView = props => (
	<div className={css('container', props.theme)}>
		{modalSelector(props)}
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
