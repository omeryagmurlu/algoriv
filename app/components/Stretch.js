import React from 'react';
import PropTypes from 'prop-types';

const Stretch = props => (
	<div
		style={{
			position: 'relative',
			height: '100%',
			...props.style
		}}
		className={props.className}
	>
		{props.children}
	</div>
);

Stretch.defaultProps = {
	style: {},
	className: ''
};

Stretch.propTypes = {
	children: PropTypes.any.isRequired,
	style: PropTypes.object,
	className: PropTypes.string
};

export default Stretch;
