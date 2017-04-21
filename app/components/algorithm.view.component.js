import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'rc-progress';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';

import Header from './header.component';
import AlgorithmInner from './algorithm_inner.component';

const AlgorithmView = props => {
	const {
		animationSpeed,
		onAnimationChangeSpeed,
		onAnimationToBegin,
		onAnimationToEnd,
		onAnimationStepBackward,
		onAnimationPauseRestart,
		onAnimationStepForward,
		...passProps
	} = props;
	return (
		<div className="AlgorithmView">
			<Header info={props.algorithmInfo} />
			<AlgorithmInner
				{...passProps}
			/>
			<footer>
				<Slider
					max={100}
					min={0}
					value={animationSpeed}
					onChange={onAnimationChangeSpeed}
				/>
				<button id="toBegin" onClick={onAnimationToBegin} />
				<button id="stepBackward" onClick={onAnimationStepBackward} />
				<button id="pauseRestart" onClick={onAnimationPauseRestart} />
				<button id="stepForward" onClick={onAnimationStepForward} />
				<button id="toEnd" onClick={onAnimationToEnd} />
				<Line percent={props.animationProgress} strokeWidth="4" strokeColor="#D3D3D3" />
			</footer>
		</div>
	);
};

AlgorithmView.propTypes = {
	animationSpeed: PropTypes.number.isRequired,
	animationProgress: PropTypes.number.isRequired,
	// animationIsPaused: PropTypes.boolean.isRequired,
	onAnimationChangeSpeed: PropTypes.func.isRequired,
	onAnimationToBegin: PropTypes.func.isRequired,
	onAnimationStepForward: PropTypes.func.isRequired,
	onAnimationPauseRestart: PropTypes.func.isRequired,
	onAnimationStepBackward: PropTypes.func.isRequired,
	onAnimationToEnd: PropTypes.func.isRequired,

	algorithmInfo: PropTypes.object.isRequired,
	algorithmInputChange: PropTypes.shape({
		fields: PropTypes.arrayOf(PropTypes.string).isRequired,
		handler: PropTypes.func.isRequired
	}).isRequired
};

export default AlgorithmView;
