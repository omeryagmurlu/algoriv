import React from 'react';
import PropTypes from 'prop-types';

import AlgorithmInner from 'app/components/AlgorithmInner';
import AnimationControls from 'app/components/AnimationControls';
import Stretch from 'app/components/Stretch';

import { section, footer } from './style.scss';

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
		<section className={section}>
			<AlgorithmInner
				{...(Object.keys(props).filter(v => !filter.includes(v)).reduce((acc, v) => {
					acc[v] = props[v];
					return acc;
				}, {}))}
				theme={props.app.theme}
			/>
		</section>
		<footer className={footer}>
			<AnimationControls
				{...props}
				theme={props.app.theme}
			/>
		</footer>
	</Stretch>
);

AlgorithmView.defaultProps = {
	algorithmInitInput: []
};

AlgorithmView.propTypes = {
	app: PropTypes.shape({
		theme: PropTypes.string.isRequired
	}).isRequired
};

export default AlgorithmView;
