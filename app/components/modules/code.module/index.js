import React from 'react';
import PropTypes from 'prop-types';
import { themedStyle } from 'app/utils';

import style from './style.scss';

const css = themedStyle(style);

const Code = props => {
	const lineTags = Array(props.code.length).fill('');
	props.highlights.forEach((idx => (lineTags[idx] = css('active'))));
	const lines = props.code.map((line, i) => <p key={line + i} className={lineTags[i]}>{line}</p>);
	return (
		<div className={css('code', props.theme)}>
			{lines}
		</div>
	);
};

Code.defaultProps = {
	highlights: []
};

Code.propTypes = {
	code: PropTypes.arrayOf(PropTypes.string).isRequired,
	theme: PropTypes.string.isRequired,
	highlights: PropTypes.arrayOf(PropTypes.number),
};

export default Code;
