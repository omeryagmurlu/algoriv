import React from 'react';
import PropTypes from 'prop-types';
import Subheader from 'material-ui/Subheader';

import { AlgorithmsList } from 'app/data/algorithms';
import { themeVars } from 'app/utils';
import BigButton from 'app/components/BigButton';
import { pageView, container } from './style.scss';

const AlgorithmPageView = props => (
	<div className={pageView}>
		{AlgorithmsList.map(group => (
			<nav key={group.title} >
				<h1>{group.title}</h1>
				<div
					className={container}
				>
					{group.algorithms.map(alg => ( // changing prop FIXME
						<BigButton
							name={alg.name}
							key={alg.name}
							desc={alg.desc}
							cols={2}
							onTouchTap={() => props.app.changeView(alg)}
							theme={props.app.theme}
						/>
					))}
				</div>
			</nav>
		))}
	</div>
);

AlgorithmPageView.propTypes = {
	app: PropTypes.shape({
		theme: PropTypes.string.isRequired
	}).isRequired
};

export default AlgorithmPageView;
