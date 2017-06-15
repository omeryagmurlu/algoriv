import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import _uniq from 'lodash.uniq';

import { textFieldProps } from 'app/styles/module-component-props';
import { themedStyle, trace } from 'app/utils';

import style from './style.scss';

const css = themedStyle(style);

const getGroup = (demandings) => {
	const groupNames = _uniq(demandings.map(({ group }) => group));
	const groupHash = groupNames.reduce((acc, name) => {
		acc[name] = demandings.filter(({ group }) => group === name);
		return acc;
	}, {});
	groupNames.sort((a, b) => {
		const elemCountDiff = groupHash[a].length - groupHash[b].length;
		if (elemCountDiff !== 0) { // same number of elems, look at to title length
			return elemCountDiff;
		}

		return a.length - b.length;
	});
	return {
		groupNames,
		groups: groupNames.map(name => groupHash[name]),
	};
};

const getInputs = (props) => props.demandings.reduce((acc, { value, group, text }) => {
	acc[group] = acc[group] || {};
	acc[group][text] = value;
	return acc;
}, {});

class InformationDemandingButton extends Component {
	constructor(props) {
		super(props);

		this.state = {
			opened: false,
			inputs: getInputs(this.props)
		};
	}

	componentWillReceiveProps(newProps) {
		this.setState({
			inputs: getInputs(newProps)
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
		this.props.demandings.forEach((demand) => {
			demand.handler(this.state.inputs[demand.group][demand.text], () => {
				remains--;
				if (remains === 0) {
					this.setState({ opened: false }, () => this.props.resolve());
				}
			});
		});
	}

	inputHandler = (demand) => ({ target: { value } }) => {
		this.setState(pS => {
			pS.inputs[demand.group][demand.text] = value;
			return pS;
		});
	}

	didGroupErrored = (groupIdx) => {
		const { groups, groupNames } = getGroup(this.props.demandings);
		return groups[groupIdx].reduce(
			(acc, val) => acc || !val.validate(this.state.inputs[groupNames[groupIdx]][val.text]), false
		);
	}

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

		const { groups, groupNames } = getGroup(this.props.demandings);

		const textFields = (demGrp, errors) => trace(demGrp).map((demand, i) => (
			<TextField
				{...textFieldProps(this.props.theme, this.props.secondary)}
				key={`${demand.group} ${demand.text}`}
				floatingLabelText={demand.text}
				value={this.state.inputs[demand.group][demand.text]}
				onChange={this.inputHandler(demand, i)}
				errorText={errors[i]}
				style={{
					marginTop: '-14px',
					width: '125px'
				}}
			/>
		));

		return (
			<div style={{ display: 'inline-flex', alignItems: 'center' }}>
				<div
					className={css('group-container')}
					style={{ bottom: elevation }}
				><div className={css('wrapper')}>
					{groups.map((group, gi) => {
						const errors = group.map((demand) =>
							demand.invalid(this.state.inputs[demand.group][demand.text]));
						return (
							<div
								key={groupNames[gi]}
								className={`
									${css('fields-container', theme)}
									${this.isOpened() && css('open')}
									${this.props.secondary && css('secondary', theme)}
								`}
								style={errors.reduce((prev, curr) => curr || prev, false) ? { // HATE U MATERIAL
									paddingBottom: '12px',
								} : {}}
							>
								{groupNames[gi] && <div className={css('group-header', theme)}>{groupNames[gi]}</div>}
								{textFields(group, errors)}
							</div>
						);
					})}
				</div></div>
				<FlatButton
					{...pTB}
					disabled={groupNames.reduce((prev, curr, i) => this.didGroupErrored(i) || prev, false)}
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
	secondary: false,
};

InformationDemandingButton.propTypes = {
	demandCondition: PropTypes.bool,
	demandings: PropTypes.arrayOf(PropTypes.shape({
		text: PropTypes.string.isRequired,
		validate: PropTypes.func.isRequired,
		invalid: PropTypes.func.isRequired,
		handler: PropTypes.func.isRequired,
		value: PropTypes.string.isRequired
	})),
	formatter: PropTypes.func,
	activeIcon: PropTypes.element.isRequired,
	passiveIcon: PropTypes.element.isRequired,
	resolve: PropTypes.func.isRequired,
	elevation: PropTypes.string,
	theme: PropTypes.string.isRequired,
	secondary: PropTypes.bool,
};

export default InformationDemandingButton;
