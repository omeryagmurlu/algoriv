// React libraries
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import MainViewContainer from './containers/main.view.container';

const views = {
	main: MainViewContainer
};

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			location: 'main'
		};
	}

	changeView(view) { // string
		this.setState({ location: view });
	}

	render() {
		return React.createElement(views[this.state.location], {
			changeView: this.changeView.bind(this)
		});
	}
}

// Render to index.html
ReactDOM.render(
    <App />,
    document.getElementById('content')
);
