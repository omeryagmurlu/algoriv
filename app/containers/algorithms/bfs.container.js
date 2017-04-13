import { GraphAlgorithmFactory } from '../algorithm.factory';

const BFS = GraphAlgorithmFactory({
	name: 'BFS',
	steps: [
		v => `Run BFS from vertex ${v}`,
		q => `Queue is not empty, contains vertexes ${q.join(', ')}`,
		v => `Processing vertex ${v}`,
		v => `Mark vertex ${v} visited`,
		(u, v) => `Processing the neighbour ${u} of vertex ${v}`,
		u => `Vertex ${u} is visited`,
		u => `Vertex ${u} is not visited, push to queue`,
		s => `BFS(${s}) completed`
	],
	code: [
		'BFS(s):',
		'    Q = {s}; // FIFO',
		'    while Q is not empty',
		'        v = Q.front(); Q.pop();',
		'        mark v visited',
		'        for each neighbour u of v',
		'            if u is visited already, continue;',
		'            else, Q.push(u);'
	],
	defaultGraph: {
		nodeCount: 6,
		edges: [
			[1, 2, 4],
			[0, 3],
			[0, 3],
			[1, 2, 4],
			[0, 3, 5],
			[4]
		]
	},
	logic: ({ startVertex: st, graph }, snapFactory) => {
		const q = [];
		const vis = Array(graph.nodeCount).fill(false);

		const snap = snapFactory(vis, q);

		snap([], undefined);
		q.push(st);
		snap([0, 1], BFS.steps[0](st), st);
		while (q.length !== 0) {
			snap([2], BFS.steps[1](q));
			const v = q.shift();
			snap([3], BFS.steps[2](v), v);
			vis[v] = true;
			snap([4], BFS.steps[3](v), v);
			graph.edges[v].forEach(u => {
				snap([5], BFS.steps[4](u, v), u, [u, v]);
				if (vis[u]) {
					snap([6], BFS.steps[5](u), u, [u, v]);
					return;
				}
				q.push(u);
				snap([7], BFS.steps[6](u), u, [u, v]);
			});
		}
		snap([], BFS.steps[7](st));
	}
});

export default BFS;
