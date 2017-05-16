import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import { themedStyle, themeVars } from 'app/utils';

import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

import style from './style.scss';

const css = themedStyle(style);

const Header = props => !props.disabled && (
	<header className={css('container', props.app.theme)}>
		{props.back && <FlatButton
			icon={<NavigationArrowBack color={themeVars(props.app.theme)('alternativeTextColor')} />}
			label={`${props.back.name}`}
			onTouchTap={() => props.app.goBack()}
			labelStyle={{
				color: themeVars(props.app.theme)('alternativeTextColor')
			}}
			// disableTouchRipple
		/>}

		<nav className={css('nav')}>
			{props.routes.map(route => (
				<FlatButton label={route.name} onTouchTap={() => props.app.changeView(route)} />
			))}
		</nav>

		<h1 className={css('header')}>{props.current.name.toUpperCase()}</h1>
	</header>
);

Header.defaultProps = {
	routes: [],
	back: null,
	current: {
		name: ''
	}
};

Header.propTypes = {
	app: PropTypes.shape({
		theme: PropTypes.string.isRequired,
		goBack: PropTypes.func.isRequired
	}).isRequired,
	back: PropTypes.shape({
		name: PropTypes.string.isRequired
	}),
	current: PropTypes.shape({
		name: PropTypes.string.isRequired
	}),
	routes: PropTypes.array
};

export default Header;
