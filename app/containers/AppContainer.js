import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { LocalStorage } from 'ALIAS-localstorage';

import MainView from 'app/views/MainView';
import AppView from 'app/views/AppView';
import Settings from 'app/features/settings';
import { themes } from 'app/styles/themes.json'; // An Exception for da rule
import { uiFont } from 'app/styles/variables.json'; // An Exception for da rule

const storage = new LocalStorage();

const initialView = {
	view: MainView,
	name: 'Main'
};

class AppContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			view: initialView,
			back: null,
			headerRoutes: [],
			modal: {},

			rawSettings: ''
		};

		this.settings = Settings(storage, () => {
			this.setState({ rawSettings: this.settings().get() });
		});

		// These default settings cause warnings, which are OK, since the upper
		// setState has no effect.
		this.settings('options')('theme').default('giant-goldfish');
		this.settings('options')('grayscale-visualizations').default(false);
		this.settings('options')('animations-enabled').default(true);

		this.history = [initialView];
	}

	componentDidMount() {
		requestAnimationFrame(() => setTimeout(() => {
			document.documentElement.removeAttribute('data-preload');
		}, 0));
	}

	_topHistory = (a = 0) => this.history[this.history.length - (1 + a)] || null

	_getThemeColors = () => ({
		palette: themes[this.settings('options')('theme').get()],
		fontFamily: uiFont
	})

	_getBack = () => this._topHistory(1)

	_setView = () => {
		this.setState({
			view: this._topHistory() || initialView,
			back: this._getBack()
		});
	}

	prompt = (message, continuation = () => {}) => {
		this.setState({
			modal: {
				type: 'prompt',
				message,
				exitStrategy: () => this.setState({ modal: {} }),
				options: {
					continuation
				}
			}
		});
	}

	alert = (severity, message) => {
		this.setState({
			modal: {
				type: 'alert',
				message,
				exitStrategy: (reason) => reason === 'timeout' && this.setState({ modal: {} }),
				durationModifier: severity + 1
			}
		});
	}

	updateHeader = (headerRoutes, cb) => { // must implement clearing this
		this.setState({ headerRoutes }, cb);
	}

	goBack = () => {
		this.history.pop();
		this._setView();
	}

	changeView = (view) => {
		if (view.name === this._topHistory().name) { // BUGFIX: onClick triggers twice
			return;
		}
		this.history.push(view);
		this._setView();
	}

	render() {
		document.documentElement.setAttribute('data-theme', this.settings('options')('theme').get());
		document.documentElement.setAttribute('data-animations-enabled', this.settings('options')('animations-enabled').get());
		return (
			<MuiThemeProvider muiTheme={getMuiTheme(this._getThemeColors())} >
				<AppView
					view={this.state.view}
					modal={this.state.modal}

					backData={this.state.back}
					goBack={this.goBack}
					headerRoutes={this.state.headerRoutes}

					theme={this.settings('options')('theme').get()}
					animationsEnabled={this.settings('options')('animations-enabled').get()}

					settings={this.settings}
					prompt={this.prompt}
					alert={this.alert}
					updateHeader={this.updateHeader}
					changeView={this.changeView}
				/>
			</MuiThemeProvider>
		);
	}
}

export default AppContainer;
