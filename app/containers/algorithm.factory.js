import React, { Component } from 'react';
import _isEqual from 'lodash.isequal';

import AnimatorContainer from './animator.container';

const snapshot = (payload, object) => {
	payload.push(JSON.parse(JSON.stringify(object))); // get rid of reference
};

const snap = (graph) => (steps, vis, q) =>
	(highlightCode, explanation, currentNode, currentEdge) => snapshot(steps, {
		code: [highlightCode],
		explanation: [explanation],
		// graph: {
		// 	nodeCount: graph.nodeCount,
		// 	currentNode,
		// 	currentEdge,
		// 	pastNodes: vis.map((v, i) =>
		//		((v !== true) ? -1 : i)).filter(v => (v !== -1)), // to high
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

const AlgorithmFactory = (opti) => {
	const Proto = class extends Component {
		static mainLogic = opti.mainLogic
		static steps = opti.steps
		static code = opti.code

		constructor(props) {
			super(props);

			this.state = opti.initialState;
		}

		inputChange = {
			fields: opti.inputFields,
			handler: opti.inputHandler(newState => this.setState(prevState => {
				Object.keys(newState).forEach(key => {
					if (!_isEqual(newState[key], prevState[key])) {
						prevState[key] = newState[key];
					}
				});
				return prevState;
			}))
		}

		render() {
			return (
				<AnimatorContainer
					{...this.props}
					{...opti.passDown}

					steps={this.state.steps}

					algorithmName={opti.name}
					algorithmCode={Proto.code}
					algorithmInputChange={this.inputChange}
				/>
			);
		}
	};

	console.log(Proto);

	return Proto;
};

const GraphAlgorithmFactory = (opti) => {
	const Proto = class extends Component {
		static mainLogic = (startVertex, graph) => opti.logic(graph, startVertex, snap(graph))
		static steps = opti.steps
		static code = opti.code

		constructor(props) {
			super(props);

			this.state = {
				startVertex: 0,
				graph: opti.defaultGraph,
				steps: {}
			};
			this.state.steps = Proto.mainLogic(this.state.startVertex, this.state.graph);
		}

		inputChange = {
			fields: ['startVertex', 'graph'],
			handler: (startVertex, graph) => this.setState(prevState => {
				const newSteps = Proto.mainLogic(startVertex, graph);
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

					algorithmName={opti.name}
					algorithmCode={Proto.code}
					algorithmGraph={this.state.graph}
					algorithmInputChange={this.inputChange}
				/>
			);
		}
	};

	console.log(Proto);

	return Proto;
};

export default GraphAlgorithmFactory;
