import React from 'react';
import PropTypes from 'prop-types';
import { themedStyle } from 'app/utils';

import style from './style.scss';

const css = themedStyle(style);

const PageViewFactory = text => {
	const PageViewPrototype = props => (
		<div
			className={css('container', props.app.theme)}
			dangerouslySetInnerHTML={{ __html: text }}
		/>
	);

	PageViewPrototype.propTypes = {
		app: PropTypes.shape({
			theme: PropTypes.string.isRequired
		}).isRequired
	};

	return PageViewPrototype;
};

export default PageViewFactory;
