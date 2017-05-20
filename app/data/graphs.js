import _sample from 'lodash.sample';
import { flatten } from 'app/utils';
import graphology from 'graphology';

const create = (className, fn) => {
	const graph = new graphology[className]();
	fn(graph);
	return graph;
};

export const createFrom = (className, data) => create(className, graph => {
	const order = data.reduce((allMax, v) => v.reduce((nodeMax, u) => Math.max(nodeMax, u), 0), 0);
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
