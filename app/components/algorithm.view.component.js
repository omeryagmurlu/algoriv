import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'rc-progress';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';

import Header from './header.component';
import AlgorithmInner from './algorithm_inner.component';

const AlgorithmView = props => (
	<div className="AlgorithmView">
		<Header name={props.algorithmName} />
		<AlgorithmInner
			algorithmName={props.algorithmName}
			algorithmCode={props.algorithmCode}
			algorithmGraph={props.algorithmGraph}
			algorithmInputChange={props.algorithmInputChange}
			animationDirectives={props.animationDirectives}
		/>
		<footer>
			<Slider
				max={100}
				min={0}
				value={props.animationSpeed}
				onChange={props.onAnimationChangeSpeed}
			/>
			<button id="toBegin" onClick={props.onAnimationToBegin} />
			<button id="stepBackward" onClick={props.onAnimationStepBackward} />
			<button id="pauseRestart" onClick={props.onAnimationPauseRestart} />
			<button id="stepForward" onClick={props.onAnimationStepForward} />
			<button id="toEnd" onClick={props.onAnimationToEnd} />
			<Line percent={props.animationProgress} strokeWidth="4" strokeColor="#D3D3D3" />
		</footer>
	</div>
);

AlgorithmView.propTypes = {
	animationDirectives: PropTypes.object.isRequired,
	animationSpeed: PropTypes.number.isRequired,
	animationProgress: PropTypes.number.isRequired,
	// animationIsPaused: PropTypes.boolean.isRequired,
	onAnimationChangeSpeed: PropTypes.func.isRequired,
	onAnimationToBegin: PropTypes.func.isRequired,
	onAnimationStepForward: PropTypes.func.isRequired,
	onAnimationPauseRestart: PropTypes.func.isRequired,
	onAnimationStepBackward: PropTypes.func.isRequired,
	onAnimationToEnd: PropTypes.func.isRequired,

	algorithmName: PropTypes.string.isRequired,
	algorithmGraph: PropTypes.object.isRequired,
	algorithmCode: PropTypes.arrayOf(PropTypes.string),
	algorithmInputChange: PropTypes.shape({
		fields: PropTypes.arrayOf(PropTypes.string).isRequired,
		handler: PropTypes.func.isRequired
	}).isRequired
};

AlgorithmView.defaultProps = {
	algorithmCode: []
};

export default AlgorithmView;
