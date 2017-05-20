/* eslint global-require: "off" */

import Code from './code.module';
import Explanation from './explanation.module';
import Graph from './graph.module';
import Table from './table.module';
import Description from './description.module';
import ExampleGraphs from './examples.module';


const modules = {
	code: Code,
	explanation: Explanation,
	graph: Graph,
	table: Table,
	description: Description,
	examples: ExampleGraphs
};

export default modules;
