import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import MainView from 'app/views/MainView';
import AppView from 'app/views/AppView';
import { themes } from 'app/styles/themes.json'; // An Exception for da rule

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
			theme: 'dark'
		};

		this.history = [initialView];
	}

	topHistory = (a = 0) => this.history[this.history.length - (1 + a)] || null

	getBack = () => this.topHistory(1)

	updateHeader = (headerRoutes, cb) => { // must implement clearing this
		this.setState({ headerRoutes }, cb);
	}

	getThemeColors = () => ({
		palette: themes[this.state.theme]
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

	changeView = (view) => {
		if (view.name === this.topHistory().name) { // BUGFIX: onClick triggers twice
			return;
		}
		this.history.push(view);
		this._setView();
	}

	changeTheme = newTheme => {
		if (themeNames.includes(newTheme)) {
			this.setState({ theme: newTheme });
		}
	}

	render() {
		return (
			<MuiThemeProvider muiTheme={getMuiTheme(this.getThemeColors())} >
				<AppView
					view={this.state.view}

					backData={this.state.back}
					goBack={this.goBack}
					headerRoutes={this.state.headerRoutes}

					theme={this.state.theme}
					changeTheme={this.changeTheme}
					updateHeader={this.updateHeader}
					changeView={this.changeView}
				/>
			</MuiThemeProvider>
		);
	}
}

export default AppContainer;
