import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';

import { rippleWait } from 'app/utils';

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
			rippleWait(() => this.setState({ opened: true }));
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
			...pTB
		} = this.props;

		const textFields = this.isOpened() && demandings.map((demand, i) => (
			<input
				key={demand.text}
				placeholder={demand.text}
				value={this.state.inputs[i]}
				onChange={this.inputHandler(demand, i)}
			/>
		));

		return (
			<div style={{ display: 'inline-flex', alignItems: 'center' }}>
				{textFields}
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
	demandCondition: false
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
	resolve: PropTypes.func.isRequired
};

export default InformationDemandingButton;
