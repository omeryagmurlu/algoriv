import { ColorList, graphologyImportFix as gimport } from 'app/utils';
import { ModuleInput } from 'app/features/input-types';
import InputsRegistry from 'app/data/inputsRegistry';

const typee = (type, layout, data = {}) => ({
	type,
	layout,
	data
});

const exporter = (snap, module, input) => ({ snap, module, input });

const Modules = {};

export const GraphModule = Modules.Graph = exporter(
	(clist, optMutatingGraph) => ({
		colors: clist,

		// This is only viable for snap, as it is used in logic, in a module, it wouldn't get updated
		optGraph: optMutatingGraph
	}),
	(options) => typee('graph', 'main', { options }),
	(ifMultiModuleId) => ModuleInput('graph', ifMultiModuleId, InputsRegistry.Graph)
);

export const TableModule = Modules.Table = exporter(
	// convert columns to rows
	columnsData => ({
		data: Array(columnsData.reduce((acc, v) => Math.max(acc, v.length), 0)).fill(1).map((_, i) =>
			columnsData.reduce((acc, v) => {
				acc.push(v[i]);
				return acc;
			}, [])
		)
	}),
	(width, columns) => typee('table', 'right', {
		width,
		columns
	})
);

export const ExamplesModule = Modules.Examples = exporter(
	() => ({}),
	(stuffName, examples, parser = x => x, settings) => typee('examples', 'left', {
		exampleGroup: stuffName,
		examples,
		customs: (settings('examples')(stuffName).get() || []).map(({ data, name }) => ({
			name,
			data: parser(data)
		})),
		addCustom: (name, data) => settings('examples')(stuffName).set((prev = []) => {
			prev.push({
				name,
				data
			});
			return prev;
		}),
		deleteCustom: (name) => settings('examples')(stuffName).set(prev => {
			prev.splice(prev.map(v => v.name).indexOf(name), 1);
			return prev;
		})
	}),
	(ifMultiModuleId) => ModuleInput('examples', ifMultiModuleId, InputsRegistry.Examples)
);

// o--o--o--o--o

export const TableFuncModule = Modules.TableFunc = (title, width = 75) => exporter(
	q => TableModule.snap([q]),
	() => TableModule.module(width, [title])
);

// o--o--o--o--o

export const CodeModule = Modules.Code = exporter(
	highlights => ({ highlights }), // array of indexes
	code => typee('code', 'right', { code })
);

export const ExampleGraphsModule = Modules.ExampleGraphs = exporter(
	ExamplesModule.snap,
	(graphs, ...rest) => ExamplesModule.module('Graph', graphs.map(({ name, graph }) => ({
		name,
		data: graph
	})), gimport, ...rest),
	ExamplesModule.input
);

export const ExplanationModule = Modules.Explanation = exporter(
	text => ({ text }), // string
	() => typee('explanation', 'right')
);

export const DescriptionModule = Modules.Description = exporter(
	() => ({}),
	(text) => typee('description', 'left', { text })
);

export const VisitedAheadGraphModule = Modules.VisitedAheadGraph = exporter(
	(currentEdge, currentNode, vis, q, ...params) => {
		const clist = new ColorList();

		clist.pushNodes(vis.map((v, i) => ((v !== true) ? -1 : i)).filter(v => (v !== -1))); // to high
		clist.pushNodes(q.map(v => v));
		clist.pushNode(currentNode);

		clist.setEdge(currentEdge, 2);

		return GraphModule.snap(clist, ...params);
	},
	(...p) => GraphModule.module(...p),
	(...p) => GraphModule.input(...p)
);

export const QueueModule = Modules.Queue = exporter(
	q => TableModule.snap([q]),
	() => TableModule.module(100, ['Queue'])
);

export const VisitedArrayModule = Modules.VisitedArray = exporter(
	vis => TableModule.snap([
		vis.map((v, i) => i),
		vis.map(v => v.toString())
	]),
	() => TableModule.module(200, ['Node', 'Visited'])
);

export default Modules;
