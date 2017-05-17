import React, { Component } from 'react';
import _pickBy from 'lodash.pickby';

import AnimatorContainer from 'app/containers/AnimatorContainer';

export const snapshot = (payload, object) => {
	payload.push(JSON.parse(JSON.stringify(object))); // get rid of reference
};

export const snapFactoryProxy = (frames, fn) =>
	(...params) => snapshot(frames, fn(...params));

const filterObjectByKeys = (obj, arr) => _pickBy(obj, (v, k) => (typeof arr[k] !== 'undefined'));

const AlgorithmFactory = ({
	logic: algLogic,
	snap: algSnap,
	input: algInput,
	inputType: algInputType,
	info: algInfo,
	modules: algModules
}) => ((({
	revampedAlgInputType
}) => class AlgorithmPrototype extends Component {
	static logic = input => {
		const frames = [];
		algLogic(input, snapFactoryProxy(frames, algSnap));
		return frames;
	}

	static selectInput = inType => revampedAlgInputType.filter(
		({ inputType: { type } }) => type === inType
	)

	constructor(props) {
		super(props);

		this.state = { ...algInput }; // BUGFIX: multiple instances, deepCopy needed
		this.state.frames = AlgorithmPrototype.logic(algInput);
	}

	inputHandler(inputObj, cb) {
		this.setState(prevState => {
			const newState = { ...prevState, ...inputObj };
			newState.frames = AlgorithmPrototype.logic(filterObjectByKeys(newState, algInput));
			return newState;
		}, cb);
	}

	getInput = () => filterObjectByKeys(this.state, algInput)

	inputs = () => revampedAlgInputType.map(({ inputName, inputType: { type, invalid, data } }) => ({
		type,
		data,
		value: JSON.parse(JSON.stringify(this.getInput()[inputName])),
		validate: newInput => !invalid(newInput, this.getInput()),
		update: (newInput, cb = () => {}) => {
			const error = invalid(newInput, this.getInput());
			if (error) {
				return cb(error);
			}

			return this.inputHandler({
				[inputName]: newInput
			}, cb);
		}
	}))

	render() {
		return (
			<AnimatorContainer
				{...this.props}

				frames={this.state.frames}

				// NOTE: I hated doing this, but modules should be wrapped like snaps,
				// 		 since they all get combined together at the end.
				algorithmInfo={algInfo}
				algorithmStatic={JSON.parse(JSON.stringify(algModules))}
				algorithmInput={this.inputs()}
			/>
		);
	}
})({
	revampedAlgInputType: Object.keys(algInputType).reduce((acc, key) =>
		acc.concat((Array.isArray(algInputType[key])
			? algInputType[key]
			: [algInputType[key]]
		).map(v => ({
			inputName: key,
			inputType: v
		})))
	, [])
}));

export default AlgorithmFactory;
