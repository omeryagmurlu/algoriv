import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import { themedStyle, themeVars } from 'app/utils';
import { ballGridPulse } from 'loaders.css/loaders.css';

import style from './style.scss';

const css = themedStyle(style);

const getOverlayClass = props => {
	if (props.disabled) {
		return 'transparent';
	}

	if (props.overlay) {
		return 'semi-transparent';
	}

	return 'opaque';
};

class LoadingView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showCancel: false
		};

		this.timeout = undefined;
	}

	componentWillMount() {
		this.componentWillReceiveProps(this.props);
	}

	componentWillReceiveProps(next) {
		if (getOverlayClass(next) === 'transparent') {
			clearTimeout(this.timeout);
			this.timeout = undefined;
			this.setState({ showCancel: false });
		} else {
			this.timeout = setTimeout(() => {
				this.setState({ showCancel: true });
			}, next.tooLongTime);
		}
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
	}

	render() {
		return (
			<div className={css('container', this.props.app.theme)}>
				<div
					className={[
						css('screen', this.props.app.theme),
						css(getOverlayClass(this.props), this.props.app.theme)
					].join(' ')}
				>
					<div className={css('loading')}>
						<span>{this.props.message}</span>
					</div>
					<div className={css('load-indicator', this.props.app.theme)}>
						<div className={ballGridPulse}>
							<div />
							<div />
							<div />
							<div />
							<div />
							<div />
							<div />
							<div />
							<div />
						</div>
					</div>
					{this.state.showCancel ? <div className={css('too-long')}>
						<p>{this.props.tooLongMessage}</p>
						<FlatButton
							label="Cancel"
							onTouchTap={this.props.tooLongEscape}
							backgroundColor={themeVars(this.props.app.theme)('accent1Color')}
						/>
					</div> : null}
				</div>
				{this.props.overlay}
			</div>
		);
	}
}

LoadingView.defaultProps = {
	overlay: null,
	message: '',
	disabled: false,
	tooLongTime: 3000,
	tooLongEscape: () => {},
	tooLongMessage: '',
};

LoadingView.propTypes = {
	app: PropTypes.any.isRequired,
	overlay: PropTypes.element,
	message: PropTypes.string,
	disabled: PropTypes.bool,
	tooLongTime: PropTypes.number,
	tooLongEscape: PropTypes.func,
	tooLongMessage: PropTypes.string,
};

export default LoadingView;
