import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'app/components/IconMenu';

import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentCreate from 'material-ui/svg-icons/content/create';

import { Examples as TO_MUTATE } from 'app/data/inputsRegistry';
import { themedStyle, ifModuleEnabled } from 'app/utils';

import style from './style.scss';

const css = themedStyle(style);

const list = (items, prefixName, that, mainAttr = {}, optAttr = () => ({}), suffixElem = null) => (
	<ListItem
		key={JSON.stringify(items)}
		primaryText={`${prefixName} ${that.props.exampleGroup}s`}
		primaryTogglesNestedList
		autoGenerateNestedIndicator={false}
		open={that.state[`open${prefixName}`]}
		onNestedListToggle={() => that.setState(prev => {
			prev[`open${prefixName}`] = !prev[`open${prefixName}`];
			return prev;
		})}
		{...mainAttr}
		nestedItems={
			(items.map(example => (
				<ListItem
					key={example.name}
					primaryText={example.name}
					onTouchTap={() => that.props.input[TO_MUTATE].update(example.data)}
					{...optAttr(example)}
				/>
			))).concat(suffixElem)
		}
	/>
);

class Examples extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openExample: true,
			openCustom: false
		};
	}
	render() {
		const uniqName = given => {
			let name = given;
			while (this.props.customs.map(v => v.name).includes(name)) {
				name = `${name}!`;
			}
			return name;
		};
		return ifModuleEnabled('examples', this.props,
			<div className={css('container', this.props.theme)} >
				<List>
					{list(this.props.examples, 'Example', this)}
					{list(this.props.customs, 'Custom', this, {
						rightIconButton: (
							<IconButton
								touch
								onTouchTap={() => {
									this.props.app.prompt('Enter Name', name =>
										this.props.addCustom(uniqName(name), this.props.input[TO_MUTATE].value)
									);
								}}
							>
								<ContentAdd />
							</IconButton>
						)
					}, item => ({
						rightIconButton: (
							IconMenu({
								theme: this.props.app.theme,
								items: [{
									name: 'Rename',
									icon: ContentCreate,
									onTouch: () =>
										this.props.app.prompt('Enter New Name', newName =>
											this.props.renameCustom(item.name, uniqName(newName))
										)
								}, {
									name: 'Delete',
									icon: ActionDelete,
									onTouch: () => this.props.deleteCustom(item.name)
								}]
							})
						)
					}))}
				</List>
			</div>
		);
	}
}

Examples.propTypes = {
	theme: PropTypes.string.isRequired,
	examples: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		data: PropTypes.any.isRequired
	})).isRequired,
	customs: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		data: PropTypes.any.isRequired
	})).isRequired,
	// exampleGroup: PropTypes.string.isRequired
};

export default Examples;
