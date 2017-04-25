import React, { Component } from 'react';
import _pickBy from 'lodash.pickby';

import AnimatorContainer from './animator.container';

export const snapshot = (payload, object) => {
	payload.push(JSON.parse(JSON.stringify(object))); // get rid of reference
};

export const snapFactoryProxy = (frames, prototype) =>
	(...outerParams) => {
		const instance = prototype(...outerParams);
		return (...innerParams) => snapshot(frames, instance(...innerParams));
	};

const filterObjectByKeys = (obj, arr) => _pickBy(obj, (v, k) => (typeof arr[k] !== 'undefined'));

const AlgorithmFactory = opts => class AlgorithmPrototype extends Component {
	static logic = input => {
		const frames = [];
		opts.logic(input, snapFactoryProxy(frames, opts.snap));
		return frames;
	}

	constructor(props) {
		super(props);

		this.state = opts.input;
		this.state.frames = AlgorithmPrototype.logic(opts.input);
	}

	inputChange = {
		fields: Object.keys(opts.input),
		handler: input => this.setState(prevState => {
			const newState = { ...prevState, ...input };
			newState.frames = AlgorithmPrototype.logic(filterObjectByKeys(newState, opts.input));
			return newState;
		})
	}

	render() {
		return (
			<AnimatorContainer
				{...this.props}

				frames={this.state.frames}

				algorithmStatic={opts.modules(filterObjectByKeys(this.state, opts.input))}
				algorithmInfo={opts.info}
				algorithmInputChange={this.inputChange}
			/>
		);
	}
};

export default AlgorithmFactory;
