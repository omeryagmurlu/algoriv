/* eslint-env mocha */
/* eslint import/no-webpack-loader-syntax: off */
import React from 'react';
import renderer from 'react-test-renderer';
import { MockComponent, StyleMocks, StyleModuleComponentProps, settingsMock } from 'app/__tests__/test-utils';
import Injector from 'inject-loader!../';

const { default: OptionsView } = Injector({
	'material-ui/SelectField': MockComponent('SelectField'),
	'material-ui/TextField': MockComponent('TextField'),
	'material-ui/MenuItem': MockComponent('MenuItem'),
	'material-ui/Checkbox': MockComponent('Checkbox'),
	'material-ui/Slider': MockComponent('Slider'),
	'material-ui/Subheader': MockComponent('Subheader'),
	'material-ui/FlatButton': MockComponent('FlatButton'),
	...StyleMocks,
	...StyleModuleComponentProps,
});

describe('OptionsView', () => {
	it('renders correctly', () => {
		const tree = renderer.create(
			<OptionsView
				app={{
					theme: 'custom theme',
					settings: settingsMock().settings
				}}
			/>
		).toJSON();
		expect(tree).to.matchSnapshot();
	});
});
