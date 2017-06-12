import Algorithm from 'app/features/algorithm-helpers';
import _pickBy from 'lodash.pickby';
import { graphologyImportFix as gimport } from 'app/utils';

const TopologicalIndegree = Algorithm('TopologicalIndegree', 'graph');

TopologicalIndegree.addDescription(`
A **topological sort** of a directed graph is a linear ordering of its vertices \
such that for every directed edge **u->v, u comes before v** in the ordering. \
For instance, the vertices of the graph may represent tasks to be performed, and the edges may represent \
constraints that one task must be performed before another; in this application, a topological ordering \
is just a valid sequence for the tasks. A topological ordering is possible if and only if the graph has \
no directed cycles, that is, if it is a **directed acyclic graph (DAG)**. Any DAG has at least one topological \
ordering, and algorithms are known for constructing a topological ordering of any DAG **in linear time**.

---

**Kahn's algorithm** for finding topological ordering utilizes the fact below.

Fact: **A DAG G has at least one vertex with in-degree 0 and one vertex with out-degree 0.**

Proof: A DAG does not contain a cycle which means that all paths will be of finite length. \
Let S be the longest path from u(source) to v(destination). \
Since S is the longest path there can be no incoming edge to u and no outgoing edge from v, if this \
situation had occurred then S would not have been the longest path

_=> indegree(u) = 0 and outdegree(v) = 0_
`);

// http://www.geeksforgeeks.org/topological-sorting-indegree-based-solution/

TopologicalIndegree.addCode([
	'TopologicalIndegree(v):',
	'    let q be a queue, topo_sort a vector and count 0',
	'    add every node with an indegree of 0 to queue',
	'    while queue is not empty',
	'        topo_sort.push(q.front()); q.pop();',
	'        for every neighbour u of v:',
	'            decrement indegree of u by 1',
	'            if indegree of u is now 0, add it to queue',
	'        increment count by one',
	' ',
	'    if count is not equal to count of nodes in the graph',
	'        throw since the graph is not a dag',
]);

TopologicalIndegree.addText('count');
TopologicalIndegree.addTable('sorted', ['Topological Sort']);
TopologicalIndegree.addTable('queue', ['Queue']);
TopologicalIndegree.addTable('indegree', ['Node', 'Indegree Array', 'Real Indegrees'], undefined, 400);

TopologicalIndegree.logic = ({ graph: gNonParse }, snipe) => {
	const graph = gimport(gNonParse);
	const alg = TopologicalIndegree.algorithm;

	const indegrees = graph.nodes().reduce((acc, v) => {
		acc[v] = graph.inDegree(v);
		return acc;
	}, {});

	const queue = [];
	let sorted = [];
	const posEd = [];
	const pos = [];
	let wrongEd = [];
	let wrong = [];
	let cnt = 0;

	const snap = (a, b, c, d) => {
		alg.sorted([sorted]);
		alg.queue([queue]);
		alg.indegree([
			graph.nodes(),
			graph.nodes().map(v => indegrees[v]),
			graph.nodes().map(v => graph.inDegree(v))
		]);
		alg.graph.setColor(0, pos, posEd);
		alg.graph.setColor(1, queue, []);
		alg.graph.setColor(3, wrong, wrongEd);
		alg.graph.setGlyphs(sorted.reduce((acc, v, i) => {
			acc[v] = i;
			return acc;
		}, {}), 1);
		alg.graph.setGlyphs(_pickBy(indegrees, v => v !== 0), 3);
		alg.count(`Count: ${cnt}`);

		alg.code(a);
		alg.explanation(b);
		alg.graph.setColor(2, c, d);
		snipe();
	};

	snap([], undefined);
	snap([0], 'Starting Kahn\'s Algorithm to Topo-Sort');

	graph.nodes().forEach(v => {
		if (indegrees[v] === -1) {
			return;
		}

		if (indegrees[v] === 0) {
			snap([2], `Add vertex ${v} to queue since it has indegree 0`, v);
			queue.push(v);
		}
	});

	snap([3, 4, 5, 6, 7, 8], 'Repeat until the queue is empty');
	while (queue.length !== 0) {
		const v = queue.shift();
		sorted.push(v);
		pos.push(v);
		snap([4], `Push vertex ${v} to the Topological Sort vector`, v);

		graph.outNeighbors(v).forEach(u => {
			posEd.push(graph.edge(v, u));
			indegrees[u]--;
			snap([6], `Decrement indegree count of ${u} by one from ${indegrees[u] + 1} to ${indegrees[u]}`, u, graph.edge(v, u));
			if (indegrees[u] === 0) {
				queue.push(u);
				snap([7], `Push vertex ${u} to the Topological Sort vector`, u);
			}
		});

		cnt++;
		snap([8], `Increment count by one to ${cnt}`);
	}

	if (cnt !== graph.nodes().length) {
		sorted = [];
		wrong = graph.nodes();
		wrongEd = graph.edges();
		snap([10, 11], 'The graph is not a DAG!');
		return;
	}

	snap([], 'Topological sort finished');
};

export default TopologicalIndegree.create();
