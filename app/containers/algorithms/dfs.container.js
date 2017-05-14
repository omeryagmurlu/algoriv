import Modules from 'app/features/modules';
import { InitInput, CustomInput } from 'app/features/input-types';
import { randomGraph } from 'app/data/graphs';

import AlgorithmFactory from '../algorithm.factory';

const recurseStack = Modules.TableFunc('Recursion Stack', 150);

const code = [
	'DFS(v):',
	'    if v is visited return',
	'    mark v visited',
	'    for every neighbour u of v:',
	'        DFS(u)',
	'',
	'DFS(s)'
];

const DFS = AlgorithmFactory({
	info: {
		name: 'DFS'
	},
	input: {
		startVertex: 0,
		graph: randomGraph('BFS').graph
	},
	inputType: {
		graph: CustomInput(),
		startVertex: InitInput('Starting Vertex', (sV, { graph }) => !graph.hasNode(sV) && `node doesn't exist (${sV})`)
	},
	snap: (vis, reclist, hgs, text, cn, ce) => ({
		kod: Modules.Code.snap(hgs),
		graph: Modules.VisitedAheadGraph.snap(ce, cn, vis, reclist),
		exp: Modules.Explanation.snap(text),
		recurse: recurseStack.snap(reclist),
		vis: Modules.VisitedArray.snap(vis)
	}),
	modules: ({ graph }) => ({
		kod: Modules.Code.module(code),
		graph: Modules.VisitedAheadGraph.module(graph),
		exp: Modules.Explanation.module(),
		recurse: recurseStack.module(),
		vis: Modules.VisitedArray.module()
	}),
	logic: ({ startVertex: st, graph }, rawSnap) => {
		const reclist = [];
		const vis = Array(graph.order).fill(false);

		const snap = (...par) => rawSnap(vis, reclist, ...par);

		const dfs = v => {
			snap([0], `DFS ${v}`, v);
			if (vis[v]) {
				snap([1], `${v} is visited; return`, v);
				return;
			}
			vis[v] = true;
			snap([2], `Mark ${v} visited`, v);
			graph.neighbors(v).forEach(u => {
				snap([3, 4], `For neighbour ${u} of ${v} do DFS`, v, graph.edge(v, u));
				reclist.push(u);
				dfs(u);
				reclist.pop();
			});
		};
		reclist.push(st);
		snap([6], `Starting main DFS from ${st}`, st);
		dfs(st);
		snap([], `DFS from ${st} ended!`);
	}
});

export default DFS;
