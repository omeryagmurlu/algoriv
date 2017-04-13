import React from 'react';
import PropTypes from 'prop-types';
import { style, active, passive } from '../styles/code.scss';

const Code = props => {
	const lineTags = Array(props.algorithmCode.length).fill(passive);
	props.code.forEach((idx => (lineTags[idx] = active)));
	const lines = props.algorithmCode.map((line, i) => <p key={line} className={lineTags[i]}>{line}</p>);
	return (
		<div className={style}>
			{lines}
		</div>
	);
};

Code.propTypes = {
	algorithmCode: PropTypes.arrayOf(PropTypes.string).isRequired,
	code: PropTypes.arrayOf(PropTypes.number)
};

Code.defaultProps = {
	code: []
};

export default Code;
