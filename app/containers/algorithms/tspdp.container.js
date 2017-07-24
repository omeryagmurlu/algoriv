import Algorithm from 'app/features/algorithm-helpers';
import { graphologyImportFix as gimport, griddyTable, connectAllNodes } from 'app/utils';

const TSP_DP = Algorithm('TSP_DP', 'geometry');
TSP_DP.addStartingNodeInput();

TSP_DP.addDescription(`
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
problem (TSP_DP) is one of the most notorious computational tasks. There is a long history of\
attempts at solving it, a long saga of failures and partial successes, and along the way, major\
advances in algorithms and complexity theory. The most basic piece of bad news about the\
TSP_DP, which we will better understand in Chapter 8, is that it is highly unlikely to be solvable\
in polynomial time.`
);

TSP_DP.addCode([
	'TSP_DP(S):',
	'    C({1}, 1) = 0',
	'    for s = 2 to n:',
	'        for all subsets S ⊆ {1, 2, . . . , n} of size s and containing 1:',
	'            C(S, 1) = ∞',
	'            for all j ∈ S, j = 1:',
	'                C(S, j) = min{C(S − {j},i) + dij : i ∈ S,i 6= j}',
	'    return minj C({1, . . . , n}, j) + dj1'
]);

TSP_DP.addText('failure');
TSP_DP.addText('set');

TSP_DP.addTable('dp', ['Set', 'End Node', 'Distance', 'Route']);

TSP_DP.addText('dmText', 'Distance Matrix');
TSP_DP.addTable('distanceMatrix', ['If you are seeing this column then we are fucked'], 500, 500);

const combinations = array => new Array(1 << array.length).fill().map((e1, i) => array.filter((e2, j) => i & 1 << j)); // eslint-disable-line
const forr = (fr, t, f) => {
	const inner = (from, to, fn, cb) => {
		if (from === to) {
			cb();
			return;
		}

		setImmediate(() => {
			fn(from, () => {
				inner(from + 1, to, fn, cb);
			});
		});
	};

	return new Promise(resolve => {
		inner(fr, t, f, resolve);
	});
};

TSP_DP.logic = ({ startVertex: st, geometry: gNonParse }, snipe) => {
	const graph = gimport(gNonParse);
	graph.dropEdges();
	const alg = TSP_DP.algorithm;

	const ns = graph.nodes().length;
	const subsets = combinations(graph.nodes());
	const dpdb = {};
	const rodb = {};

	connectAllNodes(graph);
	const gr = griddyTable(graph.nodes(), graph.nodes(), graph.nodes().map(n1 =>
		graph.nodes().map(n2 => (
			graph.edge(n1, n2) ? graph.getEdgeAttribute(n1, n2, 'weight') : '-'
		))), '❧');

	let setnodes = [];
	let setedges = [];
	let currEnd = [];
	let connect;

	const snap = (a, b, c, d, e) => {
		alg.code(a);
		alg.explanation(b);
		alg.geometry.setColor(1, currEnd, [connect]);
		alg.geometry.setOverrideGraph(graph);
		alg.failure(e);
		alg.geometry.setColor(0, setnodes, setedges);
		if (setnodes.length > 0) alg.set(`Set: ${setnodes}`);
		alg.distanceMatrix(...gr);
		const dp = [
			[],
			[],
			[],
			[],
		];
		Object.keys(dpdb).reverse().forEach(set => {
			Object.keys(dpdb[set]).reverse().forEach(end => {
				dp[0].push(set);
				dp[1].push(end);
				dp[2].push(`${dpdb[set][end]}`);
				dp[3].push(`${rodb[set][end]}`);
			});
		});
		alg.dp(dp);
		snipe();
	};

	// if (graph.nodes().length > 10) {
	// 	snap(undefined, undefined, undefined, undefined, 'Too much nodes for this algorithm');
	// 	return;
	// }

	const nodeListToEdges = (list) => list.map((v, l, a) => {
		if (a[l + 1]) {
			return graph.edge(v, a[l + 1]);
		}

		return undefined;
	}).filter(x => x);

	dpdb[`${st}`] = {};
	dpdb[`${st}`][st] = 0;

	rodb[`${st}`] = {};
	rodb[`${st}`][st] = [st];
	snap([1], `Starting Dynamic Programming approach for Travelling Salesman from base ${st}`);
	return forr(2, ns + 1, (i, cb) => {
		snap([3], `Calculate tours when city count is ${i}`);
		const bunch1 = subsets.filter(r => r.length === i && r.includes(st));
		forr(0, bunch1.length, (setIdx, cbb) => {
			const set = bunch1[setIdx];
			setnodes = set;
			dpdb[set.join(',')] = dpdb[set.join(',')] || {};
			rodb[set.join(',')] = rodb[set.join(',')] || {};
			snap([4, 5], `Set is: ${set.join(', ')}`);
			dpdb[set.join(',')][st] = Infinity;
			rodb[set.join(',')][st] = [];

			set.forEach(j => {
				if (j === st) return;

				let locmin = Infinity;
				let iimin;
				set.forEach(ii => {
					if (ii === j) return;
					const val = dpdb[set.filter(x => x !== j).join(',')][ii] + graph.getEdgeAttribute(ii, j, 'weight');
					if (locmin > val) {
						locmin = val;
						iimin = ii;
					}
				});
				rodb[set.join(',')][j] = [j].concat(rodb[set.filter(x => x !== j).join(',')][iimin]);
				setedges = nodeListToEdges(rodb[set.join(',')][j]);
				currEnd = [st, j];
				connect = graph.edge(st, j);
				snap([6], `Min tour from ${st} to ${j} in set costs ${locmin}`);
				setedges = [];
				currEnd = [];
				connect = undefined;
				dpdb[set.join(',')][j] = locmin;
			});
			setnodes = [];
			cbb();
		}).then(cb);
	}).then(() => {
		let ans = Infinity;
		let bt;
		graph.nodes().filter(x => x !== st).forEach(x => {
			const sn = dpdb[graph.nodes().join(',')][x] + graph.getEdgeAttribute(x, st, 'weight');
			if (sn < ans) {
				ans = sn;
				bt = x;
			}
		});
		setnodes = graph.nodes();
		if (bt) {
			setedges = nodeListToEdges(rodb[graph.nodes().join(',')][bt]);
			currEnd = [st, bt];
			connect = graph.edge(st, bt);
		}
		snap([7], `Trace Complete, minimum tour is ${ans}`);
	});
};

export default TSP_DP.create();
