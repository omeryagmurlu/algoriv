import Algorithm from 'app/features/algorithm-helpers';
import { graphologyImportFix as gimport, griddyTable, visCreator, connectAllNodes } from 'app/utils';

const TSP_GR = Algorithm('TSP_GR', 'geometry');
TSP_GR.addStartingNodeInput();

TSP_GR.addDescription(`
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
problem (TSP_GR) is one of the most notorious computational tasks. There is a long history of\
attempts at solving it, a long saga of failures and partial successes, and along the way, major\
advances in algorithms and complexity theory. The most basic piece of bad news about the\
TSP_GR, which we will better understand in Chapter 8, is that it is highly unlikely to be solvable\
in polynomial time.`
);

TSP_GR.addCode([
	'TSP_GR(S):',
	'    move(v):',
	'        mark v visited',
	'        find nearest neighbor u that isn\'t marked',
	'        if u does not exist return v',
	'        save u as a route',
	'        return move(u)',
	'    move(S)'
]);

TSP_GR.addText('failure');
TSP_GR.addText('ans');

TSP_GR.addNodedTable('visited', 'Visited');
TSP_GR.addText('dmText', 'Distance Matrix');
TSP_GR.addTable('distanceMatrix', ['If you are seeing this column then we are fucked'], 500, 500);

TSP_GR.logic = ({ startVertex: st, geometry: gNonParse }, snipe) => {
	const graph = gimport(gNonParse);
	const showGraph = gimport(gNonParse);
	graph.dropEdges();
	showGraph.dropEdges();
	const grid = griddyTable(graph.nodes(), graph.nodes(), graph.nodes().map(re3 =>
		graph.nodes().map(ksds => (
			graph.edge(re3, ksds) ? graph.getEdgeAttribute(re3, ksds, 'weight') : '-'
		))), '❧');
	const alg = TSP_GR.algorithm;

	connectAllNodes(graph);

	const setnodes = [st];
	const setedges = [];
	let currEnd = [];
	let connect;
	let ans = 0;
	const vis = visCreator(graph);

	const snap = (a, b, c, d, e) => {
		alg.visited(vis);
		alg.geometry.setColor(0, setnodes, setedges);
		alg.geometry.setColor(1, currEnd, [connect]);

		alg.code(a);
		alg.explanation(b);
		alg.geometry.setColor(2, c, d);
		alg.geometry.setOverrideGraph(showGraph);
		alg.failure(e);
		if (ans) alg.ans(`Sum is: ${ans}`);
		alg.distanceMatrix(...grid);
		snipe();
	};

	try {
		snap([0], `Starting TSP Greedy from node ${st}`);
		const route = [st];
		const move = (v) => {
			vis[v] = true;
			snap([2], `Mark ${v} visited`);
			let minl = Infinity;
			let minn;
			graph.outNeighbors(v).filter(n => !vis[n]).forEach(n => {
				const l = graph.getEdgeAttribute(v, n, 'weight');
				if (l < minl) {
					minl = l;
					minn = n;
				}
			});
			if (!minn) {
				snap([4], 'All nodes visited');
				return v;
			}
			snap([3, 5], `Nearest node to ${v} is ${minn}`);
			setedges.push(showGraph.addEdgeWithKey(`${v}, ${minn}`, v, minn, {
				weight: minl
			}));
			connect = setedges[setedges.length - 1];
			ans += minl;
			setnodes.push(minn);
			route.push(minn);
			currEnd = [minn];
			snap([1, 6], `Move ${minn}`);
			return move(minn);
		};
		snap([1, 7], 'Move to start');
		const end = move(st);
		ans += graph.getEdgeAttribute(end, st, 'weight');
		connect = showGraph.addEdgeWithKey(`${end}, ${st}`, end, st, {
			weight: graph.getEdgeAttribute(end, st, 'weight')
		});
		currEnd = [end, st];
		snap([], `Greedy TSP from node ${st} is complete`);
	} catch (e) {
		if (e.message.includes('could not find an edge')) {
			snap(undefined, undefined, undefined, undefined, 'Unconnected Nodes Found');
		} else {
			throw e;
		}
	}
};

export default TSP_GR.create();
