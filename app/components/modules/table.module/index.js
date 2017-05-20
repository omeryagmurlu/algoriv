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
import { themedStyle, themeVars } from 'app/utils';

import style from './style.scss';

const css = themedStyle(style);

const Table = props => (
	<div
		className={css('container', props.theme)}
	>
		<TableView
			// height={`${props.width}px`}
		>
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
						key={`row${i}${JSON.stringify(row)}`}
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
);

Table.propTypes = {
	width: PropTypes.number.isRequired,
	columns: PropTypes.arrayOf(PropTypes.string).isRequired,
	data: PropTypes.array.isRequired,
	theme: PropTypes.string.isRequired,
};

export default Table;
