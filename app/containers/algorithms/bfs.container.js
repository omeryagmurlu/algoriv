import Modules from 'app/features/modules';
import { InitInput, CustomInput } from 'app/features/input-types';
import { randomGraph } from 'app/data/graphs';

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
		graph: randomGraph('BFS').graph,
		startVertex: 0
	},
	inputType: {
		graph: CustomInput(),
		startVertex: InitInput('Starting Vertex', (sV, { graph }) => !graph.hasNode(sV) && `node doesn't exist (${sV})`)
	},
	snap: (vis, q, hgs, text, cN, cE) => ({
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
	logic: ({ startVertex: st, graph }, rawSnap) => {
		const q = [];
		const vis = Array(graph.order).fill(false);

		const snap = (...par) => rawSnap(vis, q, ...par);

		snap([], undefined);
		q.push(st);
		snap([0, 1], steps[0](st), st);
		while (q.length !== 0) {
			snap([2], steps[1](q));
			const v = q.shift();
			snap([3], steps[2](v), v);
			vis[v] = true;
			snap([4], steps[3](v), v);
			graph.neighbors(v).forEach(u => {
				snap([5], steps[4](u, v), u, graph.edge(v, u));
				if (vis[u]) {
					snap([6], steps[5](u), u, graph.edge(v, u));
					return;
				}
				q.push(u);
				snap([7], steps[6](u), u, graph.edge(v, u));
			});
		}
		snap([], steps[7](st));
	}
});

export default BFS;
