import React, { useMemo, useState, useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { get_rental_list, get_rental_detail } from '../../api/rental_api';
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

	const [data, set_data] = useState([]);
	const [loading, set_loading] = useState(false);
	const [error, set_error] = useState(null);

	const [detail_data, set_detail_data] = useState([]);
	const [detail_loading, set_detail_loading] = useState(false);
	const [detail_error, set_detail_error] = useState(null);

	const [page, set_page] = useState(1);
	const [size, set_size] = useState(10);

	//대여 기록 리스트 가져오기
	const fetch_rentals = async (page, size) => {
		set_loading(true);
		set_error(null);
		try {
			const res = await get_rental_list(page, size, search_type, search_text);
			set_data(res.items || []);
		} catch (err) {
			set_error('대여 기록 불러오기 실패');
		}
		set_loading(false);
	};

	//대여 기록 상세 정보 가져오기
	const fetch_detail = async (rental_id) => {
		set_detail_loading(true);
		set_detail_error(null);
		try {
			const res = await get_rental_detail(rental_id);
			set_detail_data(res);
		} catch (err) {
			set_detail_error('상세 정보 불러오기 실패');
		}
		set_detail_loading(false);
	};

	useEffect(() => {
		fetch_rentals();
	}, [search_type, search_text, page, size]);

	const handle_row_click = (row) => {
		set_selected_row(row);
		fetch_detail(row.rental_id);
	};

	const handle_search = () => {
		set_page(1);
	};
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
				cell: (info) => <button>수정</button>,
				meta: {
					style: { padding: '8px 6px', minWidth: 60, maxWidth: 80, textAlign: 'center' },
				},
			}),
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
				number: '1',
				itemName: '컴퓨팅 사고',
				type: '책',
				user: '정영인',
				student_id: '12345678',
				rentalDate: '2025.06.20',
				returnDate: '2025.07.01',
				returnState: '반납 완료',
			},
			{
				number: '2',
				itemName: '충전기',
				type: '물품',
				user: '원영진',
				student_id: '87654321',
				rentalDate: '2025.06.20',
				returnDate: '-',
				returnState: '대여중',
			},
		],
		[]
	);

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
			<Table
				columns={columns}
				data={data}
				page={page}
				size={size}
				onPageChange={set_page}
				onSizeChange={set_size}
				onRowClick={handle_row_click}
			/>
			{selected_row && (
				<AlertModal on_close={() => set_selected_row(null)}>
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
				</AlertModal>
			)}
		</div>
	);
}

export default RentalPage;
