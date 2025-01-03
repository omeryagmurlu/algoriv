import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import { getEvents, themedStyle } from 'app/utils';
import style from './style.scss';
import { margin } from './variables.json';

const css = themedStyle(style);

const BigButton = props => (
	<div
		className={css('container', props.theme)}
		style={{
			width: `calc((100% - ((${margin} * 2) * ${props.cols - 1})) / ${props.cols})`,
			opacity: props.disabled ? 0.6 : 1
		}}
	>
		<FlatButton
			disabled={props.disabled}
			label="just to remove that warning"
			{...getEvents(props)}
		/>
		<div className={css('innerContainer')}>
			<div className={css('primary', props.theme)} {...getEvents(props)}>{props.name}</div>
			<div className={css('secondary', props.theme)} {...getEvents(props)}>{props.desc}</div>
		</div>
	</div>
);

BigButton.defaultProps = {
	cols: 1,
	desc: null,
	disabled: false,
};

BigButton.propTypes = {
	theme: PropTypes.string.isRequired,
	cols: PropTypes.number,
	name: PropTypes.string.isRequired,
	desc: PropTypes.string,
	disabled: PropTypes.bool,
};

export default BigButton;
