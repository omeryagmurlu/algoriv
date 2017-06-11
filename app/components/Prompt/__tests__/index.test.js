/* eslint-env mocha */
/* eslint import/no-webpack-loader-syntax: off */
import React from 'react';
import renderer from 'react-test-renderer';
import { MockComponent } from 'app/__tests__/test-utils';
import Injector from 'inject-loader!../';

const { default: Prompt } = Injector({
	'material-ui/FlatButton': MockComponent('FlatButton'),
	'material-ui/TextField': MockComponent('TextField'),
	'material-ui/svg-icons/content/send': MockComponent('ContentSend')
});

describe('Prompt', () => {
	it('renders correctly', () => {
		const tree = renderer.create(
			<Prompt />
		).toJSON();
		expect(tree).to.matchSnapshot();
	});
});
