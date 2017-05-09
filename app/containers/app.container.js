import React, { Component } from 'react';
import MainView from 'App/views/main.view';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			view: MainView
		};
	}

	changeView = (view) => {
		this.setState({ view });
	}

	render() {
		return React.createElement(this.state.view, {
			changeView: this.changeView
		});
	}
}

export default App;
