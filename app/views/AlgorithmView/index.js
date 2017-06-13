import React from 'react';
import PropTypes from 'prop-types';
import { themedStyle } from 'app/utils';

import AlgorithmInner from 'app/components/AlgorithmInner';
import AnimationControls from 'app/components/AnimationControls';
import Stretch from 'app/components/Stretch';

import style from './style.scss';

const css = themedStyle(style);

const filter = [
	'algorithmInitInput',
	'animationSpeed',
	'animationIsPaused',
	'onAnimationChangeSpeed',
	'onAnimationToBegin',
	'onAnimationToEnd',
	'onAnimationStepBackward',
	'onAnimationPauseRestart',
	'onAnimationStepForward',
];

const AlgorithmView = props => (
	<Stretch>
		<section className={css('section')}>
			<AlgorithmInner
				{...(Object.keys(props).filter(v => !filter.includes(v)).reduce((acc, v) => {
					acc[v] = props[v];
					return acc;
				}, {}))}
				theme={props.app.theme}
				visualCache={() => props.app.settings('visual-cache')('algorithmView')}
			/>
		</section>
		<footer className={css('footer')}>
			<AnimationControls
				{...props}
				input={props.algorithmInitInput}
				theme={props.app.theme}
			/>
		</footer>
	</Stretch>
);

AlgorithmView.propTypes = {
	app: PropTypes.any.isRequired,
	algorithmInitInput: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default AlgorithmView;
