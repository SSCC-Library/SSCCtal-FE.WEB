import React, { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import InputField from '@/components/input_field';
import Table from '@/components/table';
import './rental.css';

const columnHelper = createColumnHelper();

function RentalPage() {
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

	const data = useMemo(
		() => [
			{
				number: '1',
				itemName: '컴퓨팅 사고',
				type: '책',
				user: '정영인',
				rentalDate: '2025.06.20',
				returnDate: '2025.07.01',
				returnState: '반납 완료',
			},
			{
				number: '2',
				itemName: '충전기',
				type: '물품',
				user: '원영진',
				rentalDate: '2025.06.20',
				returnDate: '-',
				returnState: '대여중',
			},
		],
		[]
	);

	return (
		<div className="rental-container">
			<InputField />
			<Table columns={columns} data={data} />;
		</div>
	);
}

export default RentalPage;
