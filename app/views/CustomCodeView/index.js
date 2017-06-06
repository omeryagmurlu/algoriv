import React from 'react';
import PropTypes from 'prop-types';
import SideDrawer from 'app/components/SideDrawer';
import { ListItem, List } from 'material-ui/List';
import IconMenu from 'app/components/IconMenu';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
import AceEditor from 'react-ace';
import Async from 'react-promise';

import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentCreate from 'material-ui/svg-icons/content/create';

import { themedStyle, trimPx, themeVars } from 'app/utils';
import uiVariables from 'app/styles/variables';
import { selectProps, subheaderProps, aceEditorProps, textFieldProps } from 'app/styles/module-component-props';

import 'brace';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
import 'brace/mode/javascript';
import 'brace/mode/markdown';
import 'brace/snippets/javascript';

import style from './style.scss';
import Tables from './components/Tables';

const css = themedStyle(style);

const CustomCodeView = props => {
	const rightWidth = uiVariables.moduleMaxWidth;
	const itemWidth = uiVariables.moduleMaxWidth;
	const errBox = (txt) => (<div style={{ width: '100%' }}>
		<div
			className={css('error', props.app.theme)}
		>
			{txt}
		</div>
	</div>);
	const promButton = (labl, isDis, other) => (<RaisedButton
		label={labl}
		labelColor={themeVars(props.app.theme)('alternativeTextColor')}
		disabled={isDis}
		{...other}
	/>);

	const visCache = () => props.app.settings('visual-cache')('customCodeView');
	visCache()('algConfigDrawer')('isOpened').default(true);
	visCache()('tables')('list')('isOpened').default(true);

	const main = () => (<AceEditor
		{...aceEditorProps(props.app.theme)}
		className={css('ace-editor', props.app.theme)}
		mode="javascript"
		name="text-editor-logic-code"
		onChange={props.onCodeChange}
		value={props.code}
		enableBasicAutocompletion
		enableLiveAutocompletion
		setOptions={{
			enableSnippets: false,
			showLineNumbers: true
		}}
	/>);

	const leftDrawer = () => (<SideDrawer side="left" theme={props.app.theme}>
		<List>
			<ListItem
				primaryText="Saved Codes"
				disabled
				primaryTogglesNestedList
				autoGenerateNestedIndicator={false}
				open
				nestedItems={props.savedCodes.map(save =>
					<ListItem
						key={save.name}
						primaryText={save.name}
						onTouchTap={() => props.onSelectSave(save)}
						rightIconButton={IconMenu({
							theme: props.app.theme,
							items: [{
								name: 'Rename',
								icon: ContentCreate,
								onTouch: () =>
									props.app.prompt('Enter New Name', newName =>
										props.renameSave(save, newName)
									)
							}, {
								name: 'Delete',
								icon: ActionDelete,
								onTouch: () => props.deleteSave(save)
							}]
						})}
					/>
				)}
			/>
		</List>
	</SideDrawer>);

	const algName = () => (<TextField
		{...textFieldProps(props.app.theme)}
		floatingLabelText="Algorithm/Code Name"
		width={itemWidth}
		value={props.algName.value}
		onChange={e => props.algName.set(e.target.value)}
	/>);
	const algType = () => (
		<SelectField
			floatingLabelText="Algorithm Type"
			width={itemWidth}
			value={props.algType.value.current}
			onChange={(e, i, v) => props.algType.set(v)}
			{...selectProps(props.app.theme)}
		>
			{props.algType.value.possible.map(pos => (
				<MenuItem key={pos} value={pos} primaryText={pos} />
			))}
		</SelectField>
	);
	const algTypeFeatures = () => (
		(Object.keys(props.algTypeFeatures).length !== 0 && props.algType.value.current) ? (
			<div style={{ width: itemWidth }}>
				<Subheader
					{...subheaderProps()}
				>Type Specific Features</Subheader>
				{props.algTypeFeatures.value.map(({ name, enabled }) => (
					<Checkbox
						key={name}
						label={name}
						checked={enabled}
						onCheck={(e, v) => props.algTypeFeatures.set(name, v)}
					/>
				))}
			</div>
		) : null
	);
	const algDescription = () => (<AceEditor
		{...aceEditorProps(props.app.theme)/* This Ace is amazing, I'll use it for description */}
		name="text-editor-description"
		mode="markdown"
		onChange={props.algDescription.set}
		value={props.algDescription.value}
		showGutter={false}
		highlightActiveLine={false}
		wrapEnabled
		editorProps={{
			$blockScrolling: Infinity,
			wrap: true
		}}
		style={{
			width: itemWidth,
			height: `${0.25 * trimPx(itemWidth)}px`,
			minHeight: `${0.25 * trimPx(itemWidth)}px`,
			background: themeVars(props.app.theme)('backgroundColor'),
			fontFamily: 'monospace', // BUG: can't use uiVariables.textFont since ace only supports monospace, I no longer like ace
			fontSize: '11pt'
		}}
	/>);
	const algPseudoCode = () => (<AceEditor
		{...aceEditorProps(props.app.theme)}
		name="text-editor-pseudo-code"
		onChange={props.algPseudoCode.set}
		value={props.algPseudoCode.value}
		style={{
			width: itemWidth,
			height: `${0.5 * trimPx(itemWidth)}px`,
			minHeight: `${0.5 * trimPx(itemWidth)}px`,
		}}
	/>);
	const algErrorBox = () => (<Async
		promise={props.errProms}
		then={v => (v ? errBox(v.err) : null)}
		pendingRender={errBox('Processing')}
	/>);
	const algActionButtons = () => (<div style={{ width: '100%' }}>
		<div className={css('button-container', props.app.theme)}>
			<Async
				promise={props.errProms}
				then={v => promButton('Run', v && !v.alg, {
					onTouchTap: props.run,
					backgroundColor: themeVars(props.app.theme)('accent1Color')
				})}
				pendingRender={promButton('Run', true)}
			/>
			<Async
				promise={props.errProms}
				then={v => promButton('Visualize', !!v, {
					onTouchTap: props.visualize,
					backgroundColor: themeVars(props.app.theme)('accent1Color')
				})}
				pendingRender={promButton('Visualize', true)}
			/>
			{promButton('Save', false, {
				onTouchTap: () => props.addSave(props.algName.value),
				backgroundColor: themeVars(props.app.theme)('primary2Color')
			})}
		</div>
	</div>);
	const algConsoleBox = () => ((props.debugConsole.length > 0) ? (
		<div style={{ width: '100%' }}>
			<div
				className={css('debug-console', props.app.theme)}
			>
				{(props.debugConsole.map(line => `> ${line}`).join('\n'))}
			</div>
		</div>
	) : null);
	const algTables = () => (
		<Tables
			visualCache={() => visCache()('tables')}
			vsTables={props.algTables}
			theme={props.app.theme}
			prompt={props.app.prompt}
		/>
	);

	const rightDrawer = () => (
		<SideDrawer
			side="right"
			theme={props.app.theme}
			contentStyle={{
				width: rightWidth,
			}}
			visualCache={() => visCache()('algConfigDrawer')}
		>
			{algName()}
			{algType()}
			{algTypeFeatures()}
			{algDescription()}
			{algPseudoCode()}
			{algTables()}
			{algErrorBox()}
			{algActionButtons()}
			{algConsoleBox()}
		</SideDrawer>
	);

	return (
		<div className={css('container', props.app.theme)}>
			{main()}
			{leftDrawer()}
			{rightDrawer()}
		</div>
	);
};

CustomCodeView.defaultProps = {
	code: '// type your code...',
	savedCodes: [],
	debugConsole: [],
};

const algGetterSetterPropType = PropTypes.shape({
	set: PropTypes.func.isRequired,
	value: PropTypes.any.isRequired
});

CustomCodeView.propTypes = {
	app: PropTypes.any.isRequired,
	onCodeChange: PropTypes.func.isRequired,
	code: PropTypes.string,
	savedCodes: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string,
		code: PropTypes.string
	})),
	onSelectSave: PropTypes.func.isRequired,
	renameSave: PropTypes.func.isRequired,
	deleteSave: PropTypes.func.isRequired,
	addSave: PropTypes.func.isRequired,
	visualize: PropTypes.func.isRequired,
	run: PropTypes.func.isRequired,
	debugConsole: PropTypes.array,
	errProms: PropTypes.object.isRequired, // Async

	algName: algGetterSetterPropType.isRequired,
	algType: algGetterSetterPropType.isRequired,
	algTypeFeatures: algGetterSetterPropType.isRequired,
	algPseudoCode: algGetterSetterPropType.isRequired,
	algDescription: algGetterSetterPropType.isRequired,
	algTables: algGetterSetterPropType.isRequired,
	// setVisOptions: ,
};

export default CustomCodeView;
