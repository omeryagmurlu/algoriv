import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { ifModuleEnabled } from 'app/utils';
import { container } from './style.scss';

const Description = props => ifModuleEnabled('description', props, (props.text && (
	<div className={container}>
		<Markdown source={props.text} />
	</div>
)) || null);

Description.propTypes = {
	text: PropTypes.string
};

Description.defaultProps = {
	text: ''
};

export default Description;
