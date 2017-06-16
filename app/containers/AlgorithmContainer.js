import React, { Component } from 'react';
import _pickBy from 'lodash.pickby';
import _mapValues from 'lodash.mapvalues';
import { makeCancelable, cancelCatch, AlgorithmError } from 'app/utils';

import AnimatorContainer from 'app/containers/AnimatorContainer';
import LoadingView from 'app/views/LoadingView';

const snapshot = (payload, object) => {
	payload.push(JSON.parse(JSON.stringify(object))); // get rid of reference
};

const snapProxy = (frames, fn) =>
	(...params) => snapshot(frames, fn(...params)); // params passed to frame are passed to snap

const filterObjectByKeys = (obj, arr) => _pickBy(obj, (v, k) => (typeof arr[k] !== 'undefined'));

export const framer = (logic, snap) => (input) => {
	const frames = [];
	return Promise.resolve(logic(input, snapProxy(frames, snap)))
		.then((optEndInput) => {
			if (frames.length === 0) {
				throw AlgorithmError('Algorithm must frame at least once');
			}

			return [frames, optEndInput];
		});
};

const AlgorithmFactory = ({
	logic: algLogic,
	input: algInput,
	initInputs: algInitInput,
	snap: algSnap,
	modules: algModules,
	modulesInputProps: algModulesInputProps,
	info: algInfo,
}) => ((() => class AlgorithmPrototype extends Component {
	logic = (input) => framer(algLogic, algSnap)(input).then(([frames, optEndInput]) => {
		this.setState({ callback: () => {
			this.lastLogicEndInput = typeof optEndInput === 'object' ? optEndInput : {};
		} });
		return frames;
	})

	constructor(props) {
		super(props);

		this.state = {
			input: { ...algInput }, // BUGFIX: multiple instances, deepCopy needed
			frames: null,
			callback: null,
			updating: true
		};

		this.cancellables = [];
		this.lastLogicEndInput = {};
	}

	componentDidMount() {
		this.cancellable(this.logic(algInput))
		.then(frames => {
			this.setState({ frames, updating: false });
		}).catch(cancelCatch);
		// .catch(err => {
		// 	throw new Error(`Algorithm can't init, ${err}`);
		// });
	}

	componentWillUnmount() {
		this.lastLogicEndInput = {};
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
		const overridedNewInput = { ...inputObj, ...this.lastLogicEndInput };
		this.lastLogicEndInput = {};

		this.setState({ updating: true });
		const currentNewInput = { ...this.state.input, ...overridedNewInput };
		this.cancellable(this.logic(
			filterObjectByKeys(currentNewInput, algInput)
		)).then(frames => {
			this.setState(prev => {
				prev.input = {
					...prev.input,
					...overridedNewInput,
				};
				prev.frames = frames;
				prev.updating = false;
				return prev;
			}, cb);
		}).catch(cancelCatch).catch(err => {
			throw new Error(`Input is faulty, ${err}`);
		});
	}

	getInput = () => _mapValues(filterObjectByKeys(this.state.input, algInput), (v, k) => ({
		value: v,
		update: (newInput, cb = () => {}) => this.inputHandler({
			[k]: newInput
		}, cb)
	}))

	render() {
		const inputProps = algModulesInputProps(this.getInput());
		return (
			<LoadingView
				{...this.props}
				overlay={this.state.frames ? (<AnimatorContainer
					{...this.props}

					frames={this.state.frames}
					callback={this.state.callback}

					algorithmInfo={algInfo}
					algorithmStatic={_mapValues((typeof algModules === 'function' ? algModules(this.props.app.settings) : algModules), (v, k) => ({
						...v,
						input: inputProps[k]
					}))}
					algorithmInitInput={algInitInput(this.getInput())}
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
})({}));

export default AlgorithmFactory;
