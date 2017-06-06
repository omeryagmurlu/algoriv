import React from 'react';
import PropTypes from 'prop-types';

import AlgorithmInner from 'app/components/AlgorithmInner';
import AnimationControls from 'app/components/AnimationControls';
import Stretch from 'app/components/Stretch';

import { section, footer } from './style.scss';

const filter = [
	'algorithmInput',
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
				input={props.algorithmInput.filter(v => v.type === 'module')}
				theme={props.app.theme}
				visualCache={() => props.app.settings('visual-cache')('algorithmView')}
			/>
		</section>
		<footer className={footer}>
			<AnimationControls
				{...props}
				input={props.algorithmInput.filter(v => v.type === 'init')}
				theme={props.app.theme}
			/>
		</footer>
	</Stretch>
);

AlgorithmView.propTypes = {
	app: PropTypes.any.isRequired,
	algorithmInput: PropTypes.arrayOf(PropTypes.shape({
		type: PropTypes.string.isRequired
	})).isRequired
};

export default AlgorithmView;
