import { GraphAlgorithmFactory } from '../algorithm.factory';
import { typee } from '../../utils';

const steps = [
	v => `Run BFS from vertex ${v}`,
	q => `Queue is not empty, contains vertexes ${q.join(', ')}`,
	v => `Processing vertex ${v}`,
	v => `Mark vertex ${v} visited`,
	(u, v) => `Extending to neighbour ${u} of vertex ${v}`,
	u => `Vertex ${u} is visited`,
	u => `Vertex ${u} is not visited, push to queue`,
	s => `BFS(${s}) completed`
];

const code = [
	'BFS(s):',
	'    Q = {s}; // FIFO',
	'    while Q is not empty',
	'        v = Q.front(); Q.pop();',
	'        mark v visited',
	'        for each neighbour u of v',
	'            if u is visited already, continue;',
	'            else, Q.push(u);'
];

const snap = (vis, q, highlightCode, explanation, currentNode, currentEdge) => ({
	code: [highlightCode],
	explanation: [explanation],
	graph: [{
		currentNode,
		currentEdge,
		pastNodes: vis.map((v, i) =>
			((v !== true) ? -1 : i)).filter(v => (v !== -1)), // to high
		futureNodes: q.map(v => v),
	}],
	table: [
		{
			width: 150,
			columns: [
				{ title: 'Node' },
				{ title: 'Visited' }
			],
			data: vis.map((Visited, Node) => ({
				Visited: Visited.toString(),
				Node
			}))
		},
		{
			width: 75,
			columns: [
				{ title: 'Queue' }
			],
			data: q.map((Queue) => ({
				Queue
			}))
		},
	]
});

const BFS = GraphAlgorithmFactory({
	name: 'BFS',
	input: {
		startVertex: 5,
		graph: {
			nodeCount: 6,
			edges: [
				[1, 2, 4],
				[0, 3],
				[0, 3],
				[1, 2, 4],
				[0, 3, 5],
				[4]
			]
		}
	},
	output: ({ graph }) => ({ // tum keyleri iterate etcez, burdakilerin
		kod: typee('code', { code }),
		explain: typee('explanation'),
		graph: typee('graph', graph),
		queue: typee('table', {
			width: 75,
			columns: [
				{ title: 'Queue' }
			]
		}),
		visit: typee('table', {
			width: 150,
			columns: [
				{ title: 'Node' },
				{ title: 'Visited' }
			]
		}),

	}),
	logic: ({ input: { startVertex: st, graph } }, snapFactory) => {
		const q = [];
		const vis = Array(graph.nodeCount).fill(false);

		const snap = snapFactory(vis, q);

		snap([], undefined);
		q.push(st);
		snap([0, 1], steps[0](st), st);
		while (q.length !== 0) {
			snap([2], steps[1](q));
			const v = q.shift();
			snap([3], steps[2](v), v);
			vis[v] = true;
			snap([4], steps[3](v), v);
			graph.edges[v].forEach(u => {
				snap([5], steps[4](u, v), u, [v, u]);
				if (vis[u]) {
					snap([6], steps[5](u), u, [v, u]);
					return;
				}
				q.push(u);
				snap([7], steps[6](u), u, [v, u]);
			});
		}
		snap([], steps[7](st));
	}
});

export default BFS;
