import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AlgorithmView from '../components/algorithm.view.component';
import Animator from '../animator';

class AnimatorContainer extends Component {
	constructor(props) {
		super(props);

		this.animator = new Animator(props.frames, this.handleAnimatorChange);
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
		const { frames, ...propsToPass } = this.props;
		return (
			<AlgorithmView
				{...propsToPass}

				animationDirectives={this.state.animationDirectives}
				animationSpeed={this.state.speed}
				animationProgress={this.state.progress}
				animationIsPaused={this.state.isPaused}

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
