import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import { themedStyle } from 'app/utils';

import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

import style from './style.scss';

const css = themedStyle(style);

const Header = props => (
	<header className={css('header', props.app.theme)}>
		{props.back && <FlatButton
			icon={<NavigationArrowBack />}
			label={`${props.back.name}`}
			onTouchTap={() => props.app.goBack()}
			// disableTouchRipple
		/>}

		<nav className={css('nav', props.app.theme)}>
			{props.routes.map(route => (
				<FlatButton label={route.name} onTouchTap={() => props.app.changeView(route)} />
			))}
		</nav>
	</header>
);

Header.defaultProps = {
	routes: [],
	back: null
};

Header.propTypes = {
	app: PropTypes.shape({
		theme: PropTypes.string.isRequired,
		goBack: PropTypes.func.isRequired
	}).isRequired,
	back: PropTypes.shape({
		name: PropTypes.string.isRequired
	}),
	routes: PropTypes.array
};

export default Header;
