/* eslint-env mocha */
/* eslint import/no-webpack-loader-syntax: off */
import React from 'react';
import renderer from 'react-test-renderer';
import { MockComponent, StyleMocks } from 'app/__tests__/test-utils';
import Injector from 'inject-loader!../';

Object.assign(StyleMocks['app/utils'], {
	getEvents: () => ({})
});

const { default: Header } = Injector({
	'material-ui/FlatButton': MockComponent('FlatButton'),
	...StyleMocks,
});

describe('Header', () => {
	it('renders correctly with minimum props', () => {
		const tree = renderer.create(
			<Header
				app={{
					theme: 'sdfggfdgsdfl',
					goBack: () => {}
				}}
			/>
		).toJSON();
		expect(tree).to.matchSnapshot();
	});

	it('renders correctly with back prop', () => {
		const tree = renderer.create(
			<Header
				app={{
					theme: 'sdfggfdgsdfl',
					goBack: () => {}
				}}
				back={{ name: 'asfdfs' }}
			/>
		).toJSON();
		expect(tree).to.matchSnapshot();
	});

	it('renders correctly with current prop', () => {
		const tree = renderer.create(
			<Header
				app={{
					theme: 'sdfggfdgsdfl',
					goBack: () => {}
				}}
				current={{ name: 'asfdfs' }}
			/>
		).toJSON();
		expect(tree).to.matchSnapshot();
	});

	it('renders correctly with both back and current props', () => {
		const tree = renderer.create(
			<Header
				app={{
					theme: 'sdfggfdgsdfl',
					goBack: () => {}
				}}
				back={{ name: 'assfdsfdsfdfs' }}
				current={{ name: 'asfdfs' }}
			/>
		).toJSON();
		expect(tree).to.matchSnapshot();
	});
});
