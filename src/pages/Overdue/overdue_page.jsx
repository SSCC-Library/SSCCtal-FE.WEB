import React, { useMemo, useState, useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import SearchBar from '../../components/search_bar';
import Table from '@/components/table';
import AlertModal from '../../components/alert_modal';
import Button from '../../components/button';
import './overdue.css';

const columnHelper = createColumnHelper();

function OverduePage() {
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

	//연체 기록 리스트 가져오기
	const fetch_overdue = async (page, size) => {
		set_loading(true);
		set_error(null);
		try {
			const res = await get_overdue_list(page, size, search_type, search_text);
			set_data(res.items || []);
		} catch (err) {
			set_error('연체 기록 불러오기 실패');
		}
		set_loading(false);
	};

	//연체 기록 상세 정보 가져오기
	const fetch_detail = async (rental_id) => {
		set_detail_loading(true);
		set_detail_error(null);
		try {
			const res = await get_overdue_detail(rental_id);
			set_detail_data(res);
		} catch (err) {
			set_detail_error('연체 정보 불러오기 실패');
		}
		set_detail_loading(false);
	};

	useEffect(() => {
		fetch_overdue();
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
			columnHelper.accessor('overdue', {
				header: '연체일',
				// cell: (info) => (
				// 	<span className={info.getValue() === '대여중' ? 'state-rent' : 'state-return'}>
				// 		{info.getValue()}
				// 	</span>
				// ),
				meta: { style: { padding: '8px 10px', minWidth: 60, maxWidth: 80 } },
			}),
			columnHelper.display({
				id: 'manage',
				header: '관리',
				cell: (info) => <button>반납</button>,
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
				itemName: '우산',
				type: '물품',
				user: '원영진',
				student_id: '12345678',
				rentalDate: '2025.06.20',
				overdueDate: '122',
			},
		],
		[]
	);

	return (
		<div className="overdue-container">
			<div className="overdue-search-bar-outer">
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
					<div className="overdue-modal-title">연체 상세 정보</div>
					<div className="overude-modal-info">
						{Object.entries(detail_data).map(([key, value]) => (
							<div key={key} className="overdue-modal-row">
								<span className="overdue-key">{key}:</span>
								<span className="overdue-value">{value}</span>
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

export default OverduePage;
