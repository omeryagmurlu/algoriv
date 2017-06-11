/* eslint-env mocha */
/* eslint import/no-webpack-loader-syntax: off */
import React from 'react';
import renderer from 'react-test-renderer';
import { MockComponent, StyleMocks } from 'app/__tests__/test-utils';
import Injector from 'inject-loader!../';

const { default: MainView } = Injector({
	'app/components/BigButton': MockComponent('BigButton'),
	'app/views/AlgorithmPageView': MockComponent('AlgorithmPageView'),
	'app/containers/CustomCodeContainer': MockComponent('CustomCodeContainer'),
	'app/views/PageViewFactory': MockComponent('PageViewFactory'),
	'app/views/OptionsView': MockComponent('OptionsView'),
	'app/../docs/usage.md': 'usage text here',
	...StyleMocks,
});

describe('MainView', () => {
	it('renders correctly', () => {
		const tree = renderer.create(
			<MainView
				app={{
					theme: 'custom theme',
					changeView: () => {}
				}}
			/>
		).toJSON();
		expect(tree).to.matchSnapshot();
	});
});
