import React from 'react';
import PropTypes from 'prop-types';
import { style } from './style.scss';

const Text = props => (
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
