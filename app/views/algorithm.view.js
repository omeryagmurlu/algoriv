import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'material-ui/Slider';
import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';

import AvSkipPrevious from 'material-ui/svg-icons/av/skip-previous';
import AvFastRewind from 'material-ui/svg-icons/av/fast-rewind';
import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import AvPause from 'material-ui/svg-icons/av/pause';
import AvFastForward from 'material-ui/svg-icons/av/fast-forward';
import AvSkipNext from 'material-ui/svg-icons/av/skip-next';
import ContentSend from 'material-ui/svg-icons/content/send';

import AlgorithmInner from 'app/components/algorithm-inner.component';

import InformationDemandingButton from 'app/components/InformationDemandingButton';

const AlgorithmView = props => {
	const {
		algorithmInitInput,
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
				<InformationDemandingButton
					activeIcon={<ContentSend />}
					passiveIcon={animationIsPaused ? <AvPlayArrow /> : <AvPause />}
					demandCondition={props.animationProgress === 0}
					demandings={algorithmInitInput.map(({ description: text, handler }) => ({
						text,
						handler
					}))}
					resolve={onAnimationPauseRestart}
					formatter={parseInt}
				/>
				<FlatButton icon={<AvFastForward />} id="stepForward" onTouchTap={onAnimationStepForward} />
				<FlatButton icon={<AvSkipNext />} id="toEnd" onTouchTap={onAnimationToEnd} />
				<LinearProgress value={props.animationProgress} mode="determinate" />
			</footer>
		</div>
	);
};

AlgorithmView.defaultProps = {
	algorithmInitInput: []
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

	algorithmInitInput: PropTypes.arrayOf(PropTypes.shape({
		description: PropTypes.string.isRequired,
		handler: PropTypes.func.isRequired
	})),
	algorithmInfo: PropTypes.object.isRequired
};

export default AlgorithmView;
