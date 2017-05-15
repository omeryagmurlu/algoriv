import React, { Component } from 'react';

import MainView from 'app/views/main.view';
import AppView from 'app/views/App';

const initialView = {
	view: MainView,
	name: 'AppName'
};

class app extends Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [initialView],
			headerRoutes: []
		};

		this.bugfix = initialView.name;
	}

	popHistory = cb => {
		const topped = this.topHistory();
		this.setState(prevState => {
			prevState.history.pop();
			return prevState;
		}, cb);
		return topped;
	}
	topHistory = (a = 0) => this.state.history[this.state.history.length - (1 + a)] || initialView
	pushHistory = (obj, cb) => this.setState(prevState => {
		prevState.history = prevState.history.concat([obj]);
		return prevState;
	}, cb);

	getBack = () => this.topHistory(1)

	goBack = () => {
		this.popHistory(() => this.bugfix = this.topHistory().name);
	}

	updateHeader = (headerRoutes, cb) => {
		this.setState({ headerRoutes }, cb);
	}

	changeView = (view) => {
		if (view.name === this.bugfix) { // BUG: onClick triggers twice
			console.log('me');
			return;
		}
		this.bugfix = view.name;
		this.pushHistory(view);
	}

	render() {
		return (
			<AppView
				view={this.topHistory()}

				backData={this.getBack()}
				goBack={this.goBack}
				headerRoutes={this.state.headerRoutes}

				updateHeader={this.updateHeader}
				changeView={this.changeView}
			/>
		);
	}
}

export default app;
