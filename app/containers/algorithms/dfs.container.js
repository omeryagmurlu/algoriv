import { GraphAlgorithmFactory } from '../algorithm.factory';

const DFS = GraphAlgorithmFactory({
	name: 'DFS',
	steps: [
		v => `Run DFS from vertex ${v}`,
		q => `Stack is not empty, contains vertexes ${q.join(', ')}`,
		v => `Processing vertex ${v}`,
		v => `Mark vertex ${v} visited`,
		(u, v) => `Extending to neighbour ${u} of vertex ${v}`,
		u => `Vertex ${u} is visited`,
		u => `Vertex ${u} is not visited, push to queue`,
		s => `DFS(${s}) completed`
	],
	code: [
		'DFS(s):',
		'    S = {s}; // LIFO',
		'    while S is not empty',
		'        v = S.front(); S.pop();',
		'        mark v visited',
		'        for each neighbour u of v',
		'            if u is visited already, continue;',
		'            else, S.push(u);'
	],
	initialInput: {
		startVertex: 5
	},
	defaultGraph: {
		nodeCount: 6,
		edges: [
			[1, 2, 4],
			[0, 3],
			[0, 3, 1, 2],
			[1, 2, 4],
			[0, 3, 5],
			[4, 2]
		]
	},
	logic: ({ input: { startVertex: st, graph } }, snapFactory) => {
		const q = [];
		const vis = Array(graph.nodeCount).fill(false);

		const snap = snapFactory(vis, q);

		snap([], undefined);
		q.push(st);
		snap([0, 1], DFS.steps[0](st), st);
		while (q.length !== 0) {
			snap([2], DFS.steps[1](q));
			const v = q.pop();
			snap([3], DFS.steps[2](v), v);
			vis[v] = true;
			snap([4], DFS.steps[3](v), v);
			graph.edges[v].forEach(u => {
				snap([5], DFS.steps[4](v, u), u, [v, u]);
				if (vis[u]) {
					snap([6], DFS.steps[5](u), u, [v, u]);
					return;
				}
				q.push(u);
				snap([7], DFS.steps[6](u), u, [v, u]);
			});
		}
		snap([], DFS.steps[7](st));
	}
});

export default DFS;
