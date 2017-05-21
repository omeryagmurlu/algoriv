import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';

import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';

import { Examples as TO_MUTATE } from 'app/data/inputsRegistry';
import { themedStyle } from 'app/utils';

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
		return (
			<div className={css('container', this.props.theme)} >
				<List>
					{list(this.props.examples, 'Example', this)}
					{list(this.props.customs, 'Custom', this, {
						rightIconButton: (
							<IconButton
								touch
								onTouchTap={() => {
									let name = `Untitled ${this.props.exampleGroup} ${this.props.customs.length}`;
									while (this.props.customs.map(v => v.name).includes(name)) {
										name = `${name}!`;
									}
									this.props.addCustom(name, this.props.input[TO_MUTATE].value);
								}}
							>
								<ContentAdd />
							</IconButton>
						)
					}, item => ({
						rightIconButton: (
							<IconButton
								touch
								onTouchTap={() => this.props.deleteCustom(item.name)}
							>
								<ActionDelete />
							</IconButton>
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
	exampleGroup: PropTypes.string.isRequired
};

export default Examples;
