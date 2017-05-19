import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import { ExampleGraphs as GRAPH } from 'app/data/inputsRegistry';
import { themedStyle, themeVars, graphologyImportFix as gimport } from 'app/utils';

import style from './style.scss';

const css = themedStyle(style);

const head = (name, abj) => (
	<Subheader
		style={{
			color: themeVars(abj.theme)('textColor'),
			paddingLeft: 0
		}}
	>{name}</Subheader>
);

const list = (propName, name, abj) => (
	<List>
		{head(name, abj)}
		{abj[propName].map(graph => (
			<ListItem
				key={graph.graph}
				primaryText={graph.name}
				onTouchTap={() => abj.input[GRAPH].update(gimport(graph.graph))}
			/>
		))}
	</List>
);

const ExampleGraphs = props => (
	<div className={css('container', props.theme)} >
		{list('graphs', 'Example Graphs', props)}
	</div>
);

ExampleGraphs.propTypes = {
	theme: PropTypes.string.isRequired,
	graphs: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired
	})).isRequired
};

export default ExampleGraphs;
