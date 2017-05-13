/* eslint global-require: "off" */

import React from 'react';
import PropTypes from 'prop-types';
import _mapValues from 'lodash.mapvalues';
import SideDrawer from 'app/components/SideDrawer';

import styles from './style.scss';

// I hate webpack
// const components = ((comps => comps.reduce((acc, v) => {
// 	acc[v] = require(`./${v}.component`);
// 	return acc;
// }, {}))([
// 	'code', 'explanation', 'graph', 'queue', 'table'
// ]))

const components = {
	code: require('app/components/modules/code.component').default,
	explanation: require('app/components/modules/explanation.component').default,
	graph: require('app/components/modules/graph.component').default,
	table: require('app/components/modules/table.component').default
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
		<section className={styles.top} >
			<section className={styles.main}>
				{parts.main}
			</section>
			<SideDrawer side="left">
				{parts.left}
			</SideDrawer>
			<SideDrawer side="right">
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
