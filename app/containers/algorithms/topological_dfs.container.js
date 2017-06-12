import Algorithm from 'app/features/algorithm-helpers';
import _shuffle from 'lodash.shuffle';
import { graphologyImportFix as gimport, visCreator, vis2array } from 'app/utils';

const TopologicalDFS = Algorithm('TopologicalDFS', 'graph');

TopologicalDFS.addDescription(`
A **topological sort** of a directed graph is a linear ordering of its vertices \
such that for every directed edge **u->v, u comes before v** in the ordering. \
For instance, the vertices of the graph may represent tasks to be performed, and the edges may represent \
constraints that one task must be performed before another; in this application, a topological ordering \
is just a valid sequence for the tasks. A topological ordering is possible if and only if the graph has \
no directed cycles, that is, if it is a **directed acyclic graph (DAG)**. Any DAG has at least one topological \
ordering, and algorithms are known for constructing a topological ordering of any DAG **in linear time**.

---

The algorithm loops through each node of the graph, in an **arbitrary order**, initiating a depth-first search \
that terminates when it hits any node that has already been visited since the beginning of the topological \
sort or the node has no outgoing edges.

Each node n gets prepended to the output list only after considering all other nodes which depend on n \
(all descendants of n in the graph). Specifically, when the algorithm adds node n, we are guaranteed that \
all nodes which depend on n are already in the output list: they were added to list either by the recursive \
call to visit() which ended before the call to visit n, or by a call to visit() which started even before the \
call to visit n. Since each edge and node is visited once, the algorithm runs in **linear time**.
`);

// http://www.geeksforgeeks.org/topological-sorting/

TopologicalDFS.addCode([
	'TopologicalDFS(v):',
	'    let topo_sort be a vector',
	'    visit(v):',
	'        if v has a temporary mark',
	'            throw //not a DAG',
	'        if v is not marked',
	'            mark v temporarily',
	'            for each neighbour u of v',
	'                visit(u)',
	'            mark v permanently',
	'            unmark v temporarily',
	'            unshift v to topo_sort',
	' ',
	'    while there are unmarked nodes',
	'        select an unmarked node v',
	'        visit(v)'
]);

TopologicalDFS.addTable('sorted', ['Topological Sort']);
TopologicalDFS.addNodedTable('vis', 'Visited');

TopologicalDFS.logic = ({ graph: gNonParse }, snipe) => {
	const graph = gimport(gNonParse);
	const alg = TopologicalDFS.algorithm;

	const tempVis = visCreator(graph);
	const permVis = visCreator(graph);

	let sorted = [];
	let wrongEd = [];
	let wrong = [];
	let errored = false;
	const permEd = [];
	const tempEd = [];

	const snap = (a, b, c, d) => {
		alg.sorted([sorted]);
		alg.vis(graph.nodes().reduce((acc, v) => {
			if (permVis[v]) {
				acc[v] = 'permanently';
			} else if (tempVis[v]) {
				acc[v] = 'temporarily';
			} else {
				acc[v] = false;
			}
			return acc;
		}, {}));
		alg.graph.setColor(0, vis2array(tempVis), tempEd);
		alg.graph.setColor(1, vis2array(permVis), permEd);
		alg.graph.setColor(2, wrong, wrongEd);
		alg.graph.setGlyphs(sorted.reduce((acc, v, i) => {
			acc[v] = i;
			return acc;
		}, {}), 0);

		alg.code(a);
		alg.explanation(b);
		alg.graph.setColor(3, c, d);
		snipe();
	};

	snap([], undefined);
	snap([0], 'Starting Topo-Sort using DFS');

	const visit = (v) => {
		if (tempVis[v]) {
			return -1;
		}
		if (!permVis[v] && !tempVis[v]) { // !tempVis[v] is always true here, for readability
			tempVis[v] = true;
			snap([0], `Mark vertex ${v} temporarily visited`, v);
			graph.outNeighbors(v).forEach(u => {
				snap([0], `Visit vertex ${u}`, u, graph.edge(v, u));
				tempEd.push(graph.edge(v, u));
				const res = visit(u);
				permEd.push(graph.edge(v, u));
				if (res === -1) {
					return -1;
				}
			});
			tempVis[v] = false;
			permVis[v] = true;
			snap([0], `Upgrade marked state of vertex ${v} from temporary to permanent`, v);
			sorted.unshift(v);
			snap([0], `Unshift ${v} to the list`, v);
		}
	};

	snap([13], 'Repeat until there are no unmarked nodes');
	_shuffle(graph.nodes()).forEach(v => {
		if (!permVis[v] && !tempVis[v]) {
			snap([14, 15], `Vertex ${v} is unmarked`, v);
			const res = visit(v);
			if (res === -1) {
				errored = true;
				return -1;
			}
		}
	});

	if (errored) {
		sorted = [];
		wrong = graph.nodes();
		wrongEd = graph.edges();
		snap([10, 11], 'The graph is not a DAG!');
		return;
	}
	snap([], 'Topological sort finished');
};

export default TopologicalDFS.create();
