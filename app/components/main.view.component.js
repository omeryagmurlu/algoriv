import React from 'react';
import { AlgorithmsList } from '../algorithms';

const MainView = props => (
	<div className="MainView">
		{AlgorithmsList.map(group => (
			<nav key={group.title} >
				<header>{group.title}</header>
				{group.algorithms.map(alg => ( // changing prop FIXME
					<button key={alg.name} onClick={() => props.changeView(alg.view)}>
						<header>{alg.name}</header><p>{alg.desc}</p>
					</button>
				))}
			</nav>
		))}
	</div>
);

export default MainView;
