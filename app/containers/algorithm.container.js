import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AlgorithmView from '../components/algorithm.view.component';
import Animator from '../animator';

class AlgorithmContainer extends Component {
	constructor(props) {
		super(props);

		this.animator = new Animator(props.steps, this.handleAnimatorChange);
		this.state = {
			animationDirectives: this.animator.getDirectives(),
			speed: this.animator.getSpeed(),
			progress: this.animator.getProgress(),
			isPaused: this.animator.getIsPaused()
		};
	}

	componentDidMount() {
		this.animator.mount();
	}

	componentWillUnmount() {
		this.animator.unmount();
	}

	handleAnimatorChange = () => {
		this.setState({
			animationDirectives: this.animator.getDirectives(),
			speed: this.animator.getSpeed(),
			progress: this.animator.getProgress(),
			isPaused: this.animator.getIsPaused()
		});
	}

	render() {
		const { steps, ...propsToPass } = this.props;
		return (
			<AlgorithmView
				{...propsToPass}

				animationDirectives={this.state.animationDirectives}
				speed={this.state.speed}
				progress={this.state.progress}
				isPaused={this.state.isPaused}

				onChangeSpeed={this.animator.changeSpeed}
				onToBegin={this.animator.toBegin}
				onStepForward={this.animator.stepForward}
				onPauseRestart={this.animator.pauseRestart}
				onStepBackward={this.animator.stepBackward}
				onToEnd={this.animator.toEnd}
			/>
		);
	}
}

AlgorithmContainer.propTypes = {
	steps: PropTypes.array.isRequired
};

export default AlgorithmContainer;
