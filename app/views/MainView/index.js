import React from 'react';
import PropTypes from 'prop-types';
import { themedStyle } from 'app/utils';

import BigButton from 'app/components/BigButton';

import AlgorithmPageView from 'app/views/AlgorithmPageView';
import CustomCodeContainer from 'app/containers/CustomCodeContainer';
import PageViewFactory from 'app/views/PageViewFactory';
import OptionsView from 'app/views/OptionsView';

import usage from 'app/../docs/usage.md';

import style from './style.scss';

const css = themedStyle(style);

const MainView = props => (
	<div className={css('mainView')}>
		<div
			className={css('container')}
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
		view: CustomCodeContainer,
		name: 'Custom Code',
		desc: 'Visualize your own code with algoriv'
	},
	{
		view: OptionsView,
		name: 'Options'
	},
	{
		view: PageViewFactory(usage),
		name: 'Usage'
	},
];

MainView.propTypes = {
	app: PropTypes.shape({
		theme: PropTypes.any.isRequired,
		changeView: PropTypes.func.isRequired
	}).isRequired
};

export default MainView;
