import React from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Slider from 'material-ui/Slider';
import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';

import AvSkipPrevious from 'material-ui/svg-icons/av/skip-previous';
import AvFastRewind from 'material-ui/svg-icons/av/fast-rewind';
import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import AvPause from 'material-ui/svg-icons/av/pause';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import AvFastForward from 'material-ui/svg-icons/av/fast-forward';
import AvSkipNext from 'material-ui/svg-icons/av/skip-next';
import ContentSend from 'material-ui/svg-icons/content/send';

import { themedStyle, themeVars } from 'app/utils';

import InformationDemandingButton from 'app/components/InformationDemandingButton';
import globVars from 'app/styles/variables';

import { sliderWidth } from './variables.json';

import style from './style.scss';

const css = themedStyle(style);

const icon = obj => ({
	color: themeVars(obj.theme)('alternativeTextColor'),
	hoverColor: themeVars(obj.theme)('accent1Color')
});

const AnimationControls = props => (
	<div className={css('container', props.theme)}>
		<div className={css('upper')}>
			<MuiThemeProvider
				muiTheme={getMuiTheme({
					slider: {
						// trackColor: palette.primary3Color,
						handleFillColor: themeVars(props.theme)('accent1Color'),
						selectionColor: themeVars(props.theme)('alternativeTextColor'),
						rippleColor: themeVars(props.theme)('accent1Color'),
					},
				})}
			>
				<Slider
					max={100}
					min={1}
					step={1}
					value={props.animationSpeed}
					defaultValue={props.animationSpeed}
					onChange={(_, v) => props.onAnimationChangeSpeed(v)}
					onDragStop={() => props.onAnimationChangeSpeed(null, true)}
					style={{
						flexGrow: 1,
						maxWidth: sliderWidth
					}}
					sliderStyle={{
						margin: 0
					}}
				/>
			</MuiThemeProvider>
			<div className={css('buttons')}>
				<FlatButton
					icon={<AvSkipPrevious {...icon(props)} />}
					onTouchTap={props.onAnimationToBegin}
				/>
				<FlatButton
					icon={<AvFastRewind {...icon(props)} />}
					onTouchTap={props.onAnimationStepBackward}
				/>
				<InformationDemandingButton
					activeIcon={<ContentSend {...icon(props)} />}
					passiveIcon={((() => {
						if (props.animationProgress === 100) {
							return (<NavigationRefresh {...icon(props)} />);
						}

						if (props.animationIsPaused) {
							return (<AvPlayArrow {...icon(props)} />);
						}

						return (<AvPause {...icon(props)} />);
					})())}
					elevation={globVars.footerHeight}
					demandCondition={[0].includes(props.animationProgress)}
					demandings={props.input.map(({
						description: text,
						update: handler,
						...remaining
					}) => ({
						text,
						handler,
						...remaining
					}))}
					resolve={props.onAnimationPauseRestart}

					theme={props.theme}
					secondary={props.animationProgress === 100}
				/>
				<FlatButton
					icon={<AvFastForward {...icon(props)} />}
					onTouchTap={props.onAnimationStepForward}
				/>
				<FlatButton
					icon={<AvSkipNext {...icon(props)} />}
					onTouchTap={props.onAnimationToEnd}
				/>
			</div>
		</div>
		<LinearProgress
			value={props.animationProgress}
			mode="determinate"
			color={themeVars(props.theme)('accent1Color')}
			style={{
				height: globVars.footerHeight,
				position: 'absolute',
				bottom: 0,
				backgroundColor: themeVars(props.theme)('primary1Color'),
				zIndex: -1
			}}
		/>
	</div>
);

AnimationControls.defaultProps = {
	input: []
};

AnimationControls.propTypes = {
	animationSpeed: PropTypes.number.isRequired,
	animationProgress: PropTypes.number.isRequired,
	animationIsPaused: PropTypes.bool.isRequired,
	onAnimationChangeSpeed: PropTypes.func.isRequired,
	onAnimationToBegin: PropTypes.func.isRequired,
	onAnimationStepForward: PropTypes.func.isRequired,
	onAnimationPauseRestart: PropTypes.func.isRequired,
	onAnimationStepBackward: PropTypes.func.isRequired,
	onAnimationToEnd: PropTypes.func.isRequired,

	input: PropTypes.arrayOf(PropTypes.shape({
		description: PropTypes.string.isRequired,
		update: PropTypes.func.isRequired
	})),

	theme: PropTypes.string.isRequired
};

export default AnimationControls;
