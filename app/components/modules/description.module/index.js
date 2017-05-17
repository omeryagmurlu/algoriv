import React from 'react';
import PropTypes from 'prop-types';
import { container } from './style.scss';

const Description = props => (
	<div className={container}>
		{props.text}
	</div>
);

Description.propTypes = {
	text: PropTypes.string
};

Description.defaultProps = {
	text: ''
};

export default Description;
