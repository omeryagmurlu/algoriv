import _mapValues from 'lodash.mapvalues';
import { ColorList, labelizer } from 'app/utils';

const typee = (type, layout, data = {}) => ({
	type,
	layout: typeof layout === 'string'
		? {
			location: layout,
			order: 0
		}
		: layout,
	data
});

const exporter = (snap, module, input = () => () => ({})) => ({ snap, module, input });

const Modules = {};

export const GraphModuleData = {
	layouts: ['forceLink', 'dagre', 'fruchtermanReingold']
};
export const GraphModule = Modules.Graph = exporter(
	(clist, customLabels, optMutatingGraph) => ({
		colors: clist,
		customLabels,

		// This is only viable for snap, as it is used in logic, in a module, it wouldn't get updated
		graph: optMutatingGraph
	}),
	(layout, settings) => typee('graph', 'main', {
		layout: layout || settings('options')('graph')('layout').get()
	}),
	(GRAPH, STARTVERTEX) => input => ({
		graph: input[GRAPH].value,
		updateGraph: input[GRAPH].update,
		canRemoveThisNode: v => !(input[STARTVERTEX] && v === input[STARTVERTEX].value)
	})
);

const colorAdd = (nodesList, edgesList) => {
	const ret = new ColorList();
	nodesList.forEach(nodes => ret.pushNodes(Array.isArray(nodes) ? nodes : [nodes]));
	edgesList.forEach(edges => ret.pushEdges(Array.isArray(edges) ? edges : [edges]));
	return ret;
};

export const GeometryModule = Modules.Geometry = exporter(
	(nodesList, edgesList, optData) => {
		const clist = colorAdd(nodesList, edgesList);
		return {
			colors: clist,
			geometry: optData,
		};
	},
	() => typee('geometry', 'main'),
	(GEO, STARTVERTEX) => input => ({
		geometry: input[GEO].value,
		updateGeometry: input[GEO].update,
		canRemoveThisNode: v => !(input[STARTVERTEX] && v === input[STARTVERTEX].value)
	})
);

export const TableModule = Modules.Table = exporter(
	// convert columns to rows
	(columnsData, optColumns) => ({
		data: Array(columnsData.reduce((acc, v) => Math.max(acc, v.length), 0)).fill(1).map((_, i) =>
			columnsData.reduce((acc, v) => {
				acc.push(v[i]);
				return acc;
			}, [])
		),
		columns: optColumns
	}),
	(columns, height = 150, width = undefined) => typee('table', 'right', {
		height,
		width,
		columns
	})
);

export const TextModule = Modules.Text = exporter(
	text => ({ text }), // string
	(text, side = 'right') => typee('text', side, { text })
);

export const ExamplesModule = Modules.Examples = exporter(
	() => ({}),
	(stuffName, examples, parser = x => x, settings) => typee('examples', {
		location: 'left',
		order: -100
	}, {
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
		}),
		renameCustom: (name, newName) => settings('examples')(stuffName).set(prev => {
			prev[prev.map(v => v.name).indexOf(name)].name = newName;
			return prev;
		})
	})
);

export const CodeModule = Modules.Code = exporter(
	highlights => ({ highlights }), // array of indexes
	code => typee('code', {
		location: 'right',
		order: 100
	}, { code })
);

export const ExampleGraphsModule = Modules.ExampleGraphs = exporter(
	ExamplesModule.snap,
	(graphs, ...rest) => ExamplesModule.module('Graph', graphs.map(({ name, graph }) => ({
		name,
		data: graph
	})), undefined, ...rest),
	(GRAPH, STARTVERTEX) => input => ({
		getCurrentInput: () => input[GRAPH].value,
		updateInput: (newGraph) => {
			const cont = () => input[GRAPH].update(newGraph);
			if (input[STARTVERTEX]) {
				return input[STARTVERTEX].update('0', cont);
			}
			cont();
		}
	})
);

export const ExampleGeometrysModule = Modules.ExampleGeometrys = exporter(
	ExamplesModule.snap,
	(graphs, ...rest) => ExamplesModule.module('Geometry', graphs.map(({ name, canvas }) => ({
		name,
		data: canvas
	})), undefined, ...rest),
	(GEO, STARTVERTEX) => input => ({
		getCurrentInput: () => input[GEO].value,
		updateInput: (newGraph) => {
			const cont = () => input[GEO].update(newGraph);
			if (input[STARTVERTEX]) {
				return input[STARTVERTEX].update('0', cont);
			}
			cont();
		}
	})
);

export const DescriptionModule = Modules.Description = exporter(
	() => ({}),
	(text) => typee('description', 'left', { text })
);

export const RefinedGraphModule = Modules.RefinedGraph = exporter(
	(nodesList, edgesList, glyphs = [], ...params) => {
		const clist = colorAdd(nodesList, edgesList);

		return GraphModule.snap(clist, glyphs.map(v => _mapValues(v, labelizer)), ...params);
	},
	(...p) => GraphModule.module(...p),
	(...p) => GraphModule.input(...p)
);

export const NodedTableModule = Modules.NodedTable = exporter(
	(vis = {}) => TableModule.snap([
		Object.keys(vis),
		Object.keys(vis).map(k => vis[k].toString())
	]),
	(colName) => TableModule.module(['Node', colName], 200)
);

export default Modules;
