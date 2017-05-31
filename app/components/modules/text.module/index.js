import React from 'react';
import PropTypes from 'prop-types';
import { ifModuleEnabled } from 'app/utils';
import { style } from './style.scss';

const Text = props => ifModuleEnabled('text', props,
	<div className={style}>
		{props.text}
	</div>
);

Text.propTypes = {
	text: PropTypes.string
};

Text.defaultProps = {
	text: ''
};

export default Text;
