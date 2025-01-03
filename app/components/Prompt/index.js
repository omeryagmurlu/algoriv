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
					id="prompt-text"
					hintText={this.props.hintText}
					value={this.state.value}
					onChange={this.onInputChange}
					underlineFocusStyle={this.props.underlineFocusStyle}
					underlineStyle={this.props.underlineStyle}
					underlineShow={this.props.underlineShow}
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
