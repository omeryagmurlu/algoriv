// React libraries
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import MainView from './components/main.view.component';

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

// Render to index.html
ReactDOM.render(
	<App />,
    document.getElementById('content')
);
