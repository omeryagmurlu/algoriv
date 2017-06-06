import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import { themedStyle } from 'app/utils';

import style from './style.scss';

const css = themedStyle(style);

const DialogComponent = props => (
	<Dialog
		overlayClassName={css('overlay', props.theme)}
		contentClassName={css('content', props.theme)}
		actionsContainerClassName={css('actions-container', props.theme)}
		titleClassName={css('title', props.theme)}
		{...props}
	/>
);

DialogComponent.propTypes = {
	theme: PropTypes.string.isRequired
};

export default DialogComponent;
