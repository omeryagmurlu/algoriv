import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AlgorithmView from 'App/views/algorithm.view';
import Animator from 'App/animator';

class AnimatorContainer extends Component {
	constructor(props) {
		super(props);

		this.animator = new Animator(props.frames, this.handleAnimatorChange);
		this.state = {
			animationDirectives: this.animator.getDirectives(),
			speed: this.animator.getSpeed(),
			progress: this.animator.getProgress(),
			isPaused: this.animator.getIsPaused(),
			nextFrameTime: this.animator.getNextFrameTime()
		};
	}

	componentDidMount() {
		this.animator.mount();
	}

	componentWillReceiveProps(newProps) {
		if (newProps.frames === this.props.frames) {
			return;
		}

		this.animator.unmount();
		this.animator = new Animator(newProps.frames, this.handleAnimatorChange);
		this.handleAnimatorChange();
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
			isPaused: this.animator.getIsPaused(),
			nextFrameTime: this.animator.getNextFrameTime()
		});
	}

	render() {
		const { frames, ...propsToPass } = this.props;
		return (
			<AlgorithmView
				{...propsToPass}

				animationDirectives={this.state.animationDirectives}
				animationSpeed={this.state.speed}
				animationProgress={this.state.progress}
				animationIsPaused={this.state.isPaused}
				animationNextFrameTime={this.state.nextFrameTime}

				onAnimationChangeSpeed={this.animator.changeSpeed}
				onAnimationToBegin={this.animator.toBegin}
				onAnimationStepForward={this.animator.stepForward}
				onAnimationPauseRestart={this.animator.pauseRestart}
				onAnimationStepBackward={this.animator.stepBackward}
				onAnimationToEnd={this.animator.toEnd}
			/>
		);
	}
}

AnimatorContainer.propTypes = {
	frames: PropTypes.array.isRequired
};

export default AnimatorContainer;
