/* eslint-env mocha */
/* eslint import/no-webpack-loader-syntax: off */
import React from 'react';
import renderer from 'react-test-renderer';
import { MockComponent, StyleMocks } from 'app/__tests__/test-utils';
import Injector from 'inject-loader!../';

const { default: AppView } = Injector({
	'material-ui/Snackbar': MockComponent('Snackbar'),
	'material-ui/FlatButton': MockComponent('FlatButton'),
	'app/components/Header': MockComponent('Header'),
	'app/components/Prompt': MockComponent('Prompt'),
	'app/components/Dialog': MockComponent('Dialog'),
	'material-ui/svg-icons/content/block': MockComponent('ContentBlock'),
	'material-ui/svg-icons/action/done': MockComponent('ActionDone'),
	...StyleMocks
});

describe('AppView', () => {
	it('renders correctly', () => {
		const tree = renderer.create(
			<AppView
				view={{
					view: MockComponent('JustANoopComponent')
				}}
				modal={{}}

				backData="backData"
				goBack="goBack"
				headerRoutes="headerRoutes"

				theme="theme"
				animationsEnabled="animationsEnabled"

				settings="settings"
				rawSettings="rawSettings"

				prompt="prompt"
				alert="alert"
				confirm="confirm"

				updateHeader="updateHeader"
				changeView="changeView"
			/>
		).toJSON();
		expect(tree).to.matchSnapshot();
	});
});
