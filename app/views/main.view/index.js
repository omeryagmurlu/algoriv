import React, { Component } from 'react';

import AlgorithmPageView from 'app/views/algorithm-page.view';
import BigButton from 'app/components/BigButton';

import { mainView, container } from './style.scss';

const views = [
	{
		view: AlgorithmPageView,
		name: 'Algorithms',
		desc: 'Give \'em all what they want!'
	},
	{
		view: MainView,
		name: 'Custom Code'
	},
	{
		view: MainView,
		name: 'CO-OP'
	}
];

class MainView extends Component {
	render() {
		return (
			<div className={mainView}>
				<div
					className={container}
				>
					{views.map(v => (
						<BigButton
							name={v.name}
							key={v.name}
							desc={v.desc}
							onTouchTap={() => this.props.changeView(v.view)}
						/>
					))}
				</div>
			</div>
		);
	}
}

export default MainView;
