import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AlgorithmView from 'app/views/AlgorithmView';
import Animator from './features/animator';

class AnimatorContainer extends Component {
	constructor(props) {
		super(props);

		this.animator = new Animator(props.frames, () => props.app.settings('options')('animation'), this.handleAnimatorChange);
		this.state = this.changes();
	}

	componentDidMount() {
		this.animator.mount();
	}

	componentWillReceiveProps(newProps) {
		if (newProps.frames === this.props.frames) {
			return;
		}

		this.animator.refresh(newProps.frames);
	}

	componentWillUnmount() {
		this.animator.unmount();
	}

	handleAnimatorChange = (reason) => {
		this.setState(this.changes());
		if (reason === 'end') {
			this.props.callback();
		}
	}

	changes = () => ({
		animationDirectives: this.animator.getDirectives(),
		speed: this.animator.getSpeed(),
		progress: this.animator.getProgress(),
		isPaused: this.animator.getIsPaused(),
		nextFrameTime: this.animator.getNextFrameTime()
	})

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

AnimatorContainer.defaultProps = {
	callback: () => {}
};

AnimatorContainer.propTypes = {
	app: PropTypes.any.isRequired,
	frames: PropTypes.array.isRequired,
	callback: PropTypes.func
};

export default AnimatorContainer;
