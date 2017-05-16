import React from 'react';
import PropTypes from 'prop-types';
import { container, header } from './style.scss';

const Description = props => {
	return (
		<div className={container}>
			{props.text}
		</div>
	);
};

Description.propTypes = {
	text: PropTypes.string,
	header: PropTypes.string
};

Description.defaultProps = {
	text: '',
	header: ''
};

export default Description;
