import Modules from 'App/features/modules';
import AlgorithmFactory from '../algorithm.factory';

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
	'        for each neighbour u of v:',
	'            if u is visited already, continue;',
	'            else, Q.push(u);'
];

const BFS = AlgorithmFactory({
	info: {
		name: 'BFS'
	},
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
	snap: (vis, q) => (hgs, text, cN, cE) => ({
		kod: Modules.Code.snap(hgs),
		explain: Modules.Explanation.snap(text),
		graph: Modules.VisitedAheadGraph.snap(cE, cN, vis, q),
		queue: Modules.Queue.snap(q),
		visit: Modules.VisitedArray.snap(vis)
	}),
	modules: ({ graph }) => ({
		kod: Modules.Code.module(code),
		explain: Modules.Explanation.module(),
		graph: Modules.VisitedAheadGraph.module(graph),
		queue: Modules.Queue.module(),
		visit: Modules.VisitedArray.module()
	}),
	logic: ({ startVertex: st, graph }, snapFactory) => {
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
