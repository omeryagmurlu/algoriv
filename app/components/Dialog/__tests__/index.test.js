/* eslint-env mocha */
/* eslint import/no-webpack-loader-syntax: off */
import React from 'react';
import renderer from 'react-test-renderer';
import { MockComponent, StyleMocks } from 'app/__tests__/test-utils';
import Injector from 'inject-loader!../';

const { default: DialogComponent } = Injector({
	'material-ui/Dialog': MockComponent('Dialog'),
	...StyleMocks,
});

describe('DialogComponent', () => {
	it('renders correctly', () => {
		const tree = renderer.create(
			<DialogComponent
				theme="sdfggfdgsdfl"
			/>
		).toJSON();
		expect(tree).to.matchSnapshot();
	});
});
