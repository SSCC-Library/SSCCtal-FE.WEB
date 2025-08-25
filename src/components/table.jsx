/*
공통 테이블 컴포넌트
- columns: 테이블 컬럼 배열 (tanstack/react-table v8)
- data: 테이블 데이터 배열
- page, size, total: 현재 페이지, 페이지당 개수, 전체 데이터 개수
- onPageChange: 페이지 변경 시 호출
- onSizeChange: 페이지 사이즈 변경 시 호출
- onRowClick: 행 클릭 시 호출
*/

import React from 'react';
import {
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	flexRender,
} from '@tanstack/react-table';
import './table.css';

function Table({ columns, data, page, size, total, onPageChange, onSizeChange, onRowClick }) {
	const table = useReactTable({
		data,
		columns,
		pageCount: Math.ceil(total / 12),
		state: {
			pagination: {
				pageIndex: page - 1, // 1-base to 0-base
				pageSize: size,
			},
		},
		manualPagination: true, // 서버 페이징
		onPaginationChange: (updater) => {
			let next;
			if (typeof updater === 'function') {
				next = updater({
					pageIndex: page - 1,
					pageSize: size,
				});
			} else {
				next = updater;
			}
			if (next.pageIndex !== undefined && next.pageIndex !== page - 1)
				onPageChange(next.pageIndex + 1);
			if (next.pageSize !== undefined && next.pageSize !== size) onSizeChange(next.pageSize);
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<>
			{/* 테이블 렌더링 */}
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
			</div>
		</>
	);
}

export default Table;
