/* eslint-env mocha */
/* eslint import/no-webpack-loader-syntax: off */
import React from 'react';
import renderer from 'react-test-renderer';
import { MockComponent, StyleMocks } from 'app/__tests__/test-utils';
import Injector from 'inject-loader!../';

const { default: AlgorithmView } = Injector({
	'app/components/AlgorithmInner': MockComponent('AlgorithmInner'),
	'app/components/AnimationControls': MockComponent('AnimationControls'),
	'app/components/Stretch': MockComponent('Stretch'),
	...StyleMocks
});

describe('AlgorithmView', () => {
	it('renders correctly', () => {
		const tree = renderer.create(
			<AlgorithmView
				app={{
					theme: 'asdfd'
				}}
			/>
		).toJSON();
		expect(tree).to.matchSnapshot();
	});
});
