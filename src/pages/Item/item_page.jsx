/*
추후 추가 기능
- 물품 상태 enum으로 선택
- 물품 추가
- 물품 상태 수정
*/

import React, { useMemo, useState, useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { get_item_list, get_item_detail } from '../../api/item_api';
import SearchBar from '../../components/search_bar';
import Table from '@/components/table';
import AlertModal from '../../components/alert_modal';
import Button from '../../components/button';
import './item.css';

const columnHelper = createColumnHelper();

function ItemPage() {
	const [search_type, set_search_type] = useState('');
	const [search_text, set_search_text] = useState('');
	const [edit_modal, set_edit_modal] = useState({ open: false, item: null, mode: 'add' });
	const [selected_row, set_selected_row] = useState(null);

	const [data, set_data] = useState([]);
	const [loading, set_loading] = useState(false);
	const [error, set_error] = useState(null);

	const [detail_data, set_detail_data] = useState([]);
	const [detail_loading, set_detail_loading] = useState(false);
	const [detail_error, set_detail_error] = useState(null);

	const [page, set_page] = useState(1);
	const [size, set_size] = useState(10);

	//물품 리스트 가져오기
	const fetch_items = async (page, size) => {
		set_loading(true);
		set_error(null);
		try {
			const res = await get_item_list(page, size, search_type, search_text);
			set_data(res.items || []);
		} catch (err) {
			set_error('물품 목록 불러오기 실패');
		}
		set_loading(false);
	};

	//물품 상세 정보 가져오기
	const fetch_detail = async (item_id) => {
		set_detail_loading(true);
		set_detail_error(null);
		try {
			const res = await get_item_detail(item_id);
			set_detail_data(res);
		} catch (err) {
			set_detail_error('상세 정보 불러오기 실패');
		}
		set_detail_loading(false);
	};

	useEffect(() => {
		fetch_items();
	}, [search_type, search_text, page, size]);

	const handle_row_click = (row) => {
		set_selected_row(row);
		fetch_detail(row.item_id);
	};

	const handle_search = () => {
		set_page(1);
		fetch_items();
	};

	const handle_edit = (item = {}) => {
		set_edit_modal({ open: true, item, mode: item && item.id ? 'edit' : 'add' });
	};
	const handle_cancel = () => set_edit_modal({ open: false, item: null, mode: 'add' });

	//추후 개발 예정
	// const handle_save = async (form) => {
	// 	set_form_loading(true);
	// 	set_form_error(null);
	// 	try {
	// 		if (edit_modal.mode === 'add') {
	// 			await add_item(form);
	// 		} else {
	// 			await edit_item(edit_modal.item.id, form);
	// 		}
	// 		set_edit_modal({ open: false, item: null, mode: 'add' });
	// 		fetch_items(); // 저장 후 목록 갱신
	// 	} catch (err) {
	// 		set_form_error('저장 실패: ' + (err?.response?.data?.message || err?.message || ''));
	// 	}
	// 	set_form_loading(false);
	// };

	const columns = useMemo(
		() => [
			columnHelper.accessor('item_id', {
				header: '물품 번호',
				meta: {
					style: { padding: '8px 10px', minWidth: 60, maxWidth: 80, textAlign: 'center' },
				},
			}),
			columnHelper.accessor('name', {
				header: '물품명',
				meta: { style: { padding: '8px 28px', minWidth: 120, maxWidth: 220 } },
			}),
			columnHelper.accessor('type', {
				header: '유형',
				meta: {
					style: { padding: '8px 10px', minWidth: 60, maxWidth: 80, textAlign: 'center' },
				},
			}),
			columnHelper.accessor('copy_status', {
				header: '물품 상태',
				meta: {
					style: { padding: '8px 10px', minWidth: 60, maxWidth: 80, textAlign: 'center' },
				},
			}),
			columnHelper.accessor('identifier_code', {
				header: '고유번호',
				meta: { style: { padding: '8px 16px', minWidth: 120, maxWidth: 250 } },
			}),
			columnHelper.accessor('hashtag', {
				header: '해시태그',
				meta: { style: { padding: '8px 16px', minWidth: 120, maxWidth: 200 } },
			}),
			//추후 개발 예정
			// columnHelper.display({
			// 	id: 'adjust',
			// 	header: '관리',
			// 	cell: (info) => (
			// 		<button
			// 			onClick={(e) => {
			// 				e.stopPropagation();
			// 				handle_edit(info.row.original);
			// 			}}
			// 		>
			// 			수정
			// 		</button>
			// 	),
			// 	meta: {
			// 		style: { padding: '8px 6px', minWidth: 60, maxWidth: 80, textAlign: 'center' },
			// 	},
			// }),
		],
		[]
	);

	const column_options = columns
		.filter((col) => col.accessorKey) // accessor 컬럼만 골라냄
		.map((col) => ({
			value: col.accessorKey,
			label: typeof col.header === 'string' ? col.header : col.accessorKey,
		}));

	const mock_data = useMemo(
		() => [
			{
				name: '컴퓨팅 사고',
				type: '책',
				copy_status: '정상',
				identifier_code: '1',
				hashtag: '파이썬',
			},
			{ name: '충전기', type: '물품', copy_status: '정상', identifier_code: '2' },
		],
		[]
	);

	return (
		<div className="item-container">
			<div className="search-bar-outer">
				<Button onClick={() => handle_edit({})}>추가</Button>
				<SearchBar
					filter_options={column_options}
					search_type={search_type}
					set_search_type={set_search_type}
					search_text={search_text}
					set_search_text={set_search_text}
					on_search={handle_search}
				/>
			</div>
			{loading ? (
				<div>로딩중...</div>
			) : error ? (
				<div className="error-text">{error}</div>
			) : (
				<Table
					columns={columns}
					data={data}
					page={page}
					size={size}
					onPageChange={set_page}
					onSizeChange={set_size}
					onRowClick={handle_row_click}
				/>
			)}
			{/* 추가/수정 모달 */}
			{edit_modal.open && (
				<AlertModal on_close={handle_cancel}>
					<div className="todo"></div>
					{/* <EditForm
						initial_data={edit_modal.item}
						fields={column_options}
						on_save={handle_save}
						on_cancel={handle_cancel}
						loading={form_loading}
						error={form_error}
					/> */}
				</AlertModal>
			)}
			{/* 상세 모달 */}
			{selected_row && (
				<AlertModal on_close={() => set_selected_row(null)}>
					{detail_loading ? (
						<div>상세 정보 로딩중...</div>
					) : detail_error ? (
						<div className="error-text">{detail_error}</div>
					) : detail_data ? (
						<>
							<div className="rental-modal-title">물품 상세 정보</div>
							<div className="rental-modal-info">
								{Object.entries(detail_data).map(([key, value]) => (
									<div key={key} className="rental-modal-row">
										<span className="rental-key">{key}:</span>
										<span className="rental-value">{value}</span>
									</div>
								))}
							</div>
							<Button
								onClick={() => set_selected_row(null)}
								class_name="mini-button"
								style={{ marginTop: '1.5em' }}
							>
								닫기
							</Button>
						</>
					) : null}
				</AlertModal>
			)}
		</div>
	);

	// return (
	// 	<div className="item-container">
	// 		<div className="search-bar-outer">
	// 			<Button onClick={() => handle_edit({})}>추가</Button>
	// 			<SearchBar
	// 				filter_options={column_options}
	// 				search_type={search_type}
	// 				set_search_type={set_search_type}
	// 				search_text={search_text}
	// 				set_search_text={set_search_text}
	// 				on_search={handle_search}
	// 			/>
	// 		</div>
	// 		<Table columns={columns} data={mock_data} onRowClick={set_selected_row} />
	// 		{edit_modal.open && (
	// 			<AlertModal on_close={handle_cancel}>
	// 				<EditForm
	// 					initial_data={edit_modal.user}
	// 					fields={column_options}
	// 					on_save={handle_save}
	// 					on_cancel={handle_cancel}
	// 				/>
	// 			</AlertModal>
	// 		)}
	// 		{selected_row && (
	// 			<AlertModal on_close={() => set_selected_row(null)}>
	// 				<div className="rental-modal-title">대여 상세 정보</div>
	// 				<div className="rental-modal-info">
	// 					{Object.entries(selected_row).map(([key, value]) => (
	// 						<div key={key} className="rental-modal-row">
	// 							<span className="rental-key">{key}:</span>
	// 							<span className="rental-value">{value}</span>
	// 						</div>
	// 					))}
	// 				</div>
	// 				<Button
	// 					onClick={() => set_selected_row(null)}
	// 					class_name="mini-button"
	// 					style={{ marginTop: '1.5em' }}
	// 				>
	// 					닫기
	// 				</Button>
	// 			</AlertModal>
	// 		)}
	// 	</div>
	// );
}

export default ItemPage;
