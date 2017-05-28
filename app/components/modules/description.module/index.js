import React from 'react';
import PropTypes from 'prop-types';
import { container } from './style.scss';

const Description = props => (props.text && (
	<div className={container}>
		{props.text}
	</div>
)) || null;

Description.propTypes = {
	text: PropTypes.string
};

Description.defaultProps = {
	text: ''
};

export default Description;
