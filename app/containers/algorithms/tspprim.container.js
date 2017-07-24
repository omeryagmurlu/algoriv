import { createFrom } from 'app/data/graphs';
import Algorithm from 'app/features/algorithm-helpers';
import { graphologyImportFix as gimport, griddyTable, visCreator, vis2array, MinPriq, connectAllNodes } from 'app/utils';

const TSP_PRIM = Algorithm('TSP_PRIM', 'geometry');
TSP_PRIM.addStartingNodeInput();

TSP_PRIM.addDescription(`
A traveling salesman is getting ready for a big sales tour. Starting at his hometown, suitcase\
in hand, he will conduct a journey in which each of his target cities is visited exactly once\
before he returns home. Given the pairwise distances between cities, what is the best order\
in which to visit them, so as to minimize the overall distance traveled?\
Denote the cities by 1, . . . , n, the salesman’s hometown being 1, and let D = (dij ) be the\
matrix of intercity distances. The goal is to design a tour that starts and ends at 1, includes\
all other cities exactly once, and has minimum total length. Figure 6.9 shows an example\
involving five cities. Can you spot the optimal tour? Even in this tiny example, it is tricky for\
a human to find the solution; imagine what happens when hundreds of cities are involved.\
It turns out this problem is also difficult for computers. In fact, the traveling salesman\
problem (TSP_PRIM) is one of the most notorious computational tasks. There is a long history of\
attempts at solving it, a long saga of failures and partial successes, and along the way, major\
advances in algorithms and complexity theory. The most basic piece of bad news about the\
TSP_PRIM, which we will better understand in Chapter 8, is that it is highly unlikely to be solvable\
in polynomial time.`
);

TSP_PRIM.addCode([
	'TSP_PRIM(S):',
	'    prim():',
	'        enqueue pair(s: arbitrary node, 0) // Min-PriorityQueue',
	'        while pq is not empty',
	'             retrieve node v and connection cost -> dequeue',
	'             if v is visited continue',
	'             else add cost to sum and mark node visited',
	'             for every neighbor u of v',
	'                 enqueue pair(u, weight of edge v -> u)',
	' ',
	'    traverse mst prorder'
]);

TSP_PRIM.addText('tspsum');
TSP_PRIM.addText('mstsum');

TSP_PRIM.addNodedTable('visited', 'Visited');
TSP_PRIM.addText('dmText', 'Distance Matrix');
TSP_PRIM.addTable('distanceMatrix', ['If you are seeing this column then we are fucked'], 500, 500);

TSP_PRIM.logic = ({ startVertex: st, geometry: gNonParse }, snipe) => {
	const graph = gimport(gNonParse);
	graph.dropEdges();
	const alg = TSP_PRIM.algorithm;

	connectAllNodes(graph);

	const pair = (id, weight, parent) => ({ id, weight, parent });
	const grid = griddyTable(graph.nodes(), graph.nodes(), graph.nodes().map(kfd =>
		graph.nodes().map(nn2 => (
			graph.edge(kfd, nn2) ? graph.getEdgeAttribute(kfd, nn2, 'weight') : '-'
		))), '❧');
	let mstans = 0;

	let nowmst = 1;

	let posEdges = [];
	let vis = visCreator(graph);

	const mstTree = gimport(createFrom('DirectedGraph', [
		[1],
	]));

	const preorder = [];

	const nodeListToEdges = (ll) => ll.map((v, l, a) => {
		if (a[l + 1]) {
			return graph.edge(v, a[l + 1]);
		}

		return undefined;
	}).filter(x => x);

	const snap = (hgs, text, cn, ce) => {
		alg.geometry.setOverrideGraph(graph);
		alg.geometry.setColor(0, preorder, nodeListToEdges(preorder));
		alg.geometry.setColor(1, vis2array(vis), posEdges);
		alg.geometry.setColor(2, cn, ce);

		if (nowmst === 2) {
			alg.tspsum(`TSP Cost: ${nodeListToEdges(preorder).map(e => graph.getEdgeAttribute(e, 'weight')).reduce((acc, v) => acc + v, 0)}`);
		}
		alg.mstsum(`MST Cost: ${mstans}`);
		alg.distanceMatrix(...grid);
		alg.code(hgs);
		alg.explanation(text);
		alg.visited(vis);
		snipe();
	};

	const pq = MinPriq();

	mstTree.dropNodes();

	snap([], undefined);
	snap([1], `Starting MST-Prim from arbitrary node ${st}`, st);
	pq.enqueue(pair(st, 0));
	snap([2], `Enqueue the st node ${st} with connection cost of 0`, st);
	while (!pq.isEmpty()) {
		const { weight, id: v, parent } = pq.dequeue();
		snap([3, 4], `Dequeued node ${v} with connection cost ${weight}`, v);
		if (vis[v]) {
			snap([5], `Node ${v} is visited, continue`, v);
			continue; // eslint-disable-line no-continue
		}
		mstTree.addNode(v, {
			x: graph.getNodeAttribute(v, 'x'),
			y: graph.getNodeAttribute(v, 'y'),
		});
		mstans += weight;
		vis[v] = true;
		if (parent) {
			mstTree.addEdgeWithKey(graph.edge(parent, v), parent, v, {
				weight: graph.getEdgeAttribute(parent, v, 'weight')
			});
			posEdges.push(graph.edge(parent, v));
		}
		snap([6], `Add cost ${weight} to sum and mark vertex ${v} visited`);
		graph.outNeighbors(v).forEach(u => {
			const newWeight = graph.getEdgeAttribute(v, u, 'weight');
			snap([7, 8], `Enqueue neighbor ${u} with connection cost ${newWeight}`, u, graph.edge(v, u));
			pq.enqueue(pair(u, newWeight, v));
		});
	}
	nowmst = 2;
	vis = visCreator(graph);
	const viz = visCreator(graph);
	posEdges = [];

	snap([], `MST-Prim from ${st} completed, MST is ${mstans}`);
	const visit = v => {
		if (viz[v]) {
			return;
		}
		viz[v] = true;
		preorder.push(v);
		snap([10], `Connecting node ${v}`);
		mstTree.outNeighbors(v).forEach(u => {
			visit(u);
		});
	};
	snap([10], 'Traversing MST preorder');
	visit(st);
	preorder.push(st);
	snap([], `MST-Prim TSP from node ${st} is complete`);
};

export default TSP_PRIM.create();
