import { typee, ColorList } from './utils';

const exporter = (snap, module) => ({ snap, module });

const Modules = {};

export const GraphModule = Modules.Graph = exporter(
	clist => ({
		colors: clist
	}),
	graph => typee('graph', graph)
);

export const TableModule = Modules.Table = exporter(
	data => ({ data }),
	(width, cols) => typee('table', {
		width,
		columns: cols.map(v => ({ title: v }))
	})
);

// o--o--o--o--o

export const TableFuncModule = Modules.TableFunc = (title, width = 75) => exporter(
	q => TableModule.snap(q.map(v => ({
		[title]: v
	}))),
	() => TableModule.module(width, [title])
);

// o--o--o--o--o

export const CodeModule = Modules.Code = exporter(
	highlights => ({ highlights }), // array of indexes
	code => typee('code', { code })
);

export const ExplanationModule = Modules.Explanation = exporter(
	text => ({ text }), // string
	() => typee('explanation')
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
	graph => GraphModule.module(graph)
);

export const QueueModule = Modules.Queue = exporter(
	q => TableModule.snap(q.map(v => ({
		Queue: v // Queue is the dataIndex
	}))),
	() => TableModule.module(75, ['Queue'])
);

export const VisitedArrayModule = Modules.VisitedArray = exporter(
	vis => TableModule.snap(vis.map((Visited, Node) => ({
		Visited: Visited.toString(),
		Node
	}))),
	() => TableModule.module(150, ['Node', 'Visited'])
);

export default Modules;
