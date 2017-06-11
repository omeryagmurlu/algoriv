/* eslint-env mocha */
/* eslint import/no-webpack-loader-syntax: off */
import React from 'react';
import renderer from 'react-test-renderer';
import { MockComponent, StyleMocks } from 'app/__tests__/test-utils';
import Injector from 'inject-loader!../';

const { default: AlgorithmPageView } = Injector({
	'app/components/BigButton': MockComponent('BigButton'),
	...StyleMocks
});

describe('AlgorithmPageView', () => {
	it('renders correctly', () => {
		const tree = renderer.create(
			<AlgorithmPageView
				app={{
					theme: 'asdfd'
				}}
			/>
		).toJSON();
		expect(tree).to.matchSnapshot();
	});
});
