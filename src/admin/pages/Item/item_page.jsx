/*
물품 관리 페이지 
- 서버 연동해 리스트/상세정보 불러옴
- 미구현: 물품 추가/수정
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
	const [input_text, set_input_text] = useState('');
	const [edit_modal, set_edit_modal] = useState({ open: false, item: null, mode: 'add' });
	const [selected_row, set_selected_row] = useState(null);

	const [data, set_data] = useState([]);
	const [error, set_error] = useState(null);

	const [detail_data, set_detail_data] = useState({});
	const [detail_error, set_detail_error] = useState(null);

	const [page, set_page] = useState(1);
	const [size, set_size] = useState(10);
	const [total, set_total] = useState(0);

	//컬럼 정의
	const columns = useMemo(
		() => [
			columnHelper.accessor('copy_id', {
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
		],
		[]
	);

	//검색용 필터 옵션 추출
	const column_options = columns
		.filter((col) => col.accessorKey) // accessor 컬럼만 골라냄
		.map((col) => ({
			value: col.accessorKey,
			label: typeof col.header === 'string' ? col.header : col.accessorKey,
		}));

	//물품 리스트 가져오기
	const fetch_items = async (page) => {
		set_error(null);
		try {
			const res = await get_item_list(page, search_type, search_text);
			if (res.success) {
				const parsed_data = (res.data || []).map((d) => ({
					copy_id: d.item_copy.copy_id,
					identifier_code: d.item_copy.identifier_code,
					copy_status: d.item_copy.copy_status,
					name: d.item.name,
					type: d.item.type,
					hashtag: d.item.hashtag,
				}));
				set_data(parsed_data);
				set_total(res.total || 0);
			} else {
				set_error('검색 결과 없음');
			}
		} catch (err) {
			set_error('물품 목록 불러오기 실패');
		}
	};

	//물품 상세 정보 가져오기
	const fetch_detail = async (copy_id) => {
		set_detail_error(null);
		try {
			const res = await get_item_detail(copy_id);
			if (res.success) {
				const d = res.data;
				const parsed_data = {
					// item_copy 정보
					copy_id: d.item_copy.copy_id,
					item_id: d.item_copy.item_id,
					identifier_code: d.item_copy.identifier_code,
					copy_status: d.item_copy.copy_status,
					create_date: d.item_copy.create_date,
					update_date: d.item_copy.update_date,
					delete_status: d.item_copy.delete_status,

					// item 정보
					name: d.item.name,
					type: d.item.type,
					publisher: d.item.publisher,
					publish_date: d.item.publish_date,
					hashtag: d.item.hashtag,
					image_url: d.item.image_url,
					total_count: d.item.total_count,
					available_count: d.item.available_count,
				};
				set_detail_data(parsed_data);
			} else {
				set_error('검색 결과 없음');
			}
		} catch (err) {
			set_detail_error('상세 정보 불러오기 실패');
		}
	};

	useEffect(() => {
		fetch_items(page);
	}, [search_type, search_text, page]);

	const handle_row_click = (row) => {
		set_selected_row(row);
		fetch_detail(row.copy_id);
	};

	const handle_search = () => {
		set_page(1);
		set_search_text(input_text);
	};

	const handle_edit = (item = {}) => {
		set_edit_modal({ open: true, item, mode: item && item.id ? 'edit' : 'add' });
	};
	const handle_cancel = () => set_edit_modal({ open: false, item: null, mode: 'add' });

	return (
		<div className="item-container">
			<div className="search-bar-outer">
				<Button onClick={() => handle_edit({})}>추가</Button>
				<SearchBar
					filter_options={column_options}
					search_type={search_type}
					set_search_type={set_search_type}
					search_text={input_text}
					set_search_text={set_input_text}
					on_search={handle_search}
				/>
			</div>

			{!error && (
				<Table
					columns={columns}
					data={data}
					page={page}
					total={total}
					onPageChange={set_page}
					onRowClick={handle_row_click}
				/>
			)}

			{/* 에러 메세지 */}
			{error && <div className="error-text">{error}</div>}

			{/* 추가/수정 모달 */}
			{edit_modal.open && (
				<AlertModal on_close={handle_cancel}>
					<div className="is-develop">개발 중입니다.</div>
				</AlertModal>
			)}
			{/* 상세 모달 */}
			{selected_row && (
				<AlertModal on_close={() => set_selected_row(null)}>
					{detail_error ? (
						<div className="error-text">{detail_error}</div>
					) : detail_data ? (
						<>
							<div className="item-modal-title">물품 상세 정보</div>
							<div className="item-modal-info">
								{Object.entries(detail_data).map(([key, value]) => (
									<div key={key} className="item-modal-row">
										<span className="item-key">{key}:</span>
										<span className="item-value">{value}</span>
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
}

export default ItemPage;
