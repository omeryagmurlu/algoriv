import Algorithm from 'app/features/algorithm-helpers';
import { vis2array, graphologyImportFix as gimport, visCreator } from 'app/utils';

const BFS = Algorithm('BFS', 'graph');
BFS.addStartingNodeInput();

BFS.addDescription(`
Breadth-first search (BFS) is an algorithm for traversing or searching tree \
or graph data structures. It starts at the tree root (or some arbitrary node \
of a graph, sometimes referred to as a 'search key') and explores the \
neighbor nodes first, before moving to the next level neighbors.

BFS was invented in the late 1950s by E. F. Moore, who used it to find the shortest \
path out of a maze, and discovered independently by C. Y. Lee as a wire routing algorithm (published 1961).
`);

BFS.addCode([
	'BFS(s):',
	'    Q = {s}; // FIFO',
	'    while Q is not empty',
	'        v = Q.front(); Q.pop();',
	'        if v is visited already, continue;',
	'        mark v visited',
	'        for each neighbour u of v:',
	'            if u is visited already, continue;',
	'            else, Q.push(u);'
]);

BFS.addTable('queue', ['Queue']);
BFS.addNodedTable('visited', 'Visited');

BFS.logic = ({ startVertex: st, graph: gNonParse }, snipe) => {
	const graph = gimport(gNonParse);
	const alg = BFS.algorithm;

	const q = [];
	const parentQ = [];
	const posEd = [];
	const vis = visCreator(graph);

	const snap = (a, b, c, d) => {
		alg.visited(vis);
		alg.queue([q]);
		alg.graph.setColor(0, vis2array(vis), posEd);
		alg.graph.setColor(1, q, []);

		alg.code(a);
		alg.explanation(b);
		alg.graph.setColor(2, c, d);
		snipe();
	};

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
};

export default BFS.create();
