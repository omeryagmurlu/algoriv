import React from 'react';
import PropTypes from 'prop-types';
import InputRange from 'react-input-range';
import { Line } from 'rc-progress';

import Header from './header.component';
import AlgorithmDetail from './algorithm_detail.component';

const AlgorithmView = props => (
	<div className="AlgorithmView">
		<Header algorithm={props.algorithm} />
		<AlgorithmDetail algorithm={props.algorithm} />
		<footer>
			<InputRange
				maxValue={10}
				minValue={0}
				value={props.animationControls.speed}
				onChange={props.animationControls.changeSpeed}
			/>
			<button id="toBegin" onClick={props.animationControls.toBegin} />
			<button id="stepForward" onClick={props.animationControls.stepForward} />
			<button id="pauseRestart" onClick={props.animationControls.pauseRestart} />
			<button id="stepBackward" onClick={props.animationControls.stepBackward} />
			<button id="toEnd" onClick={props.animationControls.toEnd} />
			<Line percent={props.animationControls.progress} strokeWidth="4" strokeColor="#D3D3D3" />
		</footer>
	</div>
);

AlgorithmView.propTypes = {
	algorithm: PropTypes.object.isRequired,
	animationControls: PropTypes.shape({
		speed: PropTypes.number.isRequired,
		changeSpeed: PropTypes.func.isRequired,
		progress: PropTypes.number.isRequired,
		toBegin: PropTypes.func.isRequired,
		stepForward: PropTypes.func.isRequired,
		pauseRestart: PropTypes.func.isRequired,
		stepBackward: PropTypes.func.isRequired,
		toEnd: PropTypes.func.isRequired,
	}).isRequired
};

export default AlgorithmView;
