import React, { useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
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

	const columns = useMemo(
		() => [
			columnHelper.accessor('number', {
				header: '순번',
				meta: {
					style: { padding: '8px 6px', minWidth: 40, maxWidth: 50, textAlign: 'center' },
				},
			}),
			columnHelper.accessor('itemName', {
				header: '물품명',
				meta: { style: { padding: '8px 28px', minWidth: 120, maxWidth: 220 } },
			}),
			columnHelper.accessor('type', {
				header: '유형',
				meta: {
					style: { padding: '8px 10px', minWidth: 60, maxWidth: 80, textAlign: 'center' },
				},
			}),
			columnHelper.accessor('user', {
				header: '대여자',
				meta: { style: { padding: '8px 16px', minWidth: 80, maxWidth: 120 } },
			}),
			columnHelper.accessor('student_id', {
				header: '학번',
				meta: { style: { padding: '8px 16px', minWidth: 120, maxWidth: 250 } },
			}),
			columnHelper.accessor('rentalDate', {
				header: '대여 날짜',
				meta: { style: { padding: '8px 16px', minWidth: 100, maxWidth: 120 } },
			}),
			columnHelper.accessor('returnDate', {
				header: '반납 날짜',
				meta: { style: { padding: '8px 16px', minWidth: 100, maxWidth: 120 } },
			}),
			columnHelper.accessor('returnState', {
				header: '반납 상태',
				// cell: (info) => (
				// 	<span className={info.getValue() === '대여중' ? 'state-rent' : 'state-return'}>
				// 		{info.getValue()}
				// 	</span>
				// ),
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

	const data = useMemo(
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

	const handle_search = () => {
		// 추후 api 호출 작성
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
			<Table columns={columns} data={data} onRowClick={set_selected_row} />;
			{selected_row && (
				<AlertModal on_close={() => set_selected_row(null)}>
					<div className="rental-modal-title">대여 상세 정보</div>
					<div className="rental-modal-info">
						{Object.entries(selected_row).map(([key, value]) => (
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
