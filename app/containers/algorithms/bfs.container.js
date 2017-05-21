import Modules from 'app/features/modules';
import { InitInput } from 'app/features/input-types';
import { randomGraph, suitingGraphs } from 'app/data/graphs';

import AlgorithmFactory from 'app/containers/AlgorithmContainer';


const description = `
Breadth-first search (BFS) is an algorithm for traversing or searching tree \
or graph data structures. It starts at the tree root (or some arbitrary node \
of a graph, sometimes referred to as a 'search key') and explores the \
neighbor nodes first, before moving to the next level neighbors.

BFS was invented in the late 1950s by E. F. Moore, who used it to find the shortest \
path out of a maze, and discovered independently by C. Y. Lee as a wire routing algorithm (published 1961).
`;

const code = [
	'BFS(s):',
	'    Q = {s}; // FIFO',
	'    while Q is not empty',
	'        v = Q.front(); Q.pop();',
	'        if v is visited already, continue;',
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
		startVertex: '0'
	},
	inputType: {
		graph: [Modules.Graph.input(), Modules.ExampleGraphs.input()],
		startVertex: InitInput('Starting Vertex', (sV, { graph }) => !graph.hasNode(sV) && `node doesn't exist (${sV})`)
	},
	snap: (vis, q, hgs, text, cN, cE) => ({
		kod: Modules.Code.snap(hgs),
		explain: Modules.Explanation.snap(text),
		graf: Modules.VisitedAheadGraph.snap(cE, cN, vis, q),
		queue: Modules.Queue.snap(q),
		visit: Modules.VisitedArray.snap(vis)
	}),
	modules: settings => ({
		kod: Modules.Code.module(code),
		explain: Modules.Explanation.module(),
		graf: Modules.VisitedAheadGraph.module(),
		queue: Modules.Queue.module(),
		visit: Modules.VisitedArray.module(),
		desc: Modules.Description.module(description),
		exxx: Modules.ExampleGraphs.module(suitingGraphs('BFS'), settings)
	}),
	logic: ({ startVertex: st, graph }, rawSnap) => {
		const q = [];
		const vis = Array(graph.order).fill(false);

		const snap = (...par) => rawSnap(vis, q, ...par);

		snap([], undefined);
		q.push(st);
		snap([0, 1], `Run BFS from vertex ${st}`, st);
		while (q.length !== 0) {
			// snap([2], `Queue is not empty, contains vertexes ${q.join(', ')}`);
			const v = q.shift();
			snap([3], `Processing vertex ${v}`, v);
			if (vis[v]) {
				snap([4], `Vertex ${v} is visited`, v);
				continue; // eslint-disable-line no-continue
			}
			vis[v] = true;
			snap([5], `Mark vertex ${v} visited`, v);
			graph.outNeighbors(v).forEach(u => {
				// snap([6], `Extending to neighbour ${u} of vertex ${v}`, v, graph.edge(v, u));
				if (vis[u]) {
					snap([7], `Vertex ${u} is visited`, v, graph.edge(v, u));
					return;
				}
				q.push(u);
				snap([8], `Vertex ${u} is not visited, push to queue`, v, graph.edge(v, u));
			});
		}
		snap([], `BFS(${st}) completed`);
	}
});

export default BFS;
