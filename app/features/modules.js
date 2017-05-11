import { ColorList } from 'App/utils';

const typee = (type, layout, data = {}) => ({
	type,
	layout,
	data
});

const exporter = (snap, module) => ({ snap, module });

const Modules = {};

export const GraphModule = Modules.Graph = exporter(
	clist => ({
		colors: clist
	}),
	(graph, options) => typee('graph', 'main', { graph, options })
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

export const ExplanationModule = Modules.Explanation = exporter(
	text => ({ text }), // string
	() => typee('explanation', 'right')
);

export const VisitedAheadGraphModule = Modules.VisitedAheadGraph = exporter(
	(currentEdge, currentNode, vis, q) => {
		const clist = new ColorList();

		clist.pushNodes(vis.map((v, i) => ((v !== true) ? -1 : i)).filter(v => (v !== -1))); // to high
		clist.pushNodes(q.map(v => v));
		clist.pushNode(currentNode);

		clist.setEdge(currentEdge, 2);

		return GraphModule.snap(clist);
	},
	graph => GraphModule.module(graph, {
		edgeWeight: true
	})
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
