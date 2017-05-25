import _sample from 'lodash.sample';
import { flatten } from 'app/utils';
import graphology from 'graphology';

const create = (className, fn) => {
	const graph = new graphology[className]();
	fn(graph);
	if (graph.type === 'undirected') {
		graph.inNeighbors = graph.outNeighbors = graph.neighbors;
	}
	return graph;
};

export const createFrom = (className, data) => create(className, graph => {
	const order = Math.max(...(data.map(rows => Math.max(...(rows.map(node =>
		(Array.isArray(node) ? node[0] : node)
	))))));
	// console.log(order);
	graph.addNodesFrom(Array(order + 1).fill(1).map((v, i) => i));
	data.forEach((negs, v) => negs.forEach(rawU => {
		const u = Array.isArray(rawU) ? rawU[0] : rawU;
		const weight = Array.isArray(rawU) ? rawU[1] : null;
		graph.addEdge(v, u, {
			weight
		});
	}));
});

export const graphs = [
	{
		suits: ['BFS', 'DFS'],
		graphs: [
			{
				name: 'Undirected Cyclic',
				graph: createFrom('UndirectedGraph', [
					[1, 2, 4],
					[3],
					[3],
					[4],
					[5],
				])
			},
			{
				name: 'Undirected Acyclic',
				graph: createFrom('UndirectedGraph', [
					[1, 2, 3, 4],
					[5],
					[6],
					[7],
					[8],
					[9, 10, 11],
					[12, 13, 14],
					[15, 16, 17],
					[18, 19, 20]
				])
			},
			{
				name: 'Dengesiz Binary Tree',
				graph: createFrom('DirectedGraph', [
					[1, 2],
					[3, 4],
					[],
					[5, 6],
					[],
					[7, 8],
					[],
					[9, 10]
				])
			}
		]
	},
	{
		suits: ['Djikstra'],
		graphs: [
			{
				name: 'Dengesiz Binary Tree Weighted',
				graph: createFrom('DirectedGraph', [
					[[1, 18], [2, 3]],
					[[3, 10], [4, 6]],
					[],
					[[5, 24], [6, 3]],
					[],
					[[7, 11], [8, 15]],
					[],
					[[9, 8], [10, 10]]
				])
			},
			{
				name: 'Directed Cyclic Weighted',
				graph: createFrom('DirectedGraph', [
					[[1, 5], [3, 10]],
					[[2, 1], [3, 3]],
					[[3, 2]],
					[[1, 4]]
				])
			},
			{
				name: 'Undirected Cyclic Weighted',
				graph: createFrom('UndirectedGraph', [
					[[1, 6], [2, 3]],
					[[3, 8], [4, 1]],
					[[4, 2]],
					[[4, 10]]
				])
			}
		]
	}
];

const predicate = (type, suits) => suits.includes(type);
const flatGraphs = flatten(graphs.map(v => v.graphs));

export const suitingGraphs = alg => flatten(graphs.map(v => (
	predicate(alg, v.suits)
		? v.graphs
		: []
)));

export const randomGraph = (alg = false) => {
	if (alg) {
		return _sample(suitingGraphs(alg));
	}

	return _sample(flatGraphs);
};
