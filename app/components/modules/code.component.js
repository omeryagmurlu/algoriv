import React from 'react';
import PropTypes from 'prop-types';
import { style, active, passive } from '../../styles/code.scss';

const Code = props => {
	const lineTags = Array(props.code.length).fill(passive);
	props.highlights.forEach((idx => (lineTags[idx] = active)));
	const lines = props.code.map((line, i) => <p key={line} className={lineTags[i]}>{line}</p>);
	return (
		<div className={style}>
			{lines}
		</div>
	);
};

Code.propTypes = {
	code: PropTypes.arrayOf(PropTypes.string).isRequired,
	highlights: PropTypes.arrayOf(PropTypes.number)
};

Code.defaultProps = {
	highlights: []
};

export default Code;
