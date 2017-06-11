/* eslint-env mocha */
/* eslint import/no-webpack-loader-syntax: off */
import React from 'react';
import renderer from 'react-test-renderer';
import { MockComponent, StyleMocks, StyleVariablesMocks, StyleModuleComponentProps, settingsMock } from 'app/__tests__/test-utils';
import Injector from 'inject-loader!../';

const { default: CustomCodeView } = Injector({
	'app/components/SideDrawer': MockComponent('SideDrawer'),
	'material-ui/List': {
		ListItem: MockComponent('ListItem'),
		List: MockComponent('List')
	},
	'app/components/IconMenu': MockComponent('IconMenu'),
	'material-ui/RaisedButton': MockComponent('RaisedButton'),
	'material-ui/TextField': MockComponent('TextField'),
	'material-ui/SelectField': MockComponent('SelectField'),
	'material-ui/MenuItem': MockComponent('MenuItem'),
	'material-ui/Subheader': MockComponent('Subheader'),
	'material-ui/Checkbox': MockComponent('Checkbox'),
	'react-ace': MockComponent('Ace'),
	'react-promise': MockComponent('Promise'),
	'material-ui/svg-icons/action/delete': MockComponent('ActionDelete'),
	'material-ui/svg-icons/content/create': MockComponent('ContentCreate'),

	'./components/Tables': MockComponent('Tables'),

	brace: null,
	'brace/ext/language_tools': null,
	'brace/ext/searchbox': null,
	'brace/mode/javascript': null,
	'brace/mode/markdown': null,
	'brace/snippets/javascript': null,
	...StyleMocks,
	...StyleVariablesMocks,
	...StyleModuleComponentProps,
});

describe('CustomCodeView', () => {
	it('renders correctly', () => {
		const tree = renderer.create(
			<CustomCodeView
				app={{
					settings: settingsMock().settings
				}}
				onCodeChange={() => {}}
				code="code"
				savedCodes={[{}]}
				onSelectSave={() => {}}
				renameSave={() => {}}
				deleteSave={() => {}}
				addSave={() => {}}
				visualize={() => {}}
				run={() => {}}
				errProms={Promise.resolve({})}

				debugConsole={[]}

				algName={{ set: () => {}, value: {} }}
				algType={{
					set: () => {},
					value: {
						possible: []
					}
				}}
				algTypeFeatures={{ set: () => {}, value: {} }}
				algPseudoCode={{ set: () => {}, value: {} }}
				algDescription={{ set: () => {}, value: {} }}
				algTables={{ set: () => {}, value: {} }}
			/>
		).toJSON();
		expect(tree).to.matchSnapshot();
	});
});
