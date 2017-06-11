 // Graphs
import Djikstra from 'app/containers/algorithms/djikstra.container';
import BFS from 'app/containers/algorithms/bfs.container';
import DFS from 'app/containers/algorithms/dfs.container';
import SCC from 'app/containers/algorithms/scc.container';
import Prim from 'app/containers/algorithms/prim.container';
import Kruskal from 'app/containers/algorithms/kruskal.container';
import TopologicalDFS from 'app/containers/algorithms/topological_dfs.container';
import TopologicalIndegree from 'app/containers/algorithms/topological_indegree.container';

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
		name: 'Strongly Connected Components',
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
	}
};

export const AlgorithmsList = [
	{
		title: 'Graph Algorithms',
		algorithms: [
			AlgorithmsMap.Djikstra,
			AlgorithmsMap.BFS,
			AlgorithmsMap.DFS,
			AlgorithmsMap.SCC,
			AlgorithmsMap.Prim,
			AlgorithmsMap.Kruskal,
			AlgorithmsMap.TopologicalDFS,
			AlgorithmsMap.TopologicalIndegree
		]
	}
];