/* eslint-env mocha */
/* eslint import/no-webpack-loader-syntax: off */
import React from 'react';
import renderer from 'react-test-renderer';
import idObj from 'identity-obj-proxy';
import { MockComponent, StyleMocks, styleVariablesMock } from 'app/__tests__/test-utils';
import Injector from 'inject-loader!../';

const { default: AnimationControls } = Injector({
	'app/components/InformationDemandingButton': MockComponent('InformationDemandingButton'),
	'material-ui/Slider': MockComponent('Slider'),
	'material-ui/LinearProgress': MockComponent('LinearProgress'),
	'material-ui/FlatButton': MockComponent('FlatButton'),
	'material-ui/styles/MuiThemeProvider': MockComponent('MuiThemeProvider'),
	'material-ui/svg-icons/av/skip-previous': MockComponent('AvSkipPrevious'),
	'material-ui/svg-icons/av/fast-rewind': MockComponent('AvFastRewind'),
	'material-ui/svg-icons/av/play-arrow': MockComponent('AvPlayArrow'),
	'material-ui/svg-icons/av/pause': MockComponent('AvPause'),
	'material-ui/svg-icons/navigation/refresh': MockComponent('NavigationRefresh'),
	'material-ui/svg-icons/av/fast-forward': MockComponent('AvFastForward'),
	'material-ui/svg-icons/av/skip-next': MockComponent('AvSkipNext'),
	'material-ui/svg-icons/content/send': MockComponent('ContentSend'),
	'material-ui/styles/getMuiTheme': x => x,
	'app/styles/variables': idObj,
	...StyleMocks,
	...styleVariablesMock
});

describe('AnimationControls', () => {
	const sp = [0, 50, 100];
	const pr = [0, 50, 100];
	const pa = [true, false];

	for (let i = 0; i < sp.length; i++) {
		const speed = sp[i];
		for (let j = 0; j < pr.length; j++) {
			const progress = pr[j];
			for (let k = 0; k < pa.length; k++) {
				const paused = pa[k];

				it(`renders correctly speed: ${speed}, progress: ${progress}, paused: ${paused}`, () => {
					const tree = renderer.create(
						<AnimationControls
							theme="sdffsd"
							animationSpeed={speed}
							animationProgress={progress}
							animationIsPaused={paused}
							onAnimationChangeSpeed={() => {}}
							onAnimationToBegin={() => {}}
							onAnimationStepForward={() => {}}
							onAnimationPauseRestart={() => {}}
							onAnimationStepBackward={() => {}}
							onAnimationToEnd={() => {}}
						/>
					).toJSON();
					expect(tree).to.matchSnapshot();
				});
			}
		}
	}
});
