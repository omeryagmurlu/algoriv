import React from 'react';
import PropTypes from 'prop-types';
import _mapValues from 'lodash.mapvalues';
import { themedStyle } from 'app/utils';
import SideDrawer from 'app/components/SideDrawer';

import modules from 'app/components/modules';

import style from './style.scss';

const css = themedStyle(style);

const AlgorithmInner = props => {
	const {
		animationDirectives: directives,
		algorithmStatic: statics,
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

		return part.map(moduleId => React.createElement(modules[statics[moduleId].type], {
			...passProps,

			id: moduleId,
			key: moduleId,

			...statics[moduleId].data,
			...statics[moduleId].input,
			...directives[moduleId]
		}));
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
	theme: PropTypes.string.isRequired,
	visualCache: PropTypes.func.isRequired,
};

export default AlgorithmInner;
