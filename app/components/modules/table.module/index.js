import React from 'react';
import PropTypes from 'prop-types';
import {
	Table as TableView,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table';
import { themedStyle, ifModuleEnabled, trimPx } from 'app/utils';
import vars from 'app/styles/variables.json';

import style from './style.scss';

const css = themedStyle(style);

const Table = props => ifModuleEnabled('table', props, (props.data.length > 0 && (
	<div
		className={css('container', props.theme)}
		style={{
			width: `${props.width}px`
		}}
	>
		<TableView>
			<TableHeader
				adjustForCheckbox={false}
				displaySelectAll={false}
			>
				<TableRow>
					{props.columns.map(title => (
						<TableHeaderColumn key={title} style={{ textAlign: 'center' }}>{title}</TableHeaderColumn>
					))}
				</TableRow>
			</TableHeader>
			<TableBody
				displayRowCheckbox={false}
				style={{
					maxHeight: `${props.width}px`
				}}
			>
				{props.data.map((row, i) => (
					<TableRow
						key={`row${i}${JSON.stringify(row)}${props.columns}`} // eslint-disable-line react/no-array-index-key
						hoverable
					>
						{row.map((v, idx) => (
							<TableRowColumn key={`v${props.columns[idx]}${v}`} style={{ textAlign: 'center' }}>{v}</TableRowColumn>
						))}
					</TableRow>
				))}
			</TableBody>
		</TableView>
	</div>
)) || null);

Table.defaultProps = {
	width: trimPx(vars.moduleMaxWidth)
};

Table.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number.isRequired,
	columns: PropTypes.arrayOf(PropTypes.string).isRequired,
	data: PropTypes.array.isRequired,
	theme: PropTypes.string.isRequired,
};

export default Table;
