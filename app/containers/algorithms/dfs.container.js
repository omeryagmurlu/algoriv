import Algorithm from 'app/features/algorithm-helpers';
import { vis2array } from 'app/utils';

const DFS = Algorithm('DFS', 'graph');
DFS.addStartingNodeInput();

DFS.addDescription(`
Depth-first search (DFS) is an algorithm for traversing or searching tree or \
graph data structures. One starts at the root (selecting some arbitrary node \
as the root in the case of a graph) and explores as far as possible along each \
branch before backtracking.

A version of depth-first search was investigated in the 19th century by French \
mathematician Charles Pierre Trémaux as a strategy for solving mazes.
`);

DFS.addCode([
	'DFS(v):',
	'    if v is visited return',
	'    mark v visited',
	'    for every neighbour u of v:',
	'        DFS(u)',
	'    return',
	' ',
	'DFS(s)'
]);

DFS.addTable('recursion', ['Recursion Stack']);
DFS.addNodedTable('visited', 'Visited');

DFS.logic = ({ startVertex: st, graph }, snipe) => {
	const alg = DFS.algorithm;

	const reclist = [];
	const posEd = [];
	const vis = graph.nodes().reduce((acc, v) => {
		acc[v] = false;
		return acc;
	}, {});

	const snap = (a, b, c, d) => {
		alg.visited(vis);
		alg.recursion([reclist]);
		alg.graph.setColor(0, vis2array(vis), posEd);
		alg.graph.setColor(1, reclist, []);

		alg.code(a);
		alg.explanation(b);
		alg.graph.setColor(2, c, d);
		snipe();
	};

	const dfs = v => {
		snap([0], `Start DFS(${v})`, v);
		if (vis[v]) {
			snap([1], `${v} is visited; return`, v);
			return;
		}
		vis[v] = true;
		snap([2], `Mark ${v} visited`, v);
		graph.outNeighbors(v).forEach(u => {
			snap([3, 4], `For neighbour ${u} of ${v} do DFS`, v, graph.edge(v, u));
			reclist.push(u);
			dfs(u);
			reclist.pop();
			posEd.push(graph.edge(v, u));
		});
		snap([5], `DFS(${v}) ended!`, v);
	};
	reclist.push(st);
	snap([], undefined);
	snap([7], `Starting main DFS from ${st}`, st);
	dfs(st);
	snap([], `DFS from ${st} ended!`, st);
};

export default DFS.create();
