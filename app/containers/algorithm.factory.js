import React, { Component } from 'react';
import _isEqual from 'lodash.isequal';
import _mapValues from 'lodash.mapvalues';

import AnimatorContainer from './animator.container';

export const AlgorithmFactory = opts => class AlgorithmPrototype extends Component {
	static logic = input => {
		const output = { frames: [] }; // Frames is a necessary output
		opts.logic({ input, output });
		return output;
	}

	static steps = opts.steps
	static code = opts.code

	constructor(props) {
		super(props);

		this.state = opts.initialInput;
		Object.assign(this.state, AlgorithmPrototype.logic(opts.initialInput));
	}

	inputChange = {
		fields: opts.inputFields,
		handler: input => this.setState(prevState => {
			const newState = { ...input };
			Object.assign(newState,	AlgorithmPrototype.logic(input));
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
				{..._mapValues(opts.outputFields, v => this.state[v])}

				frames={this.state.frames}

				algorithmName={opts.name}
				algorithmCode={AlgorithmPrototype.code}
				algorithmInputChange={this.inputChange}
			/>
		);
	}
};

export const GraphAlgorithmFactory = ({
	logic,
	defaultGraph,
	initialInput = {},
	inputFields = {},
	outputFields = {},
	...passOpts
}) => AlgorithmFactory({
	logic: ({ input, output: { frames, ...output } }) =>
		logic({ input, output }, snapFactoryFactory(frames)),
	initialInput: {
		startVertex: 0,
		graph: defaultGraph,
		...initialInput,
	},
	inputFields: {
		startVertex: 'startVertex',
		graph: 'graph',
		...inputFields,
	},
	outputFields: {
		algorithmGraph: 'graph',
		...outputFields,
	},
	...passOpts,
});
