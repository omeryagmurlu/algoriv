import Algorithm from 'app/features/algorithm-helpers';
import { vis2array, graphologyImportFix as gimport, visCreator } from 'app/utils';
import _isEqual from 'lodash.isequal';
import _without from 'lodash.without';
import _union from 'lodash.union';

const Kruskal = Algorithm('Kruskal', 'graph');

Kruskal.addDescription(`
A **minimum spanning tree** (MST) or minimum weight spanning tree is a subset of \
the edges of a connected, edge-weighted undirected graph that **connects all the \
vertices** together, without any cycles and **with the minimum possible total edge \
weight**. That is, it is a spanning tree whose sum of edge weights is as small as \
possible. Directed graph equivalent of a MST is a minimum spanning arborescence.

---

**Kruskal's algorithm** initializes a forest consisting of trees with single nodes. The edges \
are sorted in a queue based on their weights. In each round an edge is removed from \
the queue. If the edge's endpoints belong to different trees then the trees are merged \
using the edge. The process continues until all the nodes are in the same tree or the \
edge-queue is empty.
`);
// https://www-m9.ma.tum.de/graph-algorithms/mst-kruskal/index_en.html

Kruskal.addCode([
	'Kruskal(s):',
	'    map each vertex v -> makeset v',
	'    sort edges by increasing weight -> E',
	'    while E is not empty',
	'         pop e from E',
	'         if both extremities of e are from different sets',
	'             union both sets',
	'             add e to mst'
]);

Kruskal.addText('sum');

Kruskal.logic = ({ graph: gNonParse }, snipe) => {
	const graph = gimport(gNonParse);
	const alg = Kruskal.algorithm;

	let ans = 0;
	const mstEdges = [];
	const vis = visCreator(graph);

	const snap = (hgs, text, cn, ce, noS1, noS2, eg1, eg2) => {
		alg.code(hgs);
		alg.graph.setColor(0, vis2array(vis), mstEdges);
		alg.graph.setColor(1, noS1, eg1);
		alg.graph.setColor(2, noS2, eg2);
		alg.graph.setColor(3, cn, ce);
		alg.explanation(text);
		alg.sum(`MST Cost: ${ans}`);
		snipe();
	};

	snap([], undefined);
	snap([0], 'Starting MST-Kruskal');
	let forest = graph.nodes().map(node => [node]);
	snap([1], 'Make a set for every node, that initially only contains that node', graph.nodes());
	const sortedEdges = graph.edges();
	sortedEdges.sort((e1, e2) => graph.getEdgeAttribute(e2, 'weight') - graph.getEdgeAttribute(e1, 'weight'));
	snap([2], `Sort edges by increasing weight:\n${sortedEdges.map(e => graph.extremities(e).join('-')).join(', ')}`, graph.nodes());
	sortedEdges.reverse();
	sortedEdges.forEach(edge => {
		const exts = graph.extremities(edge);
		const weight = graph.getEdgeAttribute(edge, 'weight');
		snap([3, 4], `Pop edge ${graph.extremities(edge).join('-')} with connection cost ${weight}`,
			exts, edge
		);
		const findSets = exts.map(node => forest.find(tree => tree.includes(node)));
		if (!_isEqual(findSets[0], findSets[1])) {
			const findSetsEdges = findSets.map(nodeSet => {
				const arr = [];
				for (let i = 0; i < nodeSet.length; i++) {
					for (let j = i + 1; j < nodeSet.length; j++) {
						arr.push(graph.edge(nodeSet[i], nodeSet[j]));
					}
				}
				return arr;
			}).filter(v => v);
			snap([5], `Vertex ${exts[0]} and vertex ${exts[1]} are from different sets`, null, edge, findSets[0], findSets[1], findSetsEdges[0], findSetsEdges[1]);
			forest = _without(forest, findSets[0], findSets[1]);
			forest.push(_union(findSets[0], findSets[1]));
			mstEdges.push(edge);
			exts.forEach(v => (vis[v] = true));
			ans += weight;
			snap([6, 7], 'Union both sets');
		}
	});
	snap([], `MST-Kruskal completed, MST is ${ans}`);
};

export default Kruskal.create();
