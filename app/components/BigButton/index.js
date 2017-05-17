import React from 'react';
import PropTypes from 'prop-types';
import { getEvents, themedStyle } from 'app/utils';
import style from './style.scss';
import { margin } from './variables.json';

const css = themedStyle(style);

const BigButton = props => (
	<button
		{...getEvents(props)}
		className={css('child', props.theme)}
		style={{
			width: `calc((100% - (${margin} * ${props.cols})) / ${props.cols})`
		}}
	>
		<div className={css('primary', props.theme)} {...getEvents(props)}>{props.name}</div>
		<div className={css('secondary', props.theme)} {...getEvents(props)}>{props.desc}</div>
	</button>
);

BigButton.defaultProps = {
	cols: 1,
	desc: null
};

BigButton.propTypes = {
	theme: PropTypes.string.isRequired,
	cols: PropTypes.number,
	name: PropTypes.string.isRequired,
	desc: PropTypes.string
};

export default BigButton;
