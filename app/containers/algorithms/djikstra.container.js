import Algorithm from 'app/features/algorithm-helpers';
import { vis2array, DataStructures } from 'app/utils';

const Djikstra = Algorithm('Djikstra', 'graph');
Djikstra.addStartingNodeInput();

Djikstra.addDescription(`
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
`);

Djikstra.addCode([
	'Djikstra(s):',
	'    enqueue pair(s, 0) // Min-PriorityQueue',
	'    while pq is not empty',
	'         retrieve node v and distance d -> dequeue',
	'         if v is visited continue',
	'         else mark node visited',
	'         for every neighbor u of v',
	'             enqueue pair(u, d + weight)'
]);

Djikstra.addNodedTable('shortest', 'Distance');
Djikstra.addNodedTable('visited', 'Visited');
Djikstra.logic = ({ startVertex: st, graph }, snipe) => {
	const alg = Djikstra.algorithm;

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

	const snap = (a, b, c, d) => {
		alg.visited(vis);
		alg.graph.setColor(0, vis2array(vis), posEdges);
		alg.graph.setGlyphs(distance);
		alg.shortest(distance);

		alg.code(a);
		alg.explanation(b);
		alg.graph.setColor(1, c, d);
		snipe();
	};

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
};

export default Djikstra.create();
