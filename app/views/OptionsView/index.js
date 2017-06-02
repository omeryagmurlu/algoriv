import React from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import Slider from 'material-ui/Slider';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';

import { themedStyle, themeVars } from 'app/utils';
import { themes } from 'app/styles/themes.json';
import { selectProps, subheaderProps } from 'app/styles/module-component-props';

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
			{...selectProps(theme)}
		>
			{possib.map(pos => (
				<MenuItem key={pos} value={pos} primaryText={pos} />
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

const sliderHOF = () => ({
	name,
	option,
	min,
	max
}) => (
	<div className={css('control')} >
		<Subheader
			{...subheaderProps()}
		>{name}</Subheader>
		<Slider
			min={min}
			max={max}
			value={option().get()}
			onChange={(_, v) => option().set(v)}

			sliderStyle={{
				margin: 0
			}}
		/>
	</div>
);

const buttonHOF = theme => ({
	name,
	action
}) => (
	<div className={css('control')} >
		<FlatButton
			label={name}
			onTouchTap={action}
			backgroundColor={themeVars(theme)('primary1Color')}
			hoverColor={themeVars(theme)('accent1Color')}
			style={{
				color: themeVars(theme)('alternativeTextColor')
			}}
			fullWidth
		/>
	</div>
);

const OptionsView = props => {
	const options = () => props.app.settings('options');
	const select = selectHOF(props.app.theme);
	const checkbox = checkboxHOF(props.app.theme);
	const slider = sliderHOF(props.app.theme);
	const button = buttonHOF(props.app.theme);
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
					option: () => options()('grayscale-visualizations')
				})}
				{checkbox({
					name: 'Animations',
					option: () => options()('animations-enabled')
				})}
				{slider({
					name: 'Animation Speed',
					option: () => options()('animation')('speed'),
					min: 1,
					max: 100
				})}
			</div>
			<div className={css('control-group')} >
				<header>
					<h1>Module Options</h1>
					<span>These options are specific to modules which only affect their behaviour.</span>
				</header>
				<div className={css('control-group')} >
					<header>
						<h2>Code Module</h2>
						<span>Options for the Code module.</span>
					</header>
					{checkbox({
						name: 'Enabled',
						option: () => options()('enabled-modules')('code')
					})}
				</div>
				<div className={css('control-group')} >
					<header>
						<h2>Description Module</h2>
						<span>Options for the Description module.</span>
					</header>
					{checkbox({
						name: 'Enabled',
						option: () => options()('enabled-modules')('description')
					})}
				</div>
				<div className={css('control-group')} >
					<header>
						<h2>Graph Module</h2>
						<span>Options for the Graph module.</span>
					</header>
					{checkbox({
						name: 'Enabled',
						option: () => options()('enabled-modules')('graph')
					})}
				</div>
				<div className={css('control-group')} >
					<header>
						<h2>Table Module</h2>
						<span>Options for the Table module.</span>
					</header>
					{checkbox({
						name: 'Enabled',
						option: () => options()('enabled-modules')('table')
					})}
				</div>
				<div className={css('control-group')} >
					<header>
						<h2>Text Module</h2>
						<span>Options for the Text module.</span>
					</header>
					{checkbox({
						name: 'Enabled',
						option: () => options()('enabled-modules')('text')
					})}
				</div>
				<div className={css('control-group')} >
					<header>
						<h2>Examples Module</h2>
						<span>Options for the Examples module.</span>
					</header>
					{checkbox({
						name: 'Enabled',
						option: () => options()('enabled-modules')('examples')
					})}
					{button({
						name: 'Purge Custom Inputs',
						action: () => props.app.settings('examples').set({})
					})}
				</div>
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
