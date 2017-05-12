import React from 'react';
import { getEvents } from 'app/utils';
import { child, primary, secondary } from './style.scss';

const BigButton = props => (
	<div
		{...getEvents(props)}
		className={child}
		style={{
			width: `calc((100% - (20px * ${props.cols})) / ${props.cols})` // FIXME: must get the 20px from sccs file
		}}
	>
		<div className={primary} {...getEvents(props)}>{props.name}</div>
		<div className={secondary} {...getEvents(props)}>{props.desc}</div>
	</div>
);

BigButton.defaultProps = {
	cols: 1
};

export default BigButton;
