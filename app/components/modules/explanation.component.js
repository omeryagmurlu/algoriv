import React from 'react';
import PropTypes from 'prop-types';
import { style } from '../../styles/explanation.scss';

const Explanation = props => {
	return (
		<div className={style}>
			{props.text}
		</div>
	);
};

Explanation.propTypes = {
	text: PropTypes.string
};

Explanation.defaultProps = {
	text: ''
};

export default Explanation;
