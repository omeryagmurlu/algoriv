/* eslint global-require: "off" */

import React from 'react';
import PropTypes from 'prop-types';
import { flatten } from '../utils';

// I hate webpack
// const components = ((comps => comps.reduce((acc, v) => {
// 	acc[v] = require(`./${v}.component`);
// 	return acc;
// }, {}))([
// 	'code', 'explanation', 'graph', 'queue', 'table'
// ]))

const components = {
	code: require('./code.component').default,
	explanation: require('./explanation.component').default,
	// graph: require('./graph.component').default,
	table: require('./table.component').default
};

const AlgorithmInner = props => {
	const rule = props.animationDirectives;
	const modules = flatten(Object.keys(rule).map(type =>
		rule[type].map((specifics, i) =>
			React.createElement(components[type], {
				...props,
				key: type + i, // eslint-disable-line react/no-array-index-key
				[type]: specifics
			}))));

	return React.createElement('section', null, ...modules);
};

AlgorithmInner.propTypes = {
	animationDirectives: PropTypes.object.isRequired
};

export default AlgorithmInner;
