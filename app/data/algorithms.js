 // Graphs
import Djikstra from 'app/containers/algorithms/djikstra.container';
import BFS from 'app/containers/algorithms/bfs.container';
import DFS from 'app/containers/algorithms/dfs.container';
import SCC from 'app/containers/algorithms/scc.container';
import Prim from 'app/containers/algorithms/prim.container';
import Kruskal from 'app/containers/algorithms/kruskal.container';
import TopologicalDFS from 'app/containers/algorithms/topological_dfs.container';
import TopologicalIndegree from 'app/containers/algorithms/topological_indegree.container';
// import BST from 'app/containers/algorithms/bst.container';
import TSP_DP from 'app/containers/algorithms/tspdp.container';
import TSP_GR from 'app/containers/algorithms/tspgr.container';
import TSP_PRIM from 'app/containers/algorithms/tspprim.container';

export const AlgorithmsMap = {
	Djikstra: {
		name: 'Djikstra',
		desc: 'Visualise Djikstra\'s Single Source Shortest Path Algorithm',
		view: Djikstra
	},
	BFS: {
		name: 'BFS',
		desc: 'Visualise Breadth-First Search Algorithm',
		view: BFS
	},
	DFS: {
		name: 'DFS',
		desc: 'Visualise Depth-First Search Algorithm',
		view: DFS
	},
	SCC: {
		name: 'Kosaraju\'s SCC',
		desc: 'Visualise Kosaraju\'s Algorithm to find Strongly Connected Components',
		view: SCC
	},
	Prim: {
		name: 'Prim\'s MST',
		desc: 'Find a Minimum Spanning Tree using Prim\'s MST Algorithm',
		view: Prim
	},
	Kruskal: {
		name: 'Kruskal\'s MST',
		desc: 'Find a Minimum Spanning Tree using Kruskal\'s MST Algorithm',
		view: Kruskal
	},
	TopologicalDFS: {
		name: 'Topological Sort (DFS)',
		desc: 'Sort topologically using DFS',
		view: TopologicalDFS
	},
	TopologicalIndegree: {
		name: 'Topological Sort (Indegree Array)',
		desc: 'Sort topologically using Indegree Array',
		view: TopologicalIndegree
	},
	TSP_DP: {
		name: 'Travelling Salesman (DP)',
		desc: 'Dynamic Programming Approach for TSP',
		view: TSP_DP
	},
	TSP_GR: {
		name: 'Travelling Salesman (Greedy)',
		desc: 'Greedy Approach for TSP',
		view: TSP_GR
	},
	TSP_PRIM: {
		name: 'Travelling Salesman Approximation (MST Prim)',
		desc: 'Approximate TSP using MST Prim',
		view: TSP_PRIM
	},
	// BST: {
	// 	name: 'Binary Search Tree',
	// 	desc: 'Visualise how a Binary Search Tree works',
	// 	view: BST
	// },
};

export const AlgorithmsList = [
	{
		title: 'Graph Traversal',
		algorithms: [
			AlgorithmsMap.BFS,
			AlgorithmsMap.DFS,
		]
	}, {
		title: 'Shortest Path',
		algorithms: [
			AlgorithmsMap.Djikstra,
		]
	},
	{
		title: 'Minimum Spanning Tree',
		algorithms: [
			AlgorithmsMap.Kruskal,
			AlgorithmsMap.Prim,
		]
	}, {
		title: 'Topological Sort',
		algorithms: [
			AlgorithmsMap.TopologicalIndegree,
			AlgorithmsMap.TopologicalDFS,
		]
	}, {
		title: 'Strongly Connected Components',
		algorithms: [
			AlgorithmsMap.SCC,
		]
	},
	{
		title: 'Travelling Salesman',
		algorithms: [
			AlgorithmsMap.TSP_DP,
			AlgorithmsMap.TSP_GR,
			AlgorithmsMap.TSP_PRIM,
		]
	},
	// {
	// 	title: 'Searching',
	// 	algorithms: [
	// 		AlgorithmsMap.BST,
	// 	]
	// }
];
