/* eslint-env mocha */
/* eslint import/no-webpack-loader-syntax: off */
import React from 'react';
import renderer from 'react-test-renderer';
import { MockComponent, StyleMocks, StyleModuleComponentProps } from 'app/__tests__/test-utils';
import Injector from 'inject-loader!../';

const { default: InformationDemandingButton } = Injector({
	'material-ui/FlatButton': MockComponent('FlatButton'),
	'material-ui/TextField': MockComponent('TextField'),
	...StyleMocks,
	...StyleModuleComponentProps
});

describe('InformationDemandingButton', () => {
	it('renders correctly with minimum props', () => {
		const tree = renderer.create(
			<InformationDemandingButton
				theme="sdfggfdgsdfl"
				activeIcon={<span>Active</span>}
				passiveIcon={<span>Passive</span>}
				resolve={() => {}}
			/>
		).toJSON();
		expect(tree).to.matchSnapshot();
	});

	it('renders correctly when demandCondition', () => {
		const tree = renderer.create(
			<InformationDemandingButton
				theme="sdfggfdgsdfl"
				activeIcon={<span>Active</span>}
				passiveIcon={<span>Passive</span>}
				resolve={() => {}}
				formatter={v => `I format ${v}`}
				demandings={[{
					text: 'this is text',
					validate: () => true,
					invalid: () => '',
					handler: () => {},
					value: 'ssdfd'
				}]}
				demandCondition
				elevation="1884px"
			/>
		).toJSON();
		expect(tree).to.matchSnapshot();
	});

	it('renders correctly when not demandCondition', () => {
		const tree = renderer.create(
			<InformationDemandingButton
				theme="sdfggfdgsdfl"
				activeIcon={<span>Active</span>}
				passiveIcon={<span>Passive</span>}
				resolve={() => {}}
				formatter={v => `I format ${v}`}
				demandings={[{
					text: 'this is text',
					validate: () => true,
					invalid: () => '',
					handler: () => {},
					value: 'ssdfd'
				}]}
				demandCondition={false}
				elevation="1884px"
			/>
		).toJSON();
		expect(tree).to.matchSnapshot();
	});

	it('renders correctly when validate returns false', () => {
		const tree = renderer.create(
			<InformationDemandingButton
				theme="sdfggfdgsdfl"
				activeIcon={<span>Active</span>}
				passiveIcon={<span>Passive</span>}
				resolve={() => {}}
				formatter={v => `I format ${v}`}
				demandings={[{
					text: 'this is text',
					validate: () => false,
					invalid: () => 'now you are screwed',
					handler: () => {},
					value: 'ssdfd'
				}]}
				demandCondition
				elevation="1884px"
			/>
		).toJSON();
		expect(tree).to.matchSnapshot();
	});
});
