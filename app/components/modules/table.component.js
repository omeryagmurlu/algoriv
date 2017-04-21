import React from 'react';
import PropTypes from 'prop-types';
import TableView from 'rc-table';
// import 'rc-table/assets/index.css';

import { style } from '../../styles/table.scss';

const Table = props => {
	return (
		<div className={style}>
			<TableView
				emptyText={''}
				style={{
					width: props.width
				}}
				columns={props.columns.map(obj => {
					obj.key = obj.dataIndex = obj.title;
					return obj;
				})}
				data={props.data.map((obj, i) => {
					obj.key = i;
					return obj;
				})}
			/>
		</div>
	);
};

Table.propTypes = {
	width: PropTypes.number.isRequired,
	columns: PropTypes.arrayOf(PropTypes.shape({
		title: PropTypes.string
	})).isRequired,
	data: PropTypes.array.isRequired
};

// Table.defaultProps = {
// 	data: ''
// };

export default Table;
