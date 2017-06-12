/* eslint-env mocha */
/* eslint import/no-webpack-loader-syntax: off */
import React from 'react';
import renderer from 'react-test-renderer';
import { StyleMocks } from 'app/__tests__/test-utils';
import Injector from 'inject-loader!../';

const { default: PageViewFactory } = Injector({
	...StyleMocks,
});

describe('PageViewFactory', () => {
	it('returns a component that renders correctly when given pure text', () => {
		const PageView = PageViewFactory('some text');
		const tree = renderer.create(
			<PageView
				app={{
					theme: 'custom theme',
				}}
			/>
		).toJSON();
		expect(tree).to.matchSnapshot();
	});

	it('returns a component that renders correctly when given nothing', () => {
		const PageView = PageViewFactory();
		const tree = renderer.create(
			<PageView
				app={{
					theme: 'custom theme',
				}}
			/>
		).toJSON();
		expect(tree).to.matchSnapshot();
	});

	it('returns a component that renders correctly when given HTML', () => {
		const PageView = PageViewFactory('<h1> AMAN </h1> <script>window.close();</script>');
		const tree = renderer.create(
			<PageView
				app={{
					theme: 'custom theme',
				}}
			/>
		).toJSON();
		expect(tree).to.matchSnapshot();
	});

	it('throws when tried to be used as a React Element', () => {
		expect(() => renderer.create(
			<PageViewFactory
				app={{
					theme: 'custom theme',
				}}
			/>
		).toJSON()).to.throw();
	});
});
