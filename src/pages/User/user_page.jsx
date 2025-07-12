import React, { useMemo, useState, useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { get_user_list, add_user, edit_user } from '../../api/user_api';
import SearchBar from '../../components/search_bar';
import Table from '@/components/table';
import EditForm from '../../components/edif_form';
import AlertModal from '../../components/alert_modal';
import Button from '../../components/button';
import './user.css';

const columnHelper = createColumnHelper();

function UserPage() {
	const [search_type, set_search_type] = useState('');
	const [search_text, set_search_text] = useState('');
	const [edit_modal, set_edit_modal] = useState({ open: false, item: null, mode: 'add' });
	const [selected_row, set_selected_row] = useState(null);

	const [data, set_data] = useState([]);
	const [error, set_error] = useState(null);
	const [form_error, set_form_error] = useState(null);
	const [page, set_page] = useState(1);
	const [size, set_size] = useState(10);

	//회원 리스트 가져오기
	const fetch_user = async (page, size) => {
		set_error(null);
		try {
			const res = await get_user_list(page, size, search_type, search_text);
			set_data(res.items || []);
		} catch (err) {
			set_error('물품 목록 불러오기 실패');
		}
	};

	useEffect(() => {
		fetch_user(page, size);
	}, [search_type, search_text, page, size]);

	const handle_search = () => {
		set_page(1);
	};

	const handle_save = async (form) => {
		set_form_error(null);
		try {
			if (edit_modal.mode === 'add') {
				await add_user(form);
			} else {
				await edit_user(edit_modal.item.student_id, form);
			}
			set_edit_modal({ open: false, item: null, mode: 'add' });
			fetch_user(); // 저장 후 목록 갱신
		} catch (err) {
			set_form_error('저장 실패: ' + (err?.response?.data?.message || err?.message || ''));
		}
	};
	const handle_edit = (item = {}) => {
		set_edit_modal({ open: true, item, mode: item && item.student_id ? 'edit' : 'add' });
	};
	const handle_cancel = () => set_edit_modal({ open: false, item: null, mode: 'add' });
	const handle_row_click = (row) => {
		set_selected_row(row);
	};

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
			columnHelper.accessor('phone_number', {
				header: '전화번호',
				meta: { style: { padding: '8px 28px', minWidth: 120, maxWidth: 220 } },
			}),
			columnHelper.accessor('gender', {
				header: '성별',
				meta: { style: { padding: '8px 16px', minWidth: 40, maxWidth: 60 } },
			}),
			columnHelper.accessor('major2', {
				header: '복수전공',
				meta: { style: { padding: '8px 16px', minWidth: 60, maxWidth: 120 } },
			}),
			columnHelper.accessor('minor', {
				header: '부전공',
				meta: { style: { padding: '8px 16px', minWidth: 60, maxWidth: 120 } },
			}),
			columnHelper.accessor('user_classification', {
				header: '분류',
				meta: { style: { padding: '8px 16px', minWidth: 40, maxWidth: 60 } },
			}),
			columnHelper.accessor('user_status', {
				header: '학적',
				meta: { style: { padding: '8px 16px', minWidth: 40, maxWidth: 60 } },
			}),
			columnHelper.display({
				id: 'adjust',
				header: '관리',
				cell: (info) => (
					<div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
						<button onClick={() => handle_edit(info.row.original)}>수정</button>
						<button>삭제</button>
					</div>
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

	const mock_data = useMemo(
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
			<Table
				columns={columns}
				data={data}
				page={page}
				size={size}
				onPageChange={set_page}
				onSizeChange={set_size}
				onRowClick={handle_row_click}
			/>
			{edit_modal.open && (
				<AlertModal on_close={handle_cancel}>
					<EditForm
						initial_data={edit_modal.item}
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
