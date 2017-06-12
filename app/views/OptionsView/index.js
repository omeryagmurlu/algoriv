import React from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import Slider from 'material-ui/Slider';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';

import { themedStyle, themeVars } from 'app/utils';
import { themes } from 'app/styles/themes.json';
import { selectProps, subheaderProps, textFieldProps } from 'app/styles/module-component-props';

import style from './style.scss';

const themeNames = Object.keys(themes);

const css = themedStyle(style);

const controlGroup = (header, desc, more, H = 'h1') => (
	<div className={css('control-group')} >
		<header>
			<H>{header}</H>
			<span>{desc}</span>
		</header>
		{more}
	</div>
);

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

const textHOF = theme => ({
	name,
	option,
	parser = x => x
}) => (
	<div className={css('control')} >
		<TextField
			{...textFieldProps(theme)}
			floatingLabelText={name}
			fullWidth
			value={option().get()}
			onChange={(e, v) => option().set(parser(v))}
		/>
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
	const text = textHOF(props.app.theme);
	return (
		<div className={css('container')}>
			{controlGroup('Core Options', 'These options are application\'s core settings which affect behaviour unrelated to modules and algorithms.', [
				select({
					name: 'Theme',
					option: () => options()('theme'),
					possib: themeNames
				}),
				checkbox({
					name: 'Minimal Colored Visualizations',
					option: () => options()('grayscale-visualizations')
				}),
				checkbox({
					name: 'Animations',
					option: () => options()('animations-enabled')
				}),
				slider({
					name: 'Animation Speed',
					option: () => options()('animation')('speed'),
					min: 1,
					max: 100
				}),
				text({
					name: 'Timeout for Custom Code',
					option: () => options()('custom-code')('timeout'),
					parser: parseInt
				})
			])}
			{controlGroup('Module Options', 'These options are specific to modules which only affect their behaviour.', [
				controlGroup('Code Module', 'Options for the Code module.', [
					checkbox({
						name: 'Enabled',
						option: () => options()('enabled-modules')('code')
					})
				], 'h2'),
				controlGroup('Description Module', 'Options for the Description module.', [
					checkbox({
						name: 'Enabled',
						option: () => options()('enabled-modules')('description')
					})
				], 'h2'),
				controlGroup('Graph Module', 'Options for the Graph module.', [
					checkbox({
						name: 'Enabled',
						option: () => options()('enabled-modules')('graph')
					})
				], 'h2'),
				controlGroup('Table Module', 'Options for the Table module.', [
					checkbox({
						name: 'Enabled',
						option: () => options()('enabled-modules')('table')
					})
				], 'h2'),
				controlGroup('Text Module', 'Options for the Text module.', [
					checkbox({
						name: 'Enabled',
						option: () => options()('enabled-modules')('text')
					})
				], 'h2'),
				controlGroup('Examples Module', 'Options for the Examples module.', [
					checkbox({
						name: 'Enabled',
						option: () => options()('enabled-modules')('examples')
					}),
					button({
						name: 'Purge Custom Inputs',
						action: () => props.app.settings('examples').set({})
					})
				], 'h2'),
			])}
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
