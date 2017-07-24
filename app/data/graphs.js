import _sample from 'lodash.sample';
import flatten from 'lodash.flattendeep';
import graphology from 'graphology';
import { graphologyOptions as gO } from 'app/utils';

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
	graph.addNodesFrom(Array(Math.max(order + 1, data.length)).fill(1).map((v, i) => i));
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

export const createGeom = data => create('UndirectedGraph', graph => {
	graph.addNodesFrom(data.reduce((acc, cr, i) => {
		acc[`${i}`] = {
			x: cr[0],
			y: cr[1]
		};

		return acc;
	}, {}));
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

export const geometrys = [
	{
		suits: ['TSP_DP', 'TSP_GR', 'TSP_PRIM'],
		data: [
			{
				name: '4 TSP',
				canvas: createGeom([
					[0, 0],
					[100, 50],
					[150, -200],
					[-25, -75],
					[-40, 80]
				])
			},
		]
	},
];

export const graphs = [
	{
		suits: ['BFS', 'DFS'],
		data: [
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
		]
	},
	{
		suits: ['Djikstra', 'BFS', 'DFS'],
		data: [
			{
				name: 'Unbalanced Binary Tree Weighted',
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
		data: [
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
		data: [
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
	},
	{
		suits: ['TopologicalIndegree', 'TopologicalDFS', 'BFS', 'DFS'],
		data: [
			{
				name: 'Unbalanced Binary Tree',
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
			},
			{
				name: 'DAG 6 Vertexes',
				graph: createFrom('DirectedGraph', [
					[],
					[],
					[3],
					[1],
					[0, 1],
					[0, 2]
				])
			},
			{
				name: 'DAG 10 Vertexes',
				graph: createFrom('DirectedGraph', [
					[1],
					[],
					[3, 5],
					[1, 4],
					[],
					[1, 4],
					[],
					[0, 2, 6, 8],
					[1],
					[7]
				])
			}
		]
	},
	// {
	// 	suits: ['BST'],
	// 	data: [
	// 		{
	// 			name: 'Balanced Tree',
	// 			graph: create('DirectedGraph', graph => {
	// 				const edge = (v, u) => graph.addEdgeWithKey(
	// 					gO.edgeKeyGenerator({ source: v, target: u }),
	// 					v, u
	// 				);
	// 				graph.addNodesFrom([1, 3, 4, 6, 7, 8, 10, 13, 14]);
	// 				edge(6, 3);
	// 				edge(3, 1);
	// 				edge(3, 4);
	// 				edge(6, 8);
	// 				edge(8, 7);
	// 				edge(8, 13);
	// 				edge(13, 10);
	// 				edge(13, 14);
	// 			}).export()
	// 		}
	// 	]
	// }
];

const predicate = (type, suits) => suits.includes(type);

export const suitingGraphs = (alg, db = graphs) => flatten(db.map(v => (
	predicate(alg, v.suits)
		? v.data
		: []
)));

export const randomGraph = (alg = false, db = graphs) => {
	if (alg) {
		const sample = _sample(suitingGraphs(alg));
		if (sample) {
			return _sample(suitingGraphs(alg));
		}
	}

	return _sample(flatten(db.map(v => v.data)));
};
