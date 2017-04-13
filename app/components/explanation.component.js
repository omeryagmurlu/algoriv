import React from 'react';
import PropTypes from 'prop-types';
import { style } from '../styles/explanation.scss';

const Explanation = props => {
	return (
		<div className={style}>
			{props.explanation}
		</div>
	);
};

Explanation.propTypes = {
	explanation: PropTypes.string
};

Explanation.defaultProps = {
	explanation: ''
};

export default Explanation;
