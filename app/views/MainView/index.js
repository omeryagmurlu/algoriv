import React from 'react';
import PropTypes from 'prop-types';

import BigButton from 'app/components/BigButton';

import AlgorithmPageView from 'app/views/AlgorithmPageView';
import PageViewFactory from 'app/views/PageViewFactory';

import usage from 'app/../docs/usage.md';

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
		desc: 'Choose from numerous algorithms to visualize'
	},
	{
		view: PageViewFactory(usage),
		name: 'Usage'
	},
	{
		view: MainView,
		name: 'About'
	}
];

MainView.propTypes = {
	app: PropTypes.shape({
		theme: PropTypes.any.isRequired,
		changeView: PropTypes.func.isRequired
	}).isRequired
};

export default MainView;
