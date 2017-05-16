import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';

import { rippleWait } from 'app/utils';

class InformationDemandingButton extends Component {
	constructor(props) {
		super(props);

		this.state = {
			opened: false,
			errors: [],
			inputValues: [],
		};
	}

	isShown = () => this.props.demandCondition || this.props.demandings.length === 0
	isOpened = () => this.isShown() && this.state.opened

	handler = () => {
		if (this.isShown()) {
			if (!this.isOpened()) {
				rippleWait(() => this.setState({ opened: true }));
			} else {
				let remaining = this.props.demandings.length;
				this.props.demandings.forEach(({ handler, defaultValue }, i) => {
					handler(this.props.formatter(this.state.inputValues[i] || defaultValue), (err) => {
						if (err) {
							this.setState(pS => {
								pS.errors[i] = err;
								return pS;
							});
							return;
						}

						this.setState(pS => {
							pS.errors[i] = null;
							return pS;
						});

						remaining--;
						if (remaining === 0) {
							rippleWait(() => {
								this.setState({ opened: false });
								this.props.resolve();
							});
						}
					});
				});
			}
		} else {
			this.props.resolve();
		}
	};

	// floatingLabelText={text}
	// defaultValue={defaultValue}
	// errorText={this.state.errors[i]}
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
		const textFields = this.isOpened() && demandings.map(({ text, defaultValue }, i) => (
			<input
				key={text}

				onChange={({ target: { value } }) => this.setState(pS => {
					pS.inputValues[i] = value;
					return pS;
				})}
			/>
		));

		return (
			<div style={{ display: 'inline-flex', alignItems: 'center' }}>
				{textFields}
				<FlatButton
					{...pTB}
					onTouchTap={this.handler}
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
		handler: PropTypes.func.isRequired
	})),
	formatter: PropTypes.func,
	activeIcon: PropTypes.element.isRequired,
	passiveIcon: PropTypes.element.isRequired,
	resolve: PropTypes.func.isRequired
};

export default InformationDemandingButton;
