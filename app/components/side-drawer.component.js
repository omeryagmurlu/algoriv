import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import HardwareKeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import HardwareKeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';

import styles from '../styles/side-drawer.scss';

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
					[styles.par]: true,
					[this.side(styles.right, styles.left)]: true,
					[styles.active]: this.state.active,
				})}
			>
				<section className={styles.container}>
					{this.props.children}
				</section>
				<div className={styles.handle} onClick={this.toggleActive}>
					{React.createElement(
						this.side(
							this.active(HardwareKeyboardArrowLeft, HardwareKeyboardArrowRight),
							this.active(HardwareKeyboardArrowRight, HardwareKeyboardArrowLeft)
						), {
							className: styles.handleIcon
						}
					)}
				</div>
			</aside>
		);
	}
}

SideDrawer.propTypes = {

};

export default SideDrawer;
