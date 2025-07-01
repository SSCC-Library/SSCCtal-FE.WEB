import React, { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import InputField from '@/components/input_field';
import Table from '@/components/table';
import './item.css';

const columnHelper = createColumnHelper();

function ItemPage() {
	const columns = useMemo(
		() => [
			columnHelper.accessor('itemName', {
				header: '물품명',
				meta: { style: { padding: '12px 28px', minWidth: 120, maxWidth: 250 } },
			}),
			columnHelper.accessor('type', {
				header: '유형',
				meta: { style: { padding: '12px 28px', minWidth: 0, maxWidth: 0 } },
			}),
			columnHelper.accessor('id', {
				header: '고유번호',
				meta: { style: { padding: '12px 28px', minWidth: 120, maxWidth: 250 } },
			}),
			columnHelper.accessor('hashtag', {
				header: '해시태그',
				meta: { style: { padding: '12px 28px', minWidth: 120, maxWidth: 200 } },
			}),
			columnHelper.accessor('major', {
				header: '학과',
				meta: { style: { padding: '12px 28px', minWidth: 60, maxWidth: 120 } },
			}),
			//추후 물품 관리 기능 추가
			// columnHelper.display({

			// 	id: 'manage',
			// 	header: '관리',
			// 	cell: (info) => <button>수정</button>,
			// }),
		],
		[]
	);

	const data = useMemo(
		() => [
			{
				itemName: '컴퓨팅 사고',
				type: '책',
				id: '1',
				hashtag: '파이썬',
				major: '컴퓨터학부',
			},
			{ itemName: '충전기', type: '물품', id: '2' },
		],
		[]
	);

	return (
		<div className="item-container">
			<InputField />
			<Table columns={columns} data={data} />;
		</div>
	);
}

export default ItemPage;
