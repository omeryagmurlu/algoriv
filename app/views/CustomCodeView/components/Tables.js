import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { ListItem, List } from 'material-ui/List';
import Dialog from 'app/components/Dialog';
import { themeVars } from 'app/utils';
import { textFieldProps } from 'app/styles/module-component-props';

import ContentCreate from 'material-ui/svg-icons/content/create';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionDelete from 'material-ui/svg-icons/action/delete';

class Tables extends Component {
	constructor(props) {
		super(props);

		this.state = {
			dialogOpen: false,
			dialogTitle: '',

			oldTable: false,

			dTName: '',
			dCols: [],
		};
	}

	openTableDialog(subset, table) {
		this.setState({
			dialogTitle: `Table - ${subset}`,
			dialogOpen: true,

			oldTable: table ? table.id : false,

			dTName: table ? table.id : '',
			dCols: table ? table.columns : [],
		});
	}

	onTableEditTap = (table) => {
		this.openTableDialog(table.id, table);
	}

	onAddTableTap = () => {
		this.openTableDialog('Add');
	}

	onDeleteColumnTap = (colName) => {
		this.setState(prev => {
			prev.dCols.splice(prev.dCols.findIndex(v => v === colName), 1);
			return prev;
		});
	}

	onAddColumnTap = () => {
		this.props.prompt('Column Name', name => {
			this.setState(prev => {
				prev.dCols.push(name);
				return prev;
			});
		});
	}

	saveTable = () => {
		if (!this.state.dTName) {
			return;
		}
		const cb = () => this.dialogClose();
		if (this.state.oldTable) {
			(this.props.vsTables.set()
				.add(this.state.oldTable, this.state.dCols, this.state.dTName, cb));
		} else {
			this.props.vsTables.set().add(this.state.dTName, this.state.dCols, undefined, cb);
		}
	}

	deleteTable = () => {
		const cb = () => this.dialogClose();
		this.props.vsTables.set().remove(this.state.oldTable, cb);
	}

	dialogClose = () => {
		this.setState({
			dialogOpen: false,

			dTName: '',
			dCols: [],
		});
	}

	render() {
		const dialogTextStayla = {
			color: themeVars(this.props.theme)('alternativeTextColor')
		};
		return (
			<div>
				<Dialog
					theme={this.props.theme}
					open={this.state.dialogOpen}
					title={this.state.dialogTitle}
					onRequestClose={this.dialogClose}
					actions={[(
						this.state.oldTable ? <FlatButton
							style={dialogTextStayla}
							label="Delete"
							onTouchTap={this.deleteTable}
						/> : undefined
					), (
						<FlatButton
							style={dialogTextStayla}
							label={this.state.oldTable ? 'Save' : 'Add'}
							onTouchTap={this.saveTable}
						/>
					)].filter(v => v)}
				>
					<div>
						<TextField
							{...textFieldProps(this.props.theme)}
							id="table-name-text-field-custom-code"
							floatingLabelText="Table ID"
							value={this.state.dTName}
							onChange={(_, v) => this.setState({ dTName: v })}
						/>
						<List>
							<ListItem
								style={dialogTextStayla}
								primaryText="Columns"
								primaryTogglesNestedList
								autoGenerateNestedIndicator={false}
								open
								disabled
								nestedItems={this.state.dCols.map(colName =>
									<ListItem
										style={dialogTextStayla}
										key={colName}
										primaryText={colName}
										disabled
										rightIconButton={<IconButton
											touch
											onTouchTap={() => this.onDeleteColumnTap(colName)}
										>
											<ActionDelete {...dialogTextStayla} />
										</IconButton>}
									/>
								)}
								rightIconButton={<IconButton
									touch
									onTouchTap={() => this.onAddColumnTap()}
								>
									<ContentAdd {...dialogTextStayla} />
								</IconButton>}
							/>
						</List>
					</div>
				</Dialog>
				<List>
					<ListItem
						primaryText="Tables"
						autoGenerateNestedIndicator={false}
						open
						disabled
						nestedItems={this.props.vsTables.value.map(table =>
							<ListItem
								key={table.id}
								primaryText={table.id}
								disabled
								rightIconButton={<IconButton
									touch
									onTouchTap={() => this.onTableEditTap(table)}
								>
									<ContentCreate />
								</IconButton>}
							/>
						)}
						rightIconButton={<IconButton
							touch
							onTouchTap={this.onAddTableTap}
						>
							<ContentAdd />
						</IconButton>}
					/>
				</List>
			</div>
		);
	}
}

Tables.propTypes = {
	vsTables: PropTypes.object.isRequired,
	theme: PropTypes.string.isRequired,
	prompt: PropTypes.func.isRequired,
};

export default Tables;
