import React, { Component } from 'react';
import _pickBy from 'lodash.pickby';
import { makeCancelable, cancelCatch, AlgorithmError } from 'app/utils';

import AnimatorContainer from 'app/containers/AnimatorContainer';
import LoadingView from 'app/views/LoadingView';

const snapshot = (payload, object) => {
	payload.push(JSON.parse(JSON.stringify(object))); // get rid of reference
};

const snapProxy = (frames, fn) =>
	(...params) => snapshot(frames, fn(...params));

const filterObjectByKeys = (obj, arr) => _pickBy(obj, (v, k) => (typeof arr[k] !== 'undefined'));

export const framer = (logic, snap) => (input) => {
	const frames = [];
	return Promise.resolve(logic(input, snapProxy(frames, snap)))
		.catch(err => {
			throw err;
		})
		.then(() => {
			if (frames.length === 0) {
				throw AlgorithmError('Algorithm must frame at least once');
			}
		})
		.then(() => frames);
};

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
	static logic = framer(algLogic, algSnap)

	static selectInput = inType => revampedAlgInputType.filter(
		({ inputType: { type } }) => type === inType
	)

	constructor(props) {
		super(props);

		this.state = { ...algInput }; // BUGFIX: multiple instances, deepCopy needed
		this.state.frames = null; // TODO make a loading screen
		this.state.updating = true;

		this.cancellables = [];
	}

	componentDidMount() {
		this.cancellable(AlgorithmPrototype.logic(algInput))
		.then(frames => {
			this.setState({ frames, updating: false });
		}).catch(cancelCatch).catch(err => {
			throw new Error(`Algorithm can't init, ${err}`);
		});
	}

	componentWillUnmount() {
		this.cancelRunning();
	}

	cancellable = prom => {
		const cancellable = makeCancelable(prom);
		this.cancellables.push(cancellable);
		return cancellable.promise;
	}

	cancelRunning = () => {
		while (this.cancellables.length > 0) {
			this.cancellables.pop().cancel();
		}
	}

	inputHandler(inputObj, cb) {
		this.setState({ updating: true });
		const fakeStateForLogic = { ...this.state, ...inputObj };
		this.cancellable(AlgorithmPrototype.logic(
			filterObjectByKeys(fakeStateForLogic, algInput)
		)).then(frames => {
			this.setState({ ...inputObj, frames, updating: false }, cb);
		}).catch(cancelCatch).catch(err => {
			throw new Error(`Input is faulty, ${err}`);
		});
	}

	getInput = () => filterObjectByKeys(this.state, algInput)

	inputs = () => revampedAlgInputType.map(({ inputName, inputType: { type, invalid, data } }) => ({
		type,
		data,
		value: this.getInput()[inputName],
		validate: newInput => !invalid(newInput, this.getInput()),
		invalid: newInput => invalid(newInput, this.getInput()),
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
			<LoadingView
				{...this.props}
				overlay={this.state.frames ? (<AnimatorContainer
					{...this.props}

					frames={this.state.frames}

					algorithmInfo={algInfo}
					algorithmStatic={typeof algModules === 'function' ? algModules(this.props.app.settings) : algModules}
					algorithmInput={this.inputs()}
				/>) : null}
				disabled={!this.state.updating}
				message={!this.state.frames ? 'Loading Algorithm' : 'Evaluating'}
				tooLongTime={3000}
				tooLongMessage="Algorithm logic is taking too long to compute"
				tooLongEscape={() => {
					this.cancelRunning();
					if (!this.state.frames) {
						return this.props.app.goBack();
					}

					return this.setState({ updating: false });
				}}
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
