import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { LocalStorage } from 'ALIAS-localstorage';

import MainView from 'app/views/MainView';
import AppView from 'app/views/AppView';
import Settings from 'app/features/settings';
import { themes } from 'app/styles/themes.json'; // An Exception for da rule

const storage = new LocalStorage();

const themeNames = Object.keys(themes);

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

		this.settings('theme').default('dark');

		this.history = [initialView];
	}

	topHistory = (a = 0) => this.history[this.history.length - (1 + a)] || null

	getBack = () => this.topHistory(1)

	updateHeader = (headerRoutes, cb) => { // must implement clearing this
		this.setState({ headerRoutes }, cb);
	}

	getThemeColors = () => ({
		palette: themes[this.settings('theme').get()]
	})

	_setView = () => {
		this.setState({
			view: this.topHistory() || initialView,
			back: this.getBack()
		});
	}

	goBack = () => {
		this.history.pop();
		this._setView();
	}

	prompt = (message, continuation) => {
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

	changeView = (view) => {
		if (view.name === this.topHistory().name) { // BUGFIX: onClick triggers twice
			return;
		}
		this.history.push(view);
		this._setView();
	}

	changeTheme = newTheme => {
		if (themeNames.includes(newTheme)) {
			this.settings('theme').set(newTheme);
		}
	}

	render() {
		document.documentElement.setAttribute('data-theme', this.settings('theme').get());
		return (
			<MuiThemeProvider muiTheme={getMuiTheme(this.getThemeColors())} >
				<AppView
					view={this.state.view}
					modal={this.state.modal}

					backData={this.state.back}
					goBack={this.goBack}
					headerRoutes={this.state.headerRoutes}

					theme={this.settings('theme').get()}

					settings={this.settings}
					prompt={this.prompt}
					changeTheme={this.changeTheme}
					updateHeader={this.updateHeader}
					changeView={this.changeView}
				/>
			</MuiThemeProvider>
		);
	}
}

export default AppContainer;
