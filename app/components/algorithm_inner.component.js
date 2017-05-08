/* eslint global-require: "off" */

import React from 'react';
import PropTypes from 'prop-types';
import _mapValues from 'lodash.mapvalues';
import SideDrawer from './side-drawer.component';

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
				...statics[moduleId].data,
				...directives[moduleId]
			})
	));

	return (
		<section
			style={{
				display: 'flex',
				justifyContent: 'space-between'
			}}
		>
			<section>
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
	algorithmStatic: PropTypes.object.isRequired
};

export default AlgorithmInner;
