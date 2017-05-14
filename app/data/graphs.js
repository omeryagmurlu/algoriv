import _sample from 'lodash.sample';
import { flatten } from 'app/utils';
import { UndirectedGraph } from 'graphology';

const create = (Class, fn) => {
	const graph = new Class();
	fn(graph);
	return graph;
};

const createFrom = (Class, data) => create(Class, graph => {
	graph.addNodesFrom(Array(data.length).fill(1).map((v, i) => i));
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
				graph: createFrom(UndirectedGraph, [
					[1, 2, 4],
					[3],
					[3],
					[4],
					[5],
					[]
				])
			},
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
