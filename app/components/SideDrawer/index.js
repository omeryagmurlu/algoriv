import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { themedStyle } from 'app/utils';

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
				<div className={css('handle')} onClick={this.toggleActive}>
					{React.createElement(
						this.side(
							this.active(HardwareKeyboardArrowLeft, HardwareKeyboardArrowRight),
							this.active(HardwareKeyboardArrowRight, HardwareKeyboardArrowLeft)
						), {
							className: css('handleIcon')
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
