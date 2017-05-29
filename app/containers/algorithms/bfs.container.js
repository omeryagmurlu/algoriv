import Modules from 'app/features/modules';
import { InitInput } from 'app/features/input-types';
import { vis2array } from 'app/utils';
import { randomGraph, suitingGraphs } from 'app/data/graphs';

import AlgorithmFactory from 'app/containers/AlgorithmContainer';

const queueModule = Modules.TableFunc(['Queue'], 150);

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
		graph: [Modules.Graph.input().graph, Modules.ExampleGraphs.input()],
		startVertex: [Modules.Graph.input().startNode, InitInput('Starting Vertex', (sV, { graph }) => !graph.hasNode(sV) && `node doesn't exist (${sV})`)]
	},
	snap: (vis, q, posEd, hgs, text, cN, cE) => ({
		kod: Modules.Code.snap(hgs),
		explain: Modules.Text.snap(text),
		graf: Modules.RefinedGraph.snap(
			[vis2array(vis), q, cN],
			[posEd, cE]
		),
		queue: queueModule.snap(q), // didn't wrap like [q] intended! look like a queue
		visit: Modules.NodedTableFunc('Visited').snap(vis)
	}),
	modules: settings => ({
		kod: Modules.Code.module(code),
		explain: Modules.Text.module(),
		graf: Modules.RefinedGraph.module(),
		queue: queueModule.module(),
		visit: Modules.NodedTableFunc('Visited').module(),
		desc: Modules.Description.module(description),
		exxx: Modules.ExampleGraphs.module(suitingGraphs('BFS'), settings)
	}),
	logic: ({ startVertex: st, graph }, rawSnap) => {
		const q = [];
		const parentQ = [];
		const posEd = [];
		const vis = graph.nodes().reduce((acc, v) => {
			acc[v] = false;
			return acc;
		}, {});

		const snap = (...par) => rawSnap(vis, q, posEd, ...par);

		snap([], undefined);
		q.push(st);
		parentQ.push(undefined);
		snap([0, 1], `Run BFS from vertex ${st}`, st);
		while (q.length !== 0) {
			// snap([2], `Queue is not empty, contains vertexes ${q.join(', ')}`);
			const v = q.shift();
			const parent = parentQ.shift();
			snap([3], `Processing vertex ${v}`, v);
			if (vis[v]) {
				snap([4], `Vertex ${v} is visited`, v);
				continue; // eslint-disable-line no-continue
			}
			vis[v] = true;
			if (parent) {
				posEd.push(graph.edge(parent, v));
			}
			snap([5], `Mark vertex ${v} visited`);
			graph.outNeighbors(v).forEach(u => {
				// snap([6], `Extending to neighbour ${u} of vertex ${v}`, v, graph.edge(v, u));
				if (vis[u]) {
					snap([7], `Vertex ${u} is visited`, v, graph.edge(v, u));
					return;
				}
				q.push(u);
				parentQ.push(v);
				snap([8], `Vertex ${u} is not visited, push to queue`, v, graph.edge(v, u));
			});
		}
		snap([], `BFS(${st}) completed`);
	}
});

export default BFS;
