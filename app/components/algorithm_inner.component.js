/* eslint global-require: "off" */

import React from 'react';
import PropTypes from 'prop-types';

// I hate webpack
// const components = ((comps => comps.reduce((acc, v) => {
// 	acc[v] = require(`./${v}.component`);
// 	return acc;
// }, {}))([
// 	'code', 'explanation', 'graph', 'queue', 'table'
// ]))

const components = {
	code: require('./modules/code.component').default,
	explanation: require('./modules/explanation.component').default,
	graph: require('./modules/graph.component').default,
	table: require('./modules/table.component').default
};

const AlgorithmInner = props => {
	const { animationDirectives: directives, algorithmStatic: statics, ...passProps } = props;

	const modules = Object.keys(statics).map(moduleId =>
		React.createElement(components[statics[moduleId].type], {
			...passProps,
			id: moduleId,
			key: moduleId,
			...statics[moduleId].data,
			...directives[moduleId]
		})
	);

	// const modules = flatten(Object.keys(rule).map(type =>
	// 	rule[type].map((specifics, i) =>
	// 		React.createElement(components[type], {
	// 			index: i,
	// 			...passProps,
	// 			key: type + i, // eslint-disable-line react/no-array-index-key
	// 			[type]: specifics
	// 		}))));

	return React.createElement('section', null, ...modules);
};

AlgorithmInner.propTypes = {
	animationDirectives: PropTypes.object.isRequired,
	algorithmStatic: PropTypes.object.isRequired
};

export default AlgorithmInner;
