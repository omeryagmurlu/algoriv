import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import ActionDelete from 'material-ui/svg-icons/action/delete';
import NavigationMoreVert from 'material-ui/svg-icons/navigation/more-vert';
import ContentCreate from 'material-ui/svg-icons/content/create';

import { Examples as TO_MUTATE } from 'app/data/inputsRegistry';
import { themedStyle, themeVars } from 'app/utils';

import style from './style.scss';

const css = themedStyle(style);

const head = (name, theme) => (
	<Subheader
		style={{
			color: themeVars(theme)('textColor'),
			paddingLeft: 0
		}}
	>{name}</Subheader>
);

const list = (propName, prefix, abj, optAttr = {}) => (
	<List>
		{head(`${prefix} ${abj.exampleGroup}`, abj.theme)}
		{abj[propName].map(example => (
			<ListItem
				key={example.name}
				primaryText={example.name}
				onTouchTap={() => abj.input[TO_MUTATE].update(example.data)}
				{...optAttr}
			/>
		))}
	</List>
);

const menuItem = (str, icon) => (
	<MenuItem
		rightIcon={React.createElement(icon)}
		style={{
			color: 'rgb(117, 117, 117)'
		}}
	>{str}</MenuItem>
);

const Examples = props => (
	<div className={css('container', props.theme)} >
		{list('examples', 'Example', props)}
		{list('examples', 'Custom', props, {
			rightIconButton: (
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
				>
					{menuItem('Rename', ContentCreate)}
					{menuItem('Delete', ActionDelete)}
				</IconMenu>
			)
		})}
	</div>
);

Examples.propTypes = {
	theme: PropTypes.string.isRequired,
	examples: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		data: PropTypes.any.isRequired
	})).isRequired,
	exampleGroup: PropTypes.string.isRequired
};

export default Examples;
