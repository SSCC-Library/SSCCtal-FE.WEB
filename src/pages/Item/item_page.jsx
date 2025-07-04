import React, { useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import SearchBar from '../../components/search_bar';
import Table from '@/components/table';
import AlertModal from '../../components/alert_modal';
import Button from '../../components/button';
import EditForm from '../../components/edif_form';
import './item.css';

const columnHelper = createColumnHelper();

function ItemPage() {
	const [search_type, set_search_type] = useState('');
	const [search_text, set_search_text] = useState('');
	const [edit_modal, set_edit_modal] = useState({ open: false, user: null });
	const [selected_row, set_selected_row] = useState(null);

	const handle_edit = (user) => set_edit_modal({ open: true, user });
	const handle_save = (form) => {
		// 저장 로직 (상태 갱신 or API 호출)
		set_edit_modal({ open: false, user: null });
	};
	const handle_cancel = () => set_edit_modal({ open: false, user: null });

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
			columnHelper.accessor('status', {
				header: '물품 상태',
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
			columnHelper.display({
				id: 'adjust',
				header: '관리',
				cell: (info) => (
					<button
						onClick={(e) => {
							e.stopPropagation();
							handle_edit(info.row.original);
						}}
					>
						수정
					</button>
				),
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
				itemName: '컴퓨팅 사고',
				type: '책',
				state: '정상',
				id: '1',
				hashtag: '파이썬',
			},
			{ itemName: '충전기', type: '물품', state: '정상', id: '2' },
		],
		[]
	);

	const handle_search = () => {
		// 추후 api 호출 작성
	};

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
			<Table columns={columns} data={data} onRowClick={set_selected_row} />
			{edit_modal.open && (
				<AlertModal on_close={handle_cancel}>
					<EditForm
						initial_data={edit_modal.user}
						fields={column_options}
						on_save={handle_save}
						on_cancel={handle_cancel}
					/>
				</AlertModal>
			)}
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

export default ItemPage;
