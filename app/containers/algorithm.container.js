import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AlgorithmView from '../components/algorithm.view.component';
import Animator from '../animator';

class AlgorithmContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			animationDirectives: {}
		};

		this.animator = new Animator(
			props.steps,
			animationDirectives => this.setState({ animationDirectives })
		);
	}

	componentDidMount() {
		this.animator.mount();
	}

	componentWillUnmount() {
		this.animator.unmount();
	}

	render() {
		return (
			<AlgorithmView
				inputResolver={this.props.inputResolver}
				animationControls={{
					speed: this.animator.speed,
					// not using state here, can cause problems FIXME
					changeSpeed: speed => this.animator.changeSpeed(speed),
					progress: this.animator.progress,
					didEnd: this.animator.didEnd,
					toBegin: () => this.animator.toBegin(),
					stepForward: () => this.animator.stepForward(),
					pauseRestart: () => this.animator.pauseRestart(),
					stepBackward: () => this.animator.stepBackward(),
					toEnd: () => this.animator.toEnd(),
				}}
				animationDirectives={this.state.animationDirectives}
			/>
		);
	}
}

AlgorithmContainer.propTypes = {
	steps: PropTypes.array.isRequired,
	inputResolver: PropTypes.func.isRequired,
	// algorithm: PropTypes.shape({
	// 	type: PropTypes.string.isRequired
	// }).isRequired
};

export default AlgorithmContainer;
