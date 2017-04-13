import React, { Component } from 'react';
import _isEqual from 'lodash.isequal';

import AnimatorContainer from '../animator.container';

const snapshot = (payload, object) => {
	payload.push(JSON.parse(JSON.stringify(object))); // get rid of reference
};

class BFS extends Component {
	static bfs(startVertex, graph) {
		const steps = [];
		const q = [];
		const vis = Array(graph.nodeCount).fill(false);

		const snap = (highlightCode, explanation, currentNode, currentEdge) => snapshot(steps, {
			code: [highlightCode],
			explanation: [explanation],
			// graph: {
			// 	nodeCount: graph.nodeCount,
			// 	currentNode,
			// 	currentEdge,
			// 	pastNodes: vis.map((v, i) => ((v !== true) ? -1 : i)).filter(v => (v !== -1)), // to high
			// 	futureNodes: new Set(q),
			// },
			table: [
				{
					width: 150,
					columns: [
						{ title: 'Node' },
						{ title: 'Visited' }
					],
					data: vis.map((Visited, Node) => ({
						Visited: Visited.toString(),
						Node
					}))
				},
				{
					width: 75,
					columns: [
						{ title: 'Queue' }
					],
					data: q.map((Queue) => ({
						Queue
					}))
				},
			]
		});

		snap([], undefined);
		const st = startVertex;
		q.push(st);
		snap([0, 1], BFS.steps[0](st), st);
		while (q.length !== 0) {
			snap([2], BFS.steps[1](q));
			const v = q.shift();
			snap([3], BFS.steps[2](v), v);
			vis[v] = true;
			snap([4], BFS.steps[3](v), v);
			graph.edges[v].forEach(u => {
				snap([5], BFS.steps[4](u, v), u, [u, v]);
				if (vis[u]) {
					snap([6], BFS.steps[5](u), u, [u, v]);
					return;
				}
				q.push(u);
				snap([7], BFS.steps[6](u), u, [u, v]);
			});
		}
		snap([], BFS.steps[7](st));

		return steps;
	}

	static steps = [
		v => `Run BFS from vertex ${v}`,
		q => `Queue is not empty, contains vertexes ${q.join(', ')}`,
		v => `Processing vertex ${v}`,
		v => `Mark vertex ${v} visited`,
		(u, v) => `Processing the neighbour ${u} of vertex ${v}`,
		u => `Vertex ${u} is visited`,
		u => `Vertex ${u} is not visited, push to queue`,
		s => `BFS(${s}) completed`
	]

	static code = [
		'BFS(s):',
		'    Q = {s}; // FIFO',
		'    while Q is not empty',
		'        v = Q.front(); Q.pop();',
		'        mark v visited',
		'        for each neighbour u of v',
		'            if u is visited already, continue;',
		'            else, Q.push(u);'
	]

	constructor(props) {
		super(props);

		this.state = {
			startVertex: 0,
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
			},
			steps: {}
		};
		this.state.steps = BFS.bfs(this.state.startVertex, this.state.graph);
	}

	inputChange = {
		fields: ['startVertex', 'graph'],
		handler: (startVertex, graph) => this.setState(prevState => {
			const newSteps = BFS.bfs(startVertex, graph);
			return {
				startVertex,
				graph: _isEqual(prevState.graph, graph) ? prevState.graph : graph,
				steps: _isEqual(prevState.steps, newSteps) ? prevState.steps : newSteps
			};
		})
	}

	render() {
		return (
			<AnimatorContainer
				{...this.props}

				steps={this.state.steps}

				algorithmName={'BFS'}
				algorithmCode={BFS.code}
				algorithmGraph={this.state.graph}
				algorithmInputChange={this.inputChange}
			/>
		);
	}
}

export default BFS;
