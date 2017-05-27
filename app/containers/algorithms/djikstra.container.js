import Modules from 'app/features/modules';
import { InitInput } from 'app/features/input-types';
import { vis2array, DataStructures } from 'app/utils';
import { randomGraph, suitingGraphs } from 'app/data/graphs';

import AlgorithmFactory from 'app/containers/AlgorithmContainer';

const description = `
Dijkstra's algorithm is an algorithm for finding the shortest paths between nodes in a graph, \
which may represent, for example, road networks. It was conceived by computer scientist Edsger \
W. Dijkstra in 1956 and published three years later.

The algorithm exists in many variants; Dijkstra's original variant found the shortest path \
between two nodes, but a more common variant fixes a single node as the "source" node \
and finds shortest paths from the source to all other nodes in the graph, producing a \
shortest-path tree.

The algorithm only works as long as we do not have edges with negative weights. Otherwise, there is no\
guarantee that when we pick u as the closest vertex, dist[v] for some other vertex v will not become\
smaller than dist[u] at some time in the future.
`;

const code = [
	'Djikstra(s):',
	'    enqueue pair(s, 0) // Min-PriorityQueue',
	'    while pq is not empty',
	'         retrieve node v and distance d -> dequeue',
	'         if v is visited continue',
	'         else mark node visited',
	'         for every neighbor u of v',
	'             enqueue pair(u, d + weight)'
];

const Djikstra = AlgorithmFactory({
	info: {
		name: 'Djikstra'
	},
	input: {
		graph: randomGraph('Djikstra').graph,
		startVertex: '0'
	},
	inputType: {
		graph: [Modules.Graph.input(), Modules.ExampleGraphs.input()],
		startVertex: InitInput('Starting Vertex', (sV, { graph }) => !graph.hasNode(sV) && `node doesn't exist (${sV})`)
	},
	snap: (short, vis, posEdges, hgs, text, cn, ce) => ({
		kod: Modules.Code.snap(hgs),
		graf: Modules.RefinedGraphFunc(2).snap(
			[vis2array(vis), cn],
			[posEdges, ce],
			short
		),
		shortest: Modules.NodedTableFunc('Distance').snap(short),
		vis: Modules.NodedTableFunc('Visited').snap(vis),
		exp: Modules.Text.snap(text)
	}),
	modules: settings => ({
		kod: Modules.Code.module(code),
		graf: Modules.RefinedGraphFunc(2).module(),
		exp: Modules.Text.module(),
		shortest: Modules.NodedTableFunc('Distance').module(),
		vis: Modules.NodedTableFunc('Visited').module(),
		desc: Modules.Description.module(description),
		exxx: Modules.ExampleGraphs.module(suitingGraphs('Djikstra'), settings)
	}),
	logic: ({ startVertex: st, graph }, rawSnap) => {
		const pair = (id, distance, parent) => ({ id, distance, parent });

		const posEdges = [];
		const distance = graph.nodes().reduce((acc, v) => {
			acc[v] = Infinity;
			return acc;
		}, {});
		const vis = graph.nodes().reduce((acc, v) => {
			acc[v] = false;
			return acc;
		}, {});
		const snap = (...p) => rawSnap(distance, vis, posEdges, ...p);

		const pq = new DataStructures.PriorityQueue((a, b) => {
			if (a.distance > b.distance) { // MIN HEAP
				return -1;
			}
			if (a.distance < b.distance) {
				return 1;
			}
			return 0;
		});

		snap([], undefined);
		snap([0], `Starting Djikstra from node ${st}`, st);
		pq.enqueue(pair(st, 0));
		snap([1], `Enqueue the starting node ${st} with the distance 0`, st);
		while (!pq.isEmpty()) {
			const { distance: dis, id: v, parent } = pq.dequeue();
			snap([2, 3], `Dequeued node ${v} with distance ${dis}`, v);
			if (vis[v]) {
				snap([4], `Node ${v} is visited, continue`, v);
				continue;
			}
			distance[v] = dis;
			vis[v] = true;
			if (parent) {
				posEdges.push(graph.edge(parent, v));
			}
			snap([5], `Mark ${v} visited`);
			graph.outNeighbors(v).forEach(u => {
				const weight = graph.getEdgeAttribute(v, u, 'weight');
				snap([6, 7], `Enqueue neighbor ${u} with distance ${weight + dis} (= weight ${weight} + v's distance ${dis})`, u, graph.edge(v, u));
				pq.enqueue(pair(u, weight + dis, v));
			});
		}
		snap([], `Djikstra from ${st} completed`);
	}
});

export default Djikstra;
