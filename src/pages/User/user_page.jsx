import React, { useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import SearchBar from '../../components/search_bar';
import Table from '@/components/table';
import EditForm from '../../components/edif_form';
import AlertModal from '../../components/alert_modal';
import Button from '../../components/button';
import './user.css';

const columnHelper = createColumnHelper();

function UserPage() {
	const [search_type, set_search_type] = useState(''); // 검색 기준(기본: 물품명)
	const [search_text, set_search_text] = useState(''); // 검색어
	const [edit_modal, set_edit_modal] = useState({ open: false, user: null });

	const handle_edit = (user) => set_edit_modal({ open: true, user });
	const handle_save = (form) => {
		// 저장 로직 (상태 갱신 or API 호출)
		set_edit_modal({ open: false, user: null });
	};
	const handle_cancel = () => set_edit_modal({ open: false, user: null });

	const columns = useMemo(
		() => [
			columnHelper.accessor('name', {
				header: '이름',
				meta: { style: { padding: '8px 16px', minWidth: 80, maxWidth: 120 } },
			}),
			columnHelper.accessor('major', {
				header: '학과',
				meta: { style: { padding: '8px 16px', minWidth: 60, maxWidth: 120 } },
			}),
			columnHelper.accessor('student_id', {
				header: '학번',
				meta: { style: { padding: '8px 16px', minWidth: 120, maxWidth: 250 } },
			}),
			columnHelper.accessor('email', {
				header: '이메일',
				meta: { style: { padding: '8px 28px', minWidth: 120, maxWidth: 220 } },
			}),
			columnHelper.accessor('phone', {
				header: '전화번호',
				meta: { style: { padding: '8px 28px', minWidth: 120, maxWidth: 220 } },
			}),
			columnHelper.display({
				id: 'adjust',
				header: '관리',
				cell: (info) => (
					<button onClick={() => handle_edit(info.row.original)}>수정</button>
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
				name: '권나현',
				major: 'AI융합학부',
				student_id: '11111111',
				email: '11111111@gmail.com',
				phone: '010-1234-5678',
			},
			{
				name: '김지성',
				major: '컴퓨터학부',
				student_id: '22222222',
				email: '22222222@gmail.com',
				phone: '010-1234-5678',
			},
			{
				name: '송채원',
				major: '컴퓨터학부',
				student_id: '33333333',
				email: '33333333@gmail.com',
				phone: '010-1234-5678',
			},
			{
				name: '원영진',
				major: 'AI융합학부',
				student_id: '44444444',
				email: '44444444@gmail.com',
				phone: '010-1234-5678',
			},
			{
				name: '정영인',
				major: '컴퓨터학부',
				student_id: '55555555',
				email: '55555555@gmail.com',
				phone: '010-1234-5678',
			},
		],
		[]
	);

	const handle_search = () => {
		// 추후 api 호출 작성
	};

	return (
		<div className="user-container">
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
			<Table columns={columns} data={data} />

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
		</div>
	);
}

export default UserPage;
