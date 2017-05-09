import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'material-ui/Slider';
import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';
import injectTapEventPlugin from 'react-tap-event-plugin';

import AvSkipPrevious from 'material-ui/svg-icons/av/skip-previous';
import AvFastRewind from 'material-ui/svg-icons/av/fast-rewind';
import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import AvPause from 'material-ui/svg-icons/av/pause';
import AvFastForward from 'material-ui/svg-icons/av/fast-forward';
import AvSkipNext from 'material-ui/svg-icons/av/skip-next';

import Header from 'App/components/header.component';
import AlgorithmInner from 'App/components/algorithm-inner.component';

injectTapEventPlugin();

const AlgorithmView = props => {
	const {
		animationSpeed,
		animationIsPaused,
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
					step={1}
					value={animationSpeed}
					defaultValue={animationSpeed}
					onChange={(_, v) => onAnimationChangeSpeed(v)}
				/>
				<FlatButton icon={<AvSkipPrevious />} id="toBegin" onTouchTap={onAnimationToBegin} />
				<FlatButton icon={<AvFastRewind />} id="stepBackward" onTouchTap={onAnimationStepBackward} />
				<FlatButton icon={animationIsPaused ? <AvPlayArrow /> : <AvPause />} id="pauseRestart" onTouchTap={onAnimationPauseRestart} />
				<FlatButton icon={<AvFastForward />} id="stepForward" onTouchTap={onAnimationStepForward} />
				<FlatButton icon={<AvSkipNext />} id="toEnd" onTouchTap={onAnimationToEnd} />
				<LinearProgress value={props.animationProgress} mode="determinate" />
			</footer>
		</div>
	);
};

AlgorithmView.propTypes = {
	animationSpeed: PropTypes.number.isRequired,
	animationProgress: PropTypes.number.isRequired,
	animationIsPaused: PropTypes.bool.isRequired,
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
