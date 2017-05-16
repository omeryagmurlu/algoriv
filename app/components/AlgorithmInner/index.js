/* eslint global-require: "off" */

import React from 'react';
import PropTypes from 'prop-types';
import _mapValues from 'lodash.mapvalues';
import { themedStyle } from 'app/utils';
import SideDrawer from 'app/components/SideDrawer';

import style from './style.scss';

const css = themedStyle(style);

const components = {
	code: require('app/components/modules/code.module').default,
	explanation: require('app/components/modules/explanation.module').default,
	graph: require('app/components/modules/graph.module').default,
	table: require('app/components/modules/table.module').default,
	description: require('app/components/modules/description.module').default
};

const AlgorithmInner = props => {
	const {
		animationDirectives: directives,
		algorithmStatic: statics,
		algorithmCustomInput: inputs,
		...passProps
	} = props;

	const parts = _mapValues({
		main: 0,
		right: 0,
		left: 0
	}, (_, lay) => Object.keys(statics).filter(moduleId =>
		statics[moduleId].layout === lay).map(moduleId =>
			React.createElement(components[statics[moduleId].type], {
				...passProps,
				id: moduleId,
				key: moduleId,
				theme: props.theme,
				input: data => {
					if (inputs.fields.includes(moduleId)) {
						inputs.handler({ [moduleId]: data });
					}
				},
				...statics[moduleId].data,
				...directives[moduleId]
			})
	));

	return (
		<section className={css('top')} >
			<section className={css('main')}>
				{parts.main}
			</section>
			<SideDrawer side="left" theme={props.theme} >
				{parts.left}
			</SideDrawer>
			<SideDrawer side="right" theme={props.theme} >
				{parts.right}
			</SideDrawer>
		</section>
	);
};

AlgorithmInner.propTypes = {
	animationDirectives: PropTypes.object.isRequired,
	algorithmStatic: PropTypes.object.isRequired,
	algorithmCustomInput: PropTypes.shape({
		fields: PropTypes.arrayOf(PropTypes.string).isRequired,
		handler: PropTypes.func.isRequired
	}).isRequired
};

export default AlgorithmInner;
