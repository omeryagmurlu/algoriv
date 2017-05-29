import Modules from 'app/features/modules';
import { InitInput } from 'app/features/input-types';
import { vis2array, reverseGraph } from 'app/utils';
import { randomGraph, suitingGraphs } from 'app/data/graphs';

import AlgorithmFactory from 'app/containers/AlgorithmContainer';

const f1Module = Modules.TableFunc(['Nodes', 'Finish Times'], 150);
const sccModule = Modules.TableFunc(['SCCs'], 150);

const description = `
In the mathematical theory of directed graphs, a graph is said to be strongly \
connected or diconnected if every vertex is reachable from every other vertex. \
The strongly connected components or diconnected components of an arbitrary \
directed graph form a partition into subgraphs that are themselves strongly connected.

Kosaraju's algorithm uses two passes of depth first search. The first, in the original \
graph, is used to choose the order in which the outer loop of the second depth first \
search tests vertices for having been visited already and recursively explores them \
if not. The second depth first search is on the transpose graph of the original graph, \
and each recursive exploration finds a single new strongly connected component. It is \
named after S. Rao Kosaraju, who described it (but did not publish his results) in 1978; \
Micha Sharir later published it in 1981.`;

const code = [
	'SCC(s):',
	'    computeFinishOrders(v):',
	'        if v visited return',
	'        else mark v visited',
	'        for every neighbor u of v',
	'            if u visited continue',
	'            else computeFinishOrders(u)',
	'        save finish time of v',
	' ',
	'    for every node v',
	'        if v visited continue',
	'        else computeFinishOrders(v)',
	'    reset visited map',
	' ',
	'    reverse graph',
	'    let SCCID be 0',
	' ',
	'    traverseConnectedComponent(v):',
	'        if v visited return',
	'        else mark v visited',
	'        node v belongs to SCC SCCID',
	'        for every neighbor u of v in reversed graph',
	'            if u visited continue',
	'            else traverseConnectedComponent(u)',
	' ',
	'    while finishTimesList is not empty',
	'        pop v from finishTimesList',
	'        if v visited continue',
	'        else traverseConnectedComponent(v)',
	'        increase SCCID by one'
];

const SCC = AlgorithmFactory({
	info: {
		name: 'SCC'
	},
	input: {
		graph: randomGraph('SCC').graph,
		startVertex: '0'
	},
	inputType: {
		graph: [Modules.Graph.input().graph, Modules.ExampleGraphs.input()],
		startVertex: [Modules.Graph.input().startNode, InitInput('Starting Vertex', (sV, { graph }) => !graph.hasNode(sV) && `node doesn't exist (${sV})`)]
	},
	snap: (vis, reclist, recedge, posEd, f1, sccnodes, sccedges, graph, hgs, text, cn, ce) => ({
		kod: Modules.Code.snap(hgs),
		graf: Modules.RefinedGraph.snap(
			[vis2array(vis), ...sccnodes, reclist, cn],
			[posEd, ...sccedges, recedge, ce],
			f1[1].reduce((o, id, i) => {
				o[id] = f1[0][i];
				return o;
			}, {}),
			graph
		),
		f1: f1Module.snap([f1[1], f1[0]]),
		scc: sccModule.snap([sccnodes.map(nodes => nodes.join(', '))]),
		// vis: Modules.NodedTableFunc('Visited').snap(vis),
		exp: Modules.Text.snap(text)
	}),
	modules: settings => ({
		kod: Modules.Code.module(code),
		graf: Modules.RefinedGraph.module(),
		exp: Modules.Text.module(),
		// vis: Modules.NodedTableFunc('Visited').module(),
		f1: f1Module.module(),
		scc: sccModule.module(),
		desc: Modules.Description.module(description),
		exxx: Modules.ExampleGraphs.module(suitingGraphs('SCC'), settings)
	}),
	logic: ({ startVertex: st, graph }, rawSnap) => {
		const mp = (fi, se) => ({ fi, se });
		let vis;
		let posEd;
		let reclist;
		let recedge;
		const reset = () => {
			vis = graph.nodes().reduce((acc, v) => {
				acc[v] = false;
				return acc;
			}, {});
			reclist = [];
			recedge = [];
			posEd = [];
		};
		reset();

		const f1 = [];

		const semiSnap = (...p) => rawSnap(vis, reclist, recedge, posEd, [
			f1.map(({ fi }) => fi.toString()),
			f1.map(({ se }) => se.toString())
		], ...p);
		let snap = (...p) => semiSnap(
			[], [],
			graph,
			...p
		);

		snap([], undefined);
		snap([], `Starting SCC from node ${st}`, st);

		let tim = 0;
		const dfs1 = (v) => {
			if (vis[v]) return;
			reclist.push(v);
			snap([3], `Traverse node ${v}`, v);
			vis[v] = true;
			graph.outNeighbors(v).forEach(u => {
				if (vis[u]) {
					return;
				}
				snap([4, 6], `Extend to neighbour ${u} of ${v}`, [v, u], graph.edge(v, u));
				recedge.push(graph.edge(v, u));
				dfs1(u);
				recedge.pop();
				reclist.pop();
				posEd.push(graph.edge(v, u));
			});
			f1.push(mp(++tim, v));
			snap([7], `Finish time of node ${v} is ${tim}`, v);
		};
		graph.nodes().forEach(v => {
			if (vis[v]) {
				return;
			}
			snap([1, 9, 11], `computeFinishOrders(${v})`, v);
			dfs1(v);
			reclist.pop();
		});

		reset();
		snap([12], 'Computation of finish orders finished, reset vars');
		const revGraph = reverseGraph(graph);
		const toTombSCC = [];
		const toTombSCCegs = [];
		snap = (...p) => semiSnap(toTombSCC, toTombSCCegs, revGraph, ...p);
		snap([14], 'Reverse the graph');
		let sccId = 0;

		const sccs = [];
		const dfs2 = (v) => {
			if (vis[v]) {
				return;
			}
			reclist.push(v);
			vis[v] = true;
			sccs[sccId].push(v);
			snap([19], `Node ${v} belongs to SCC ${sccId}`, v);
			revGraph.outNeighbors(v).forEach(u => {
				if (vis[u]) {
					return;
				}
				snap([21, 22], `Extend to neighbour ${u} of ${v}`, v, revGraph.edge(v, u));
				recedge.push(revGraph.edge(v, u));
				dfs2(u);
				recedge.pop();
				reclist.pop();
				posEd.push(revGraph.edge(v, u));
			});
		};
		const sccedges = id => sccs.map(nodeSet => {
			const arr = [];
			for (let i = 0; i < nodeSet.length; i++) {
				for (let j = 0; j < nodeSet.length; j++) {
					arr.push(revGraph.edge(nodeSet[i], nodeSet[j]));
				}
			}
			return arr.filter(v => v);
		}).filter(v => v)[id];
		while (f1.length > 0) {
			const se = f1.pop().se;
			if (vis[se]) {
				continue;
			}
			snap([17, 28], `Traversing SCC ${sccId} starting with node ${se}`, se);
			sccs[sccId] = [];
			dfs2(se);
			reclist.pop();
			const sccegs = sccedges(sccId);
			snap([29], `Traversal of SCC ${sccId} completed, it includes nodes:\n${sccs[sccId]}`, sccs[sccId], sccegs);
			toTombSCCegs[sccId] = sccegs;
			toTombSCC[sccId] = sccs[sccId];
			sccId++;
		}
		snap = (...p) => semiSnap(toTombSCC, toTombSCCegs, graph, ...p);
		snap([], `SCC from ${st} completed ${sccId}`);
	}
});

export default SCC;
