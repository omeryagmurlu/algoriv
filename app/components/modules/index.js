/* eslint global-require: "off" */

const modules = {
	code: require('app/components/modules/code.module').default,
	explanation: require('app/components/modules/explanation.module').default,
	graph: require('app/components/modules/graph.module').default,
	table: require('app/components/modules/table.module').default,
	description: require('app/components/modules/description.module').default
};

export default modules;
