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

import style from './style.scss';

const css = themedStyle(style);

const icon = (ico, obj) => React.createElement(ico, {
	color: themeVars(obj.theme)('alternativeTextColor'),
	hoverColor: themeVars(obj.theme)('accent1Color')
});

const AnimationControls = props => (
	<div className={css('container', props.theme)}>
		<div className={css('upper')}>
			<div className={css('buttons')}>
				<FlatButton icon={icon(AvSkipPrevious, props)} onTouchTap={props.onAnimationToBegin} />
				<FlatButton icon={icon(AvFastRewind, props)} onTouchTap={props.onAnimationStepBackward} />
				<InformationDemandingButton
					activeIcon={icon(ContentSend, props)}
					passiveIcon={icon((props.animationProgress === 100
						? NavigationRefresh
						: props.animationIsPaused
							? AvPlayArrow
							: AvPause
					), props)}
					demandCondition={props.animationProgress === 0}
					demandings={props.input.map(({
						data: { description: text },
						update: handler,
						...remaining
					}) => ({
						text,
						handler,
						...remaining
					}))}
					resolve={props.onAnimationPauseRestart}
				/>
				<FlatButton icon={icon(AvFastForward, props)} onTouchTap={props.onAnimationStepForward} />
				<FlatButton icon={icon(AvSkipNext, props)} onTouchTap={props.onAnimationToEnd} />
			</div>
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
					min={0}
					step={1}
					value={props.animationSpeed}
					defaultValue={props.animationSpeed}
					onChange={(_, v) => props.onAnimationChangeSpeed(v)}
					style={{
						flexGrow: 1
					}}
					sliderStyle={{
						margin: 0
					}}
				/>
			</MuiThemeProvider>
		</div>
		<LinearProgress
			value={props.animationProgress}
			mode="determinate"
			color={themeVars(props.theme)('accent1Color')}
			style={{
				height: '7px',
				position: 'absolute',
				bottom: 0,
				backgroundColor: themeVars(props.theme)('primary1Color')
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
		data: PropTypes.shape({
			description: PropTypes.string.isRequired,
		}).isRequired,
		update: PropTypes.func.isRequired
	})),

	theme: PropTypes.string.isRequired
};

export default AnimationControls;