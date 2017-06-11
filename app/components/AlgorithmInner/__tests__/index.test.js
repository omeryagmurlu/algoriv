/* eslint-env mocha */
/* eslint import/no-webpack-loader-syntax: off */
import React from 'react';
import renderer from 'react-test-renderer';
import { MockComponent, StyleMocks, settingsMock, infiniteObj as infObj } from 'app/__tests__/test-utils';
import Injector from 'inject-loader!../';

const { default: AlgorithmInner } = Injector({
	'app/components/SideDrawer': MockComponent('SideDrawer'),
	'app/components/modules': infObj(),
	...StyleMocks,
});

describe('AlgorithmInner', () => {
	it('renders correctly', () => {
		const tree = renderer.create(
			<AlgorithmInner
				animationDirectives={{}}
				algorithmStatic={{}}
				input={[]}
				theme="assdsad"
				visualCache={settingsMock().settings}
			/>
		).toJSON();
		expect(tree).to.matchSnapshot();
	});
});
