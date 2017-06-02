import React from 'react';
import PropTypes from 'prop-types';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';

import NavigationMoreVert from 'material-ui/svg-icons/navigation/more-vert';

import { themedStyle, themeVars } from 'app/utils';

import style from './style.scss';

const css = themedStyle(style);

const menuItem = (str, icon, theme, onClick) => (
	<MenuItem
		key={str}
		className={css('menu-item', theme)}
		rightIcon={React.createElement(icon)}
		onTouchTap={onClick}
	>{str}</MenuItem>
);

const IconMenuComponent = props => (
	<IconMenu
		anchorOrigin={{
			vertical: 'center',
			horizontal: 'middle'
		}}
		iconButtonElement={(
			<IconButton
				touch
			>
				<NavigationMoreVert />
			</IconButton>
		)}
		menuStyle={{
			backgroundColor: themeVars(props.theme)('accent1Color')
		}}
	>
		{props.items.map(item =>
			menuItem(item.name, item.icon, props.theme, item.onTouch)
		)}
	</IconMenu>
);

PropTypes.defaultProps = {
	items: []
};

IconMenuComponent.propTypes = {
	theme: PropTypes.string.isRequired,
	items: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		icon: PropTypes.any.isRequired,
		onTouch: PropTypes.func.isRequired
	}))
};

export default IconMenuComponent;
