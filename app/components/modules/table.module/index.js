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
// <TableView
// 	emptyText={''}
// 	style={{
// 		width: props.width
// 	}}
// 	columns={props.columns.map(obj => {
// 		obj.key = obj.dataIndex = obj.title;
// 		return obj;
// 	})}
// 	data={props.data.map((obj, i) => {
// 		obj.key = i;
// 		return obj;
// 	})}
// />

Table.propTypes = {
	width: PropTypes.number.isRequired,
	columns: PropTypes.arrayOf(PropTypes.string).isRequired,
	data: PropTypes.array.isRequired,
	theme: PropTypes.string.isRequired,
};

// Table.defaultProps = {
// 	data: ''
// };

export default Table;