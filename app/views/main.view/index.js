import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { AlgorithmsList } from './data/algorithms';

injectTapEventPlugin();

const MainView = props => (
	<div className="MainView">
		{AlgorithmsList.map(group => (
			<nav key={group.title} >
				<header>{group.title}</header>
				{group.algorithms.map(alg => ( // changing prop FIXME
					<FlatButton key={alg.name} onTouchTap={() => props.changeView(alg.view)}>
						<header>{alg.name}</header><p>{alg.desc}</p>
					</FlatButton>
				))}
			</nav>
		))}
	</div>
);

export default MainView;
