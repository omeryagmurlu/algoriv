import Modules from 'app/features/modules';
import { InitInput } from 'app/features/input-types';
import { randomGraph, suitingGraphs } from 'app/data/graphs';
import { vis2array } from 'app/utils';
import { DataStructures } from 'app/utils';

import AlgorithmFactory from 'app/containers/AlgorithmContainer';

const description = `
A minimum spanning tree (MST) or minimum weight spanning tree is a subset of \
the edges of a connected, edge-weighted undirected graph that connects all the \
vertices together, without any cycles and with the minimum possible total edge \
weight. That is, it is a spanning tree whose sum of edge weights is as small as \
possible. Directed equivalent of a MST is a minimum spanning arborescence.

Prim's algorithm operates by building this tree one vertex at a time, from an \
arbitrary starting vertex, at each step adding the cheapest possible connection \
from the tree to another vertex.

The algorithm was developed in 1930 by Czech mathematician Vojtěch Jarník and later \
rediscovered and republished by computer scientists Robert C. Prim in 1957 and \
Edsger W. Dijkstra in 1959.
`;

const code = [
	'Prim(s):',
	'    enqueue pair(s, 0) // Min-PriorityQueue',
	'    while pq is not empty',
	'         retrieve node v and connection cost -> dequeue',
	'         if v is visited continue',
	'         else add cost to sum and mark node visited',
	'         for every neighbor u of v',
	'             enqueue pair(u, weight of edge v -> u)'
];

const Prim = AlgorithmFactory({
	info: {
		name: 'Prim'
	},
	input: {
		graph: randomGraph('Prim').graph,
		startVertex: '0'
	},
	inputType: {
		graph: [Modules.Graph.input(), Modules.ExampleGraphs.input()],
		startVertex: InitInput('Starting Vertex', (sV, { graph }) => !graph.hasNode(sV) && `node doesn't exist (${sV})`)
	},
	snap: (short, vis, posEdges, sum, hgs, text, cn, ce) => ({
		kod: Modules.Code.snap(hgs),
		graf: Modules.RefinedGraphFunc(2).snap(
			[vis2array(vis), cn],
			[posEdges, ce],
			short
		),
		exp: Modules.Text.snap(text),
		sum: Modules.Text.snap(sum),
		vis: Modules.NodedTableFunc('Visited').snap(vis)
	}),
	modules: settings => ({
		kod: Modules.Code.module(code),
		graf: Modules.RefinedGraphFunc(2).module(),
		exp: Modules.Text.module(),
		sum: Modules.Text.module(),
		vis: Modules.NodedTableFunc('Visited').module(),
		desc: Modules.Description.module(description),
		exxx: Modules.ExampleGraphs.module(suitingGraphs('Prim'), settings)
	}),
	logic: ({ startVertex: st, graph }, rawSnap) => {
		const pair = (id, weight, parent) => ({ id, weight, parent });
		let ans = 0;

		const posEdges = [];
		const keyy = graph.nodes().reduce((acc, v) => {
			acc[v] = Infinity;
			return acc;
		}, {});
		const vis = graph.nodes().reduce((acc, v) => {
			acc[v] = false;
			return acc;
		}, {});
		const snap = (...p) => rawSnap(keyy, vis, posEdges, `MST Cost: ${ans}`, ...p);

		const pq = new DataStructures.PriorityQueue((a, b) => {
			if (a.weight > b.weight) { // MIN HEAP
				return -1;
			}
			if (a.weight < b.weight) {
				return 1;
			}
			return 0;
		});

		snap([], undefined);
		snap([0], `Starting MST-Prim from node ${st}`, st);
		pq.enqueue(pair(st, 0));
		snap([1], `Enqueue the starting node ${st} with connection cost 0`, st);
		while (!pq.isEmpty()) {
			const { weight, id: v, parent } = pq.dequeue();
			snap([2, 3], `Dequeued node ${v} with connection cost ${weight}`, v);
			if (vis[v]) {
				snap([4], `Node ${v} is visited, continue`, v);
				continue;
			}
			ans += weight;
			keyy[v] = weight;
			vis[v] = true;
			if (parent) {
				posEdges.push(graph.edge(parent, v));
			}
			snap([5], `Add cost ${weight} to sum and mark vertex ${v} visited`);
			graph.outNeighbors(v).forEach(u => {
				const newWeight = graph.getEdgeAttribute(v, u, 'weight');
				snap([6, 7], `Enqueue neighbor ${u} with connection cost ${newWeight}`, u, graph.edge(v, u));
				pq.enqueue(pair(u, newWeight, v));
			});
		}
		snap([], `MST-Prim from ${st} completed, MST is ${ans}`);
	}
});

export default Prim;
