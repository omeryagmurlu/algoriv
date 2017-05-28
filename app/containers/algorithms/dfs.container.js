import Modules from 'app/features/modules';
import { InitInput } from 'app/features/input-types';
import { vis2array } from 'app/utils';
import { randomGraph, suitingGraphs } from 'app/data/graphs';

import AlgorithmFactory from 'app/containers/AlgorithmContainer';

const recurseStack = Modules.TableFunc(['Recursion Stack'], 150);

const description = `
Depth-first search (DFS) is an algorithm for traversing or searching tree or \
graph data structures. One starts at the root (selecting some arbitrary node \
as the root in the case of a graph) and explores as far as possible along each \
branch before backtracking.

A version of depth-first search was investigated in the 19th century by French \
mathematician Charles Pierre Trémaux as a strategy for solving mazes.
`;


const code = [
	'DFS(v):',
	'    if v is visited return',
	'    mark v visited',
	'    for every neighbour u of v:',
	'        DFS(u)',
	'    return',
	' ',
	'DFS(s)'
];

const DFS = AlgorithmFactory({
	info: {
		name: 'DFS'
	},
	input: {
		graph: randomGraph('DFS').graph,
		startVertex: '0'
	},
	inputType: {
		graph: [Modules.Graph.input(), Modules.ExampleGraphs.input()],
		startVertex: InitInput('Starting Vertex', (sV, { graph }) => !graph.hasNode(sV) && `node doesn't exist (${sV})`)
	},
	snap: (vis, reclist, posEd, hgs, text, cn, ce) => ({
		kod: Modules.Code.snap(hgs),
		graf: Modules.RefinedGraph.snap(
			[vis2array(vis), reclist, cn],
			[posEd, ce]
		),
		exp: Modules.Text.snap(text),
		recurse: recurseStack.snap([reclist]),
		vis: Modules.NodedTableFunc('Visited').snap(vis)
	}),
	modules: settings => ({
		kod: Modules.Code.module(code),
		graf: Modules.RefinedGraph.module(),
		exp: Modules.Text.module(),
		recurse: recurseStack.module(),
		vis: Modules.NodedTableFunc('Visited').module(),
		desc: Modules.Description.module(description),
		exxx: Modules.ExampleGraphs.module(suitingGraphs('DFS'), settings)
	}),
	logic: ({ startVertex: st, graph }, rawSnap) => {
		const reclist = [];
		const posEd = [];
		const vis = graph.nodes().reduce((acc, v) => {
			acc[v] = false;
			return acc;
		}, {});

		const snap = (...par) => rawSnap(vis, reclist, posEd, ...par);

		const dfs = v => {
			snap([0], `Start DFS(${v})`, v);
			if (vis[v]) {
				snap([1], `${v} is visited; return`, v);
				return;
			}
			vis[v] = true;
			snap([2], `Mark ${v} visited`, v);
			graph.outNeighbors(v).forEach(u => {
				snap([3, 4], `For neighbour ${u} of ${v} do DFS`, v, graph.edge(v, u));
				reclist.push(u);
				dfs(u);
				reclist.pop();
				posEd.push(graph.edge(v, u));
			});
			snap([5], `DFS(${v}) ended!`, v);
		};
		reclist.push(st);
		snap([], undefined);
		snap([7], `Starting main DFS from ${st}`, st);
		dfs(st);
		snap([], `DFS from ${st} ended!`, st);
	}
});

export default DFS;
