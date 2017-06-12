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
	}, (_, lay) => {
		const part = Object.keys(statics)
		.filter(moduleId => statics[moduleId].layout.location === lay);

		part.sort((a, b) => statics[b].layout.order - statics[a].layout.order);

		return part.map(moduleId => {
			const moduleInput = (
				inputs.find(v => v.data.targetModule === moduleId)
				|| inputs.filter(v => v.data.moduleName === statics[moduleId].type)
			);
			return React.createElement(modules[statics[moduleId].type], {
				...passProps,

				id: moduleId,
				key: moduleId,

				input: moduleInput.reduce((acc, input) => {
					acc[input.data.inputIdentifier] = _pick(input, ['value', 'update']);
					return acc;
				}, {}),

				...statics[moduleId].data,
				...directives[moduleId]
			});
		});
	});

	props.visualCache()('leftDrawer')('isOpened').default(false);
	props.visualCache()('rightDrawer')('isOpened').default(true);

	return (
		<section className={css('top')} >
			<section className={css('main')}>
				{parts.main}
			</section>
			<SideDrawer side="left" theme={props.theme} visualCache={() => props.visualCache()('leftDrawer')}>
				{parts.left}
			</SideDrawer>
			<SideDrawer side="right" theme={props.theme} visualCache={() => props.visualCache()('rightDrawer')}>
				{parts.right}
			</SideDrawer>
		</section>
	);
};

AlgorithmInner.propTypes = {
	animationDirectives: PropTypes.object.isRequired,
	algorithmStatic: PropTypes.object.isRequired,
	input: PropTypes.arrayOf(PropTypes.object).isRequired,
	theme: PropTypes.string.isRequired,
	visualCache: PropTypes.func.isRequired,
};

export default AlgorithmInner;
