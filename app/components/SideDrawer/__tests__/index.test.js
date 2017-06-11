/* eslint-env mocha */
/* eslint import/no-webpack-loader-syntax: off */
import React from 'react';
import renderer from 'react-test-renderer';
import { MockComponent, StyleMocks, settingsMock } from 'app/__tests__/test-utils';
import Injector from 'inject-loader!../';

const { default: SideDrawer } = Injector({
	'material-ui/FlatButton': MockComponent('FlatButton'),
	'material-ui/svg-icons/hardware/keyboard-arrow-right': MockComponent('HardwareKeyboardArrowRight'),
	'material-ui/svg-icons/hardware/keyboard-arrow-left': MockComponent('HardwareKeyboardArrowLeft'),
	...StyleMocks,
});

describe('SideDrawer', () => {
	['left', 'right'].forEach(side => {
		it(`renders correctly when closed side: ${side}`, () => {
			const tree = renderer.create(
				<SideDrawer
					theme="anfnnffghnfgnhf"
					side={side}
				>
					<span>MAYAMAZINGCONTENT</span>
				</SideDrawer>
			).toJSON();
			expect(tree).to.matchSnapshot();
		});

		it(`renders correctly when opened side: ${side}`, () => {
			const tree = renderer.create(
				<SideDrawer
					theme="anfnnffghnfgnhf"
					side={side}
					visualCache={settingsMock(true).settings}
				>
					<span>MAYAMAZINGCONTENT</span>
				</SideDrawer>
			).toJSON();
			expect(tree).to.matchSnapshot();
		});
	});
});
