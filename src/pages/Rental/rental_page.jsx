/*
대여 기록 페이지
- 대여 목록/검색/상세 정보/강제 반납 기능 제공
*/

import React, { useMemo, useState, useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { get_rental_list, get_rental_detail, edit_rental_status } from '../../api/rental_api';
import SearchBar from '../../components/search_bar';
import Table from '@/components/table';
import AlertModal from '../../components/alert_modal';
import Button from '../../components/button';
import './rental.css';

const columnHelper = createColumnHelper();

function RentalPage() {
	const [search_type, set_search_type] = useState('');
	const [search_text, set_search_text] = useState('');
	const [selected_row, set_selected_row] = useState(null);
	const [modal_return, set_modal_return] = useState({ open: false, row: null });
	const [modal_message, set_modal_message] = useState({ open: false, message: '', type: 'info' });

	const [data, set_data] = useState([]);
	const [error, set_error] = useState(null);

	const [detail_data, set_detail_data] = useState([]);
	const [detail_error, set_detail_error] = useState(null);

	const [page, set_page] = useState(1);
	const [size, set_size] = useState(10);
	const [total, set_total] = useState(0);

	//컬럼 정의
	const columns = useMemo(
		() => [
			columnHelper.accessor('rental_id', {
				header: '순번',
				meta: {
					style: { padding: '8px 6px', minWidth: 40, maxWidth: 50, textAlign: 'center' },
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
			columnHelper.accessor('user_name', {
				header: '대여자',
				meta: { style: { padding: '8px 16px', minWidth: 80, maxWidth: 120 } },
			}),
			columnHelper.accessor('student_id', {
				header: '학번',
				meta: { style: { padding: '8px 16px', minWidth: 120, maxWidth: 250 } },
			}),
			columnHelper.accessor('item_borrow_date', {
				header: '대여 날짜',
				meta: { style: { padding: '8px 16px', minWidth: 100, maxWidth: 120 } },
			}),
			columnHelper.accessor('item_return_date', {
				header: '반납 날짜',
				meta: { style: { padding: '8px 16px', minWidth: 100, maxWidth: 120 } },
			}),
			columnHelper.accessor('rental_status', {
				header: '반납 상태',
				meta: { style: { padding: '8px 14px', minWidth: 80, maxWidth: 100 } },
			}),
			columnHelper.display({
				id: 'manage',
				header: '관리',
				cell: (info) => (
					<button
						onClick={(e) => {
							e.stopPropagation();
							set_modal_return({ open: true, row: info.row.original });
						}}
					>
						반납
					</button>
				),
				meta: {
					style: { padding: '8px 6px', minWidth: 60, maxWidth: 80, textAlign: 'center' },
				},
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

	//대여 기록 리스트 가져오기
	const fetch_rentals = async (page, size) => {
		set_error(null);
		try {
			const res = await get_rental_list(page, size, search_type, search_text);
			if (res.success) {
				set_data(res.items || []);
				set_total(res.total || 17);
			} else {
				set_error('검색 결과 없음');
			}
		} catch (err) {
			set_error('대여 기록 불러오기 실패');
		}
	};

	//대여 기록 상세 정보 가져오기
	const fetch_detail = async (rental_id) => {
		set_detail_error(null);
		try {
			const res = await get_rental_detail(rental_id);
			if (res.success) {
				set_detail_data(res);
			} else {
				set_error('검색 결과 없음');
			}
		} catch (err) {
			set_detail_error('상세 정보 불러오기');
		}
	};

	useEffect(() => {
		fetch_rentals(page, size);
	}, [search_type, search_text, page, size]);

	const handle_row_click = (row) => {
		set_selected_row(row);
		fetch_detail(row.rental_id);
	};

	const handle_search = () => {
		set_page(1);
	};

	//강제 반납 처리
	const handle_force_return = async (rental_id) => {
		try {
			await edit_rental_status(rental_id, 'returned');
			set_modal_return({ open: false, row: null });
			set_modal_message({
				open: true,
				message: '강제 반납 성공',
				type: 'success',
			});
		} catch (err) {
			set_modal_return({ open: false, row: null });
			set_modal_message({
				open: true,
				message: '강제 반납 실패',
				type: 'error',
			});
		}
	};

	return (
		<div className="rental-container">
			<div className="rental-search-bar-outer">
				<SearchBar
					filter_options={column_options}
					search_type={search_type}
					set_search_type={set_search_type}
					search_text={search_text}
					set_search_text={set_search_text}
					on_search={handle_search}
				/>
			</div>
			{!error && (
				<Table
					columns={columns}
					data={data}
					page={page}
					size={size}
					total={total}
					onPageChange={set_page}
					onSizeChange={set_size}
					onRowClick={handle_row_click}
				/>
			)}

			{/* 에러 메세지 */}
			{error && <div className="error-text">{error}</div>}

			{/* 강제 반납 모달 */}
			{modal_return.open && (
				<AlertModal on_close={() => set_modal_return({ open: false, row: null })}>
					<div className="force-title">반납 하시겠습니까? </div>
					<div className="force-wrap">
						<Button
							class_name="mini-button"
							onClick={() => handle_force_return(modal_return.row.rental_id)}
						>
							예
						</Button>
						<Button
							class_name="mini-button"
							onClick={() => set_modal_return({ open: false, row: null })}
						>
							아니오
						</Button>
					</div>
				</AlertModal>
			)}

			{/* 성공/실패 메시지 모달 */}
			{modal_message.open && (
				<AlertModal
					on_close={() => set_modal_message({ open: false, message: '', type: '' })}
				>
					<div
						className={modal_message.type === 'success' ? 'success-text' : 'error-text'}
					>
						{modal_message.message}
					</div>
					<Button
						class_name="mini-button"
						onClick={() => set_modal_message({ open: false, message: '', type: '' })}
						style={{ margin: '1.5em auto 0 auto', display: 'block' }}
					>
						확인
					</Button>
				</AlertModal>
			)}

			{/* 상세 모달 */}
			{selected_row && (
				<AlertModal on_close={() => set_selected_row(null)}>
					{detail_error ? (
						<div className="error-text">{detail_error}</div>
					) : detail_data ? (
						<>
							<div className="rental-modal-title">대여 상세 정보</div>
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
}

export default RentalPage;
