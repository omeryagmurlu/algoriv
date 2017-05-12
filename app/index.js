import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { AppContainer as ReactHotLoader } from 'react-hot-loader';

import App from './containers/app.container';

injectTapEventPlugin();

const render = (Component) => {
	ReactDOM.render(
		<ReactHotLoader>
			<MuiThemeProvider>
				<Component />
			</MuiThemeProvider>
		</ReactHotLoader>,
		document.getElementById('content')
	);
};

render(App);

if (module.hot) {
	module.hot.accept('./containers/app.container', () => {
		render(App);
	});
}
