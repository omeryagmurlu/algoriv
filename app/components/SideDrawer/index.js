import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { themedStyle, themeVars } from 'app/utils';

import FlatButton from 'material-ui/FlatButton';

import HardwareKeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import HardwareKeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';

import style from './style.scss';

const css = themedStyle(style);

class SideDrawer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			active: false
		};
	}

	theme = (key) => themeVars(this.props.theme)(key)

	toggleActive = () => {
		this.setState(prevState => {
			prevState.active = !prevState.active;
			return prevState;
		});
	}

	side(r, l) {
		return this.props.side === 'right' ? r : l;
	}

	active(y, n) {
		return !this.state.active ? y : n;
	}

	render() {
		return (
			<aside
				className={classNames({
					[css('par', this.props.theme)]: true,
					[this.side(css('right'), css('left'))]: true,
					[css('active')]: this.state.active,
				})}
			>
				<section className={css('container')}>
					{this.props.children}
				</section>
				<div className={css('handle')}>
					<FlatButton
						onClick={this.toggleActive}
					/>
					{React.createElement(
						this.side(
							HardwareKeyboardArrowLeft,
							HardwareKeyboardArrowRight
						), {
							className: css('handleIcon'),
							color: this.theme('alternativeTextColor')
						}
					)}
				</div>
			</aside>
		);
	}
}

SideDrawer.defaultProps = {
	children: null
};

SideDrawer.propTypes = {
	theme: PropTypes.string.isRequired,
	side: PropTypes.oneOf(['right', 'left']).isRequired,
	children: PropTypes.any
};

export default SideDrawer;
