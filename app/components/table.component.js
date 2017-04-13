import React from 'react';
import PropTypes from 'prop-types';
import TableView from 'rc-table';
// import 'rc-table/assets/index.css';

import { style } from '../styles/table.scss';

const Table = props => {
	return (
		<div className={style}>
			<TableView
				emptyText={''}
				style={{
					width: props.table.width
				}}
				columns={props.table.columns.map(obj => {
					obj.key = obj.dataIndex = obj.title;
					return obj;
				})}
				data={props.table.data.map((obj, i) => {
					obj.key = i;
					return obj;
				})}
			/>
		</div>
	);
};

Table.propTypes = {
	table: PropTypes.object.isRequired
};

// Table.defaultProps = {
// 	table: ''
// };

export default Table;
