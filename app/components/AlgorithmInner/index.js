import React from 'react';
import PropTypes from 'prop-types';
import _mapValues from 'lodash.mapvalues';
import { themedStyle } from 'app/utils';
import SideDrawer from 'app/components/SideDrawer';
import _pick from 'lodash.pick';

import modules from 'app/components/modules';

import style from './style.scss';

const css = themedStyle(style);

const AlgorithmInner = props => {
	const {
		animationDirectives: directives,
		algorithmStatic: statics,
		input: inputs,
		...passProps
	} = props;

	const parts = _mapValues({
		main: 0,
		right: 0,
		left: 0
	}, (_, lay) => Object.keys(statics).filter(moduleId =>
		statics[moduleId].layout === lay).map(moduleId =>
			React.createElement(modules[statics[moduleId].type], {
				...passProps,

				id: moduleId,
				key: moduleId,

				input: (
					inputs.find(v => v.data.targetModule === moduleId)
					|| inputs.filter(v => v.data.moduleName === statics[moduleId].type)
				).reduce((acc, input) => {
					acc[input.data.inputIdentifier] = _pick(input, ['value', 'update']);
					return acc;
				}, {}),

				...statics[moduleId].data,
				...directives[moduleId]
			})
	));

	return (
		<section className={css('top')} >
			<section className={css('main')}>
				{parts.main}
			</section>
			<SideDrawer side="left" theme={props.theme} >
				{parts.left}
			</SideDrawer>
			<SideDrawer side="right" theme={props.theme} >
				{parts.right}
			</SideDrawer>
		</section>
	);
};

AlgorithmInner.propTypes = {
	animationDirectives: PropTypes.object.isRequired,
	algorithmStatic: PropTypes.object.isRequired,
	input: PropTypes.arrayOf(PropTypes.object).isRequired,
	theme: PropTypes.string.isRequired
};

export default AlgorithmInner;
