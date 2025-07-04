import React from 'react';
import {
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	flexRender,
	createColumnHelper,
} from '@tanstack/react-table';
import './table.css';

const columHelper = createColumnHelper();

function Table({ columns, data, onRowClick }) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<>
			<table className="custom-table">
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id} onClick={() => onRowClick(row.original)}>
							{row.getVisibleCells().map((cell) => (
								<td
									key={cell.id}
									style={cell.column.columnDef.meta?.style}
									className={
										cell.column.id === 'status'
											? `status-cell ${cell.getValue()}`
											: ''
									}
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			{/* 페이지네이션 */}
			<div className="pagination">
				<button
					onClick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					{'<<'}
				</button>
				<button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
					{'<'}
				</button>
				<span>
					{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
				</span>
				<button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
					{'>'}
				</button>
				<button
					onClick={() => table.setPageIndex(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}
				>
					{'>>'}
				</button>
				{/* <select
					value={table.getState().pagination.pageSize}
					onChange={(e) => table.setPageSize(Number(e.target.value))}
				>
					{[10, 20, 30, 40, 50].map((size) => (
						<option key={size} value={size}>
							{size}개씩
						</option>
					))}
				</select> */}
			</div>
		</>
	);
}

export default Table;
