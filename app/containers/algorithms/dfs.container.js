import AlgorithmFactory from '../algorithm.factory';
import Modules from '../../modules';

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
		startVertex: 5,
		graph: {
			nodeCount: 6,
			edges: [
				[1, 2, 4],
				[0, 3],
				[0, 3],
				[1, 2, 4],
				[0, 3, 5],
				[4]
			]
		}
	},
	snap: (vis, reclist) => (hgs, text, cn, ce) => ({
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
	logic: ({ startVertex: st, graph }, snapFactory) => {
		const reclist = [];
		const vis = Array(graph.nodeCount).fill(false);

		const snap = snapFactory(vis, reclist);

		const dfs = v => {
			snap([0], `DFS ${v}`, v);
			if (vis[v]) {
				snap([1], `${v} is visited; return`, v);
				return;
			}
			vis[v] = true;
			snap([2], `Mark ${v} visited`, v);
			graph.edges[v].forEach(u => {
				snap([3, 4], `For neighbour ${u} of ${v} do DFS`, v, [v, u]);
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
