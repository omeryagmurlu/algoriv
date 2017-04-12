import React from 'react';
import ReactDOM from 'react-dom';

import { AppContainer } from 'react-hot-loader';

import App from './containers/app.container';

const render = (Component) => {
	ReactDOM.render(
		<AppContainer>
			<Component />
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
