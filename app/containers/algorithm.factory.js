import React, { Component } from 'react';
import _pickBy from 'lodash.pickby';
import _mapValues from 'lodash.mapvalues';
import _values from 'lodash.values';

import AnimatorContainer from 'app/containers/animator.container';

export const snapshot = (payload, object) => {
	payload.push(JSON.parse(JSON.stringify(object))); // get rid of reference
};

export const snapFactoryProxy = (frames, prototype) =>
	(...outerParams) => {
		const instance = prototype(...outerParams);
		return (...innerParams) => snapshot(frames, instance(...innerParams));
	};

const filterObjectByKeys = (obj, arr) => _pickBy(obj, (v, k) => (typeof arr[k] !== 'undefined'));

const AlgorithmFactory = ({
	logic: algLogic,
	snap: algSnap,
	input: algInput,
	inputType: algInputType,
	info: algInfo,
	modules: algModules
}) => class AlgorithmPrototype extends Component {
	static logic = input => {
		const frames = [];
		algLogic(input, snapFactoryProxy(frames, algSnap));
		return frames;
	}

	constructor(props) {
		super(props);

		this.state = algInput;
		this.state.frames = AlgorithmPrototype.logic(algInput);
	}

	inputHandler(inputObj, cb) {
		this.setState(prevState => {
			const newState = { ...prevState, ...inputObj };
			newState.frames = AlgorithmPrototype.logic(filterObjectByKeys(newState, algInput));
			return newState;
		}, cb);
	}

	customInput = {
		fields: Object.keys(algInput).filter(key => algInputType[key].type === 'custom'),
		handler: (inputObj, cb) => this.inputHandler(inputObj, cb)
	}

	initInput = _values(_mapValues(
		_pickBy(algInputType, ({ type }) => type === 'init'),
		({ type, ...others }, key) => ({
			...others,
			handler: (data, cb) => this.inputHandler({
				[key]: data
			}, cb)
		})
	))

	render() {
		return (
			<AnimatorContainer
				{...this.props}

				frames={JSON.parse(JSON.stringify(this.state.frames))}

				algorithmStatic={algModules(filterObjectByKeys(this.state, algInput))}
				algorithmInfo={algInfo}
				algorithmCustomInput={this.customInput}
				algorithmInitInput={this.initInput}
			/>
		);
	}
};

export default AlgorithmFactory;
