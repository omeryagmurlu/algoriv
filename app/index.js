import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { AppContainer as ReactHotLoader } from 'react-hot-loader';

import AppContainer from './containers/AppContainer';

injectTapEventPlugin();

const render = (Component) => {
	ReactDOM.render(
		<ReactHotLoader>
			<Component />
		</ReactHotLoader>,
		document.getElementById('react-binding')
	);
};

render(AppContainer);

if (module.hot) {
	module.hot.accept('./containers/AppContainer', () => {
		render(AppContainer);
	});
}
