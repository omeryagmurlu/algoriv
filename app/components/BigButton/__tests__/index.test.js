/* eslint-env mocha */
/* eslint import/no-webpack-loader-syntax: off */
import React from 'react';
import renderer from 'react-test-renderer';
import { MockComponent, StyleMocks } from 'app/__tests__/test-utils';
import Injector from 'inject-loader!../';

Object.assign(StyleMocks['app/utils'], {
	getEvents: () => ({})
});

const { default: BigButton } = Injector({
	'material-ui/FlatButton': MockComponent('FlatButton'),
	...StyleMocks,
});

describe('BigButton', () => {
	const co = [0, 1, 2, 3, 10, 50, 100];

	co.forEach(cols => {
		it(`renders correctly cols: ${cols}`, () => {
			const tree = renderer.create(
				<BigButton
					cols={cols}
					name="anan"
					theme="sdfggfdgsdfl"
				/>
			).toJSON();
			expect(tree).to.matchSnapshot();
		});

		it(`renders correctly with desc cols: ${cols}`, () => {
			const tree = renderer.create(
				<BigButton
					cols={cols}
					name="anan"
					desc="baban"
					theme="sdfggfdgsdfl"
				/>
			).toJSON();
			expect(tree).to.matchSnapshot();
		});
	});
});
