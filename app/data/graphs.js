import _sample from 'lodash.sample';
import { flatten, graphologyOptions as gO } from 'app/utils';
import graphology from 'graphology';

const create = (className, fn) => {
	const graph = new graphology[className](gO);
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
		graph.addEdgeWithKey(
			gO.edgeKeyGenerator({ source: v, target: u }),
			v, u, Array.isArray(rawU) && {
				weight
			}
		);
	}));
}).export();

export const adjacencyListify = g => {
	const out = [];
	g.nodes().forEach(v => (out[v] = []));
	g.edges().forEach(edge => {
		if (g.getEdgeAttribute(edge, 'weight')) {
			out[g.source(edge)].push([g.target(edge), g.getEdgeAttribute(edge, 'weight')]);
		} else {
			out[g.source(edge)].push(g.target(edge));
		}
	});
	return out;
};

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
		suits: ['Djikstra', 'BFS', 'DFS'],
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
			}
		]
	},
	{
		suits: ['Prim', 'Djikstra', 'Kruskal', 'BFS', 'DFS'],
		graphs: [
			{
				name: 'Undirected Cyclic Weighted',
				graph: createFrom('UndirectedGraph', [
					[[1, 4], [7, 8]],
					[[2, 8], [7, 11]],
					[[3, 7], [5, 4], [8, 2]],
					[[4, 9], [5, 14]],
					[[5, 10]],
					[[6, 2]],
					[[7, 1], [8, 6]],
					[[8, 7]]
				])
			},
			{
				name: 'Undirected Cyclic Weighted 2',
				graph: createFrom('UndirectedGraph', [
					[[1, 6], [2, 3]],
					[[3, 8], [4, 1]],
					[[4, 2]],
					[[4, 10]]
				])
			},
			{
				name: 'Undirected Big Numbers',
				graph: createFrom('UndirectedGraph', [
					[[2, 8447], [4, 1922]],
					[[1, 6144], [2, 5366]],
					[[4, 1677]]
				])
			}
		]
	},
	{
		suits: ['BFS', 'DFS', 'SCC'],
		graphs: [
			{
				name: 'Directed Cyclic 4 SCCs',
				graph: createFrom('DirectedGraph', [
					[1, 9],
					[2, 8],
					[3, 7],
					[4, 5, 6, 7],
					[5],
					[4],
					[5],
					[2, 4],
					[0, 7],
					[8]
				])
			},
			{
				name: 'Directed Cyclic 5 SCCs',
				graph: createFrom('DirectedGraph', [
					[1, 9],
					[2, 8],
					[3, 7, 11],
					[4, 5, 6, 7, 14],
					[5],
					[4],
					[5, 12],
					[2, 4],
					[0, 7],
					[8],
					[2],
					[10],
					[13],
					[6],
					[15],
					[16],
					[14, 5]
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
		const sample = _sample(suitingGraphs(alg));
		if (sample) {
			return _sample(suitingGraphs(alg));
		}
	}

	return _sample(flatGraphs);
};
