import React, { Component } from 'react';
import _isEqual from 'lodash.isequal';

import AlgorithmContainer from '../algorithm.container';
import { AlgorithmsMap } from '../../algorithms';

const snapshot = (payload, object) => {
	payload.push(JSON.parse(JSON.stringify(object))); // get rid of reference
};

class BFS extends Component {
	static bfs(startVertex, graph) {
		const steps = [];
		const q = [];
		const vis = Array(graph.nodeCount);

		const snap = (highlightCode, explain, currentNode, currentEdge) => snapshot(steps, {
			highlightCode,
			explain,
			graph: {
				nodeCount: graph.nodeCount,
				currentNode,
				currentEdge,
				pastNodes: vis.map((v, i) => ((v !== true) ? -1 : i)).filter(v => (v !== -1)), // to high
				futureNodes: new Set(q),
			},
			databases: {
				queue: q,
				visited: vis
			}
		});

		const st = startVertex;
		q.push(st);
		snap([0, 1], AlgorithmsMap.BFS.steps[0](st), st);
		while (q.length !== 0) {
			snap([2], AlgorithmsMap.BFS.steps[1](q));
			const v = q.shift();
			snap([3], AlgorithmsMap.BFS.steps[2](v), v);
			vis[v] = true;
			snap([4], AlgorithmsMap.BFS.steps[3](v), v);
			graph.edges[v].forEach(u => {
				snap([5], AlgorithmsMap.BFS.steps[4](u, v), u, [u, v]);
				if (vis[u]) {
					snap([6], AlgorithmsMap.BFS.steps[5](u), u, [u, v]);
					return;
				}
				q.push(u);
				snap([7], AlgorithmsMap.BFS.steps[6](u), u, [u, v]);
			});
		}

		return steps;
	}

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
		// console.log(this.bfs().map(o => o.explain));
	}

	handleInputChange = (startVertex, graph) => this.setState(prevState => {
		const newSteps = BFS.bfs(startVertex, graph);
		return {
			startVertex,
			graph: _isEqual(prevState.graph, graph) ? prevState.graph : graph,
			steps: _isEqual(prevState.steps, newSteps) ? prevState.steps : newSteps
		};
	})

	render() {
		return (
			<AlgorithmContainer
				{...this.props}

				steps={this.state.steps}
				algorithm={AlgorithmsMap.BFS}

				onInputChange={this.handleInputChange}
			/>
		);
	}
}

export default BFS;
