import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { AppContainer } from 'react-hot-loader';

import App from './containers/app.container';

const render = (Component) => {
	ReactDOM.render(
		<AppContainer>
			<MuiThemeProvider>
				<Component />
			</MuiThemeProvider>
		</AppContainer>,
		document.getElementById('content')
	);
};

render(App);

if (module.hot) {
	module.hot.accept('./containers/app.container', () => {
		render(App);
	});
}
