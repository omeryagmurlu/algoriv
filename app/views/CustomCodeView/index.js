import React from 'react';
import PropTypes from 'prop-types';
import SideDrawer from 'app/components/SideDrawer';
import { ListItem, List } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
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
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentCreate from 'material-ui/svg-icons/content/create';

import { themedStyle, trimPx, themeVars } from 'app/utils';
import uiVariables from 'app/styles/variables';
import { selectProps, subheaderProps, aceEditorProps } from 'app/styles/module-component-props';

import 'brace';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
import 'brace/mode/javascript';
import 'brace/mode/markdown';
import 'brace/snippets/javascript';

import style from './style.scss';

const css = themedStyle(style);

const CustomCodeView = props => {
	const rightWidth = uiVariables.moduleMaxWidth;
	const itemWidth = uiVariables.moduleMaxWidth;
	const editorOneLineHeight = '30px';
	const errBox = (txt) => (<div style={{ width: '100%' }}>
		<div
			className={css('error', props.app.theme)}
		>
			{txt}
		</div>
	</div>);
	const promButton = (labl, isDis, other) => (<RaisedButton
		label={labl}
		disabled={isDis}
		{...other}
	/>);
	return (
		<div className={css('container', props.app.theme)}>
			<AceEditor
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
			/>
			<SideDrawer side="left" theme={props.app.theme}>
				<List>
					<ListItem
						primaryText="Saved Codes"
						disabled
						primaryTogglesNestedList
						autoGenerateNestedIndicator={false}
						open
						rightIconButton={(
							<IconButton
								touch
								onTouchTap={() => {
									props.app.prompt('Enter Name', name =>
										props.addSave(name)
									);
								}}
							>
								<ContentAdd />
							</IconButton>
						)}
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
			</SideDrawer>
			<SideDrawer
				side="right"
				theme={props.app.theme}
				contentStyle={{
					width: rightWidth,
				}}
			>
				<TextField
					floatingLabelText="Algorithm/Code Name"
					width={itemWidth}
					value={props.algName.value}
					onChange={e => props.algName.set(e.target.value)}
				/>
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
				{(Object.keys(props.algTypeFeatures).length !== 0 && props.algType.value.current) ? (
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
				) : null}
				<AceEditor
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
				/>
				<AceEditor
					{...aceEditorProps(props.app.theme)}
					name="text-editor-pseudo-code"
					onChange={props.algPseudoCode.set}
					value={props.algPseudoCode.value}
					style={{
						width: itemWidth,
						height: props.algPseudoCode.value.includes('\n') ? `${0.5 * trimPx(itemWidth)}px` : editorOneLineHeight,
						minHeight: props.algPseudoCode.value.includes('\n') ? `${0.5 * trimPx(itemWidth)}px` : editorOneLineHeight,
					}}
				/>
				<Async
					promise={props.errProms}
					then={v => (v ? errBox(v.err) : null)}
					pendingRender={errBox('Processing')}
				/>
				<div style={{ width: '100%' }}>
					<div className={css('button-container', props.app.theme)}>
						<Async
							promise={props.errProms}
							then={v => promButton('Run', v && !v.alg, {
								onTouchTap: props.run
							})}
							pendingRender={promButton('Run', true)}
						/>
						<Async
							promise={props.errProms}
							then={v => promButton('Visualize', !!v, {
								onTouchTap: props.visualize
							})}
							pendingRender={promButton('Visualize', true)}
						/>
					</div>
				</div>
				{(props.debugConsole.length > 0) ? (
					<div style={{ width: '100%' }}>
						<div
							className={css('debug-console', props.app.theme)}
						>
							{(props.debugConsole.map(line => `> ${line}`).join('\n'))}
						</div>
					</div>
				) : null}
			</SideDrawer>
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
	// setVisOptions: ,
};

export default CustomCodeView;
