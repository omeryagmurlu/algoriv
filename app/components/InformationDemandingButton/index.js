import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import { rippleWait } from 'app/utils';

class InformationDemandingButton extends Component {
	constructor(props) {
		super(props);

		this.state = {
			active: false,
			inputValues: [],
		};
	}

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
		const textFields = this.state.active && demandings.map(({ text }, i) => (
			<TextField
				hintText={text}
				key={text}
				onChange={({ target: { value } }) => this.setState(pS => {
					pS.inputValues[i] = value;
					return pS;
				})}
			/>
		));
		const sendEvent = () => {
			if (!this.state.active) {
				rippleWait(() => this.setState({ active: true }));
			} else {
				let remaining = demandings.length;
				demandings.forEach(({ handler }, i) => {
					handler(formatter(this.state.inputValues[i]), () => {
						remaining--;
						if (remaining === 0) {
							rippleWait(() => {
								this.setState({ active: false });
								resolve();
							});
						}
					});
				});
			}
		};

		return (
			<div style={{ display: 'inline-block' }}>
				{textFields}
				<FlatButton
					{...pTB}
					onTouchTap={(!demandCondition || demandings.length === 0) ? resolve : sendEvent}
					icon={this.state.active ? activeIcon : passiveIcon}
				/>
			</div>
		);
	}
}

InformationDemandingButton.defaultProps = {
	formatter: () => {},
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
