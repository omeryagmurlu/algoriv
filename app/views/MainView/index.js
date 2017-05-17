import React from 'react';
import PropTypes from 'prop-types';

import AlgorithmPageView from 'app/views/AlgorithmPageView';
import BigButton from 'app/components/BigButton';

import { mainView, container } from './style.scss';

const MainView = props => (
	<div className={mainView}>
		<div
			className={container}
		>
			{views.map(v => (
				<BigButton
					name={v.name}
					key={v.name}
					desc={v.desc}
					onTouchTap={() => props.app.changeView(v)}
					theme={props.app.theme}
				/>
			))}
		</div>
	</div>
);

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

MainView.propTypes = {
	app: PropTypes.shape({
		theme: PropTypes.any.isRequired,
		changeView: PropTypes.func.isRequired
	}).isRequired
};

export default MainView;
