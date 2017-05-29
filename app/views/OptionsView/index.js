import React from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';

import { themedStyle, themeVars } from 'app/utils';
import { themes } from 'app/styles/themes.json';

import style from './style.scss';

const themeNames = Object.keys(themes);

const css = themedStyle(style);

const selectHOF = theme => ({
	name,
	option,
	possib
}) => (
	<div className={css('control')} >
		<SelectField
			floatingLabelText={name}
			fullWidth
			value={option().get()}
			onChange={(e, i, v) => option().set(v)}
			listStyle={{
				backgroundColor: themeVars(theme)('primary2Color')
			}}
			floatingLabelStyle={{
				color: themeVars(theme)('textColor')
			}}
			underlineStyle={{
				display: 'none'
			}}
			iconStyle={{
				fill: themeVars(theme)('textColor')
			}}
		>
			{possib.map(pos => (
				<MenuItem value={pos} primaryText={pos} />
			))}
		</SelectField>
	</div>
);

const checkboxHOF = () => ({
	name,
	option
}) => (
	<div className={css('control')} >
		<Checkbox
			label={name}
			checked={option().get()}
			onCheck={(e, v) => option().set(v)}
		/>
	</div>
);

const OptionsView = props => {
	const options = () => props.app.settings('options');
	const select = selectHOF(props.app.theme);
	const checkbox = checkboxHOF(props.app.theme);
	return (
		<div className={css('container')}>
			<div className={css('control-group')} >
				<header>
					<h1>Core Options</h1>
					<span>These options are {'application\'s'} core settings which affect behaviour unrelated to modules and algorithms.</span>
				</header>
				{select({
					name: 'Theme',
					option: () => options()('theme'),
					possib: themeNames
				})}
				{checkbox({
					name: 'Minimal Colored Visualizations',
					option: () => options()('minimalColor')
				})}
			</div>
		</div>
	);
};

OptionsView.propTypes = {
	app: PropTypes.shape({
		theme: PropTypes.any.isRequired,
		settings: PropTypes.func.isRequired
	}).isRequired
};

export default OptionsView;
