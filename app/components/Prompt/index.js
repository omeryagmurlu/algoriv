import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import ContentSend from 'material-ui/svg-icons/content/send';

class Prompt extends Component {
	constructor(props) {
		super(props);

		this.state = {
			value: ''
		};
	}

	onInputChange = e => this.setState({ value: e.target.value })
	onButtonClick = () => this.props.send(this.state.value)

	render() {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'flex-end',
					alignItems: 'center',
				}}
			>
				<TextField
					hintText="Text Here"
					value={this.state.value}
					onChange={this.onInputChange}
				/>
				<FlatButton
					icon={<ContentSend />}
					onTouchTap={this.onButtonClick}
				/>
			</div>
		);
	}
}

export default Prompt;
