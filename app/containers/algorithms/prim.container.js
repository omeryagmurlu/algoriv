import Algorithm from 'app/features/algorithm-helpers';
import _sample from 'lodash.sample';
import { vis2array, DataStructures, graphologyImportFix as gimport, visCreator } from 'app/utils';

const Prim = Algorithm('Prim', 'graph');

Prim.addDescription(`
A **minimum spanning tree** (MST) or minimum weight spanning tree is a subset of \
the edges of a connected, edge-weighted undirected graph that **connects all the \
vertices** together, without any cycles and **with the minimum possible total edge \
weight**. That is, it is a spanning tree whose sum of edge weights is as small as \
possible. Directed graph equivalent of a MST is a minimum spanning arborescence.

---

**Prim's algorithm** operates by building this tree **one vertex at a time**, from an \
**arbitrary starting vertex**, at each step adding the cheapest possible connection \
from the tree to another vertex.

The algorithm was developed in 1930 by Czech mathematician Vojtěch Jarník and later \
rediscovered and republished by computer scientists Robert C. Prim in 1957 and \
Edsger W. Dijkstra in 1959.
`);

Prim.addCode([
	'Prim():',
	'    enqueue pair(s: arbitrary node, 0) // Min-PriorityQueue',
	'    while pq is not empty',
	'         retrieve node v and connection cost -> dequeue',
	'         if v is visited continue',
	'         else add cost to sum and mark node visited',
	'         for every neighbor u of v',
	'             enqueue pair(u, weight of edge v -> u)'
]);

Prim.addText('sum');
Prim.addNodedTable('visited', 'Visited');

Prim.logic = ({ graph: gNonParse }, snipe) => {
	const graph = gimport(gNonParse);
	const starting = _sample(graph.nodes());
	const alg = Prim.algorithm;

	const pair = (id, weight, parent) => ({ id, weight, parent });
	let ans = 0;

	const posEdges = [];
	const keyy = graph.nodes().reduce((acc, v) => {
		acc[v] = Infinity;
		return acc;
	}, {});
	const vis = visCreator(graph);

	const snap = (hgs, text, cn, ce) => {
		alg.code(hgs);
		alg.graph.setColor(0, vis2array(vis), posEdges);
		alg.graph.setColor(1, cn, ce);
		alg.graph.setGlyphs(keyy);
		alg.explanation(text);
		alg.sum(`MST Cost: ${ans}`);
		alg.visited(vis);
		snipe();
	};

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
	snap([0], `Starting MST-Prim from arbitrary node ${starting}`, starting);
	pq.enqueue(pair(starting, 0));
	snap([1], `Enqueue the starting node ${starting} with connection cost of 0`, starting);
	while (!pq.isEmpty()) {
		const { weight, id: v, parent } = pq.dequeue();
		snap([2, 3], `Dequeued node ${v} with connection cost ${weight}`, v);
		if (vis[v]) {
			snap([4], `Node ${v} is visited, continue`, v);
			continue; // eslint-disable-line no-continue
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
	snap([], `MST-Prim from ${starting} completed, MST is ${ans}`);
};

export default Prim.create();
