import React, { Component } from 'react';
import _isEqual from 'lodash.isequal';

import AnimatorContainer from './animator.container';

const snapshot = (payload, object) => {
	payload.push(JSON.parse(JSON.stringify(object))); // get rid of reference
};

const snapFactoryFactory = (frames) => (vis, q) =>
	(highlightCode, explanation, currentNode, currentEdge) => snapshot(frames, {
		code: [highlightCode],
		explanation: [explanation],
		// graph: {
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

export const AlgorithmFactory = opts => class AlgorithmPrototype extends Component {
	static logic = input => {
		const frames = [];
		opts.logic(input, frames);
		return frames;
	}

	static steps = opts.steps
	static code = opts.code

	constructor(props) {
		super(props);

		this.state = opts.initialState;
		this.state.frames = AlgorithmPrototype.logic(opts.inputFields.reduce((acc, v) => {
			acc[v] = this.state[v];
			return acc;
		}, {}));
	}

	inputChange = {
		fields: opts.inputFields,
		handler: input => this.setState(prevState => {
			const newState = { ...input, frames: AlgorithmPrototype.logic(input) };
			Object.keys(newState).forEach(key => {
				if (!_isEqual(newState[key], prevState[key])) {
					prevState[key] = newState[key];
				}
			});
			return { ...prevState }; // just wanted to renew the reference
		})
	}

	render() {
		return (
			<AnimatorContainer
				{...this.props}
				{...opts.passDown(this)}

				frames={this.state.frames}

				algorithmName={opts.name}
				algorithmCode={AlgorithmPrototype.code}
				algorithmInputChange={this.inputChange}
			/>
		);
	}
};

export const GraphAlgorithmFactory = ({ logic, defaultGraph, ...passOpts }) => AlgorithmFactory({
	...passOpts,
	logic: (input, frames) => logic(input, snapFactoryFactory(frames)),
	initialState: {
		startVertex: 0,
		graph: defaultGraph
	},
	inputFields: ['startVertex', 'graph'],
	passDown: that => ({ // FIXME
		algorithmGraph: that.state.graph
	})
});
