import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'rc-progress';
import Slider from 'rc-slider';

import Header from './header.component';
import AlgorithmDetail from './algorithm_detail.component';

const AlgorithmView = props => (
	<div className="AlgorithmView">
		<Header algorithm={props.algorithm} />
		<AlgorithmDetail algorithm={props.algorithm} animationDirectives={props.animationDirectives} />
		<footer>
			<Slider	max={10} min={0} value={props.speed} onChange={props.onChangeSpeed} />
			<button id="toBegin" onClick={props.onToBegin} />
			<button id="stepBackward" onClick={props.onStepBackward} />
			<button id="pauseRestart" onClick={props.onPauseRestart} />
			<button id="stepForward" onClick={props.onStepForward} />
			<button id="toEnd" onClick={props.onToEnd} />
			<Line percent={props.progress} strokeWidth="4" strokeColor="#D3D3D3" />
		</footer>
	</div>
);

AlgorithmView.propTypes = {
	animationDirectives: PropTypes.object.isRequired,
	algorithm: PropTypes.object.isRequired,
	speed: PropTypes.number.isRequired,
	progress: PropTypes.number.isRequired,
	// isPaused: PropTypes.boolean.isRequired,

	onChangeSpeed: PropTypes.func.isRequired,
	onToBegin: PropTypes.func.isRequired,
	onStepForward: PropTypes.func.isRequired,
	onPauseRestart: PropTypes.func.isRequired,
	onStepBackward: PropTypes.func.isRequired,
	onToEnd: PropTypes.func.isRequired
};

export default AlgorithmView;
