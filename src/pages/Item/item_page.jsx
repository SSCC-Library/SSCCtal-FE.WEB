import React, { useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import SearchBar from '../../components/search_bar';
import Table from '@/components/table';
import './item.css';

const columnHelper = createColumnHelper();

function ItemPage() {
	const [search_type, set_search_type] = useState(''); // 검색 기준(기본: 물품명)
	const [search_text, set_search_text] = useState(''); // 검색어

	const columns = useMemo(
		() => [
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
			columnHelper.accessor('id', {
				header: '고유번호',
				meta: { style: { padding: '8px 16px', minWidth: 120, maxWidth: 250 } },
			}),
			columnHelper.accessor('hashtag', {
				header: '해시태그',
				meta: { style: { padding: '8px 16px', minWidth: 120, maxWidth: 200 } },
			}),
			columnHelper.accessor('major', {
				header: '학과',
				meta: { style: { padding: '8px 16px', minWidth: 60, maxWidth: 120 } },
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

	const column_options = columns
		.filter((col) => col.accessorKey) // accessor 컬럼만 골라냄
		.map((col) => ({
			value: col.accessorKey,
			label: typeof col.header === 'string' ? col.header : col.accessorKey,
		}));

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

	const handle_search = () => {
		// 추후 api 호출 작성
	};

	return (
		<div className="item-container">
			<div className="search-bar-outer">
				<SearchBar
					filter_options={column_options}
					search_type={search_type}
					set_search_type={set_search_type}
					search_text={search_text}
					set_search_text={set_search_text}
					on_search={handle_search}
				/>
			</div>
			<Table columns={columns} data={data} />;
		</div>
	);
}

export default ItemPage;
