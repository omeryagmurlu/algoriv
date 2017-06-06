import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import { themedStyle } from 'app/utils';

import style from './style.scss';

const css = themedStyle(style);

class InformationDemandingButton extends Component {
	constructor(props) {
		super(props);

		this.state = {
			opened: false,
			inputs: this.props.demandings.map(({ value }) => value)
		};
	}

	componentWillReceiveProps(newProps) {
		this.setState({
			inputs: newProps.demandings.map(({ value }) => value)
		});
	}

	canBeShown = () => this.props.demandCondition && this.props.demandings.length !== 0
	isOpened = () => this.canBeShown() && this.state.opened

	passiveHandler = () => {
		if (this.canBeShown()) {
			this.setState({ opened: true });
		} else {
			this.props.resolve();
		}
	}

	activeHandler = () => {
		let remains = this.props.demandings.length;
		this.props.demandings.forEach((demand, i) => {
			demand.handler(this.state.inputs[i], () => {
				remains--;
				if (remains === 0) {
					this.setState({ opened: false }, () => this.props.resolve());
				}
			});
		});
	}

	inputHandler = (demand, i) => ({ target: { value } }) => {
		this.setState(pS => {
			pS.inputs[i] = value;
			return pS;
		});
	}

	isButtonDisabled = () => this.state.inputs.reduce(
		(acc, v, i) => acc || !this.props.demandings[i].validate(v), false
	);

	render() {
		const {
			demandCondition,
			demandings,
			resolve,
			formatter,
			activeIcon,
			passiveIcon,
			theme,
			elevation,
			...pTB
		} = this.props;

		const textFields = demandings.map((demand, i) => (
			<TextField
				key={demand.text}
				floatingLabelText={demand.text}
				value={this.state.inputs[i]}
				onChange={this.inputHandler(demand, i)}
				style={{
					marginTop: '-14px',
					width: '125px'
				}}
				errorStyle={{
					display: 'none'
				}}
			/>
		));

		return (
			<div style={{ display: 'inline-flex', alignItems: 'center' }}>
				<div
					className={`
						${css('fields-container', theme)}
						${this.isOpened() && css('open', theme)}
					`}
					style={{ bottom: elevation }}
				>
					{textFields}
				</div>
				<FlatButton
					{...pTB}
					disabled={this.isButtonDisabled()}
					onTouchTap={this.isOpened() ? this.activeHandler : this.passiveHandler}
					icon={this.isOpened() ? activeIcon : passiveIcon}
				/>
			</div>
		);
	}
}

InformationDemandingButton.defaultProps = {
	formatter: v => v,
	demandings: [],
	demandCondition: false,
	elevation: '0px',
};

InformationDemandingButton.propTypes = {
	demandCondition: PropTypes.bool,
	demandings: PropTypes.arrayOf(PropTypes.shape({
		text: PropTypes.string.isRequired,
		validate: PropTypes.func.isRequired,
		handler: PropTypes.func.isRequired,
		value: PropTypes.string.isRequired
	})),
	formatter: PropTypes.func,
	activeIcon: PropTypes.element.isRequired,
	passiveIcon: PropTypes.element.isRequired,
	resolve: PropTypes.func.isRequired,
	elevation: PropTypes.string,
	theme: PropTypes.string.isRequired,
};

export default InformationDemandingButton;
