import React, { Component } from 'react';
import _isEqual from 'lodash.isequal';

import AnimatorContainer from './animator.container';

const snapshot = (payload, object) => {
	payload.push(JSON.parse(JSON.stringify(object))); // get rid of reference
};

const snapFactoryFactory = (graph, frames) => (vis, q) =>
	(highlightCode, explanation, currentNode, currentEdge) => snapshot(frames, {
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

export const AlgorithmFactory = (opti) => {
	const AlgorithmPrototype = class extends Component {
		static logic = (...params) => {
			const frames = [];
			opti.mainLogic(...params, frames);
			return frames;
		}

		static steps = opti.steps
		static code = opti.code

		constructor(props) {
			super(props);

			this.state = opti.initialState;
			this.state.frames = AlgorithmPrototype.logic(...opti.inputFields.map(x => this.state[x]));
		}

		inputChange = {
			fields: opti.inputFields,
			handler: opti.inputHandler(newState => this.setState(prevState => {
				Object.keys(newState).forEach(key => {
					if (!_isEqual(newState[key], prevState[key])) {
						prevState[key] = newState[key];
					}
				});
				return { ...prevState }; // just wanted to renew the reference
			}))
		}

		render() {
			return (
				<AnimatorContainer
					{...this.props}
					{...opti.passDown(this)}

					frames={this.state.frames}

					algorithmName={opti.name}
					algorithmCode={AlgorithmPrototype.code}
					algorithmInputChange={this.inputChange}
				/>
			);
		}
	};

	console.log(AlgorithmPrototype);

	return AlgorithmPrototype;
};

export const GraphAlgorithmFactory = opti => {
	const { logic, defaultGraph, ...passOpti } = opti;
	passOpti.mainLogic = (startVertex, graph, frames) =>
		logic(startVertex, graph, snapFactoryFactory(graph, frames));
	passOpti.initialState = {
		startVertex: 0,
		graph: defaultGraph
	};
	passOpti.inputFields = ['startVertex', 'graph'];
	passOpti.inputHandler = callback => (startVertex, graph) => { // FIXME mv up
		const frames = [];
		passOpti.mainLogic(startVertex, graph, frames);
		callback({ startVertex, graph, frames });
	};
	passOpti.passDown = that => ({
		algorithmGraph: that.state.graph
	});

	return AlgorithmFactory(passOpti);
};
