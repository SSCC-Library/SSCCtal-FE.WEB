/*
회원 관리 페이지
- 회원 목록/검색/정보 수정/회원 추가 기능 제공
*/

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
	const [delete_modal, set_delete_modal] = useState({ open: false, student_id: null }); // 삭제 모달 추가
	const [modal_message, set_modal_message] = useState({ open: false, message: '', type: 'info' });

	const [data, set_data] = useState([]);
	const [error, set_error] = useState(null);
	const [form_error, set_form_error] = useState(null);

	const [page, set_page] = useState(1);
	const [size, set_size] = useState(10);
	const [total, set_total] = useState(0);

	//컬럼 정의
	const columns = useMemo(
		() => [
			columnHelper.accessor('name', {
				header: '이름',
				meta: {
					style: { padding: '8px 16px', minWidth: 80, maxWidth: 120 },
					required: true,
				},
			}),
			columnHelper.accessor('major', {
				header: '학과',
				meta: {
					style: { padding: '8px 16px', minWidth: 60, maxWidth: 120 },
					required: true,
				},
			}),
			columnHelper.accessor('student_id', {
				header: '학번',
				meta: {
					style: { padding: '8px 16px', minWidth: 120, maxWidth: 250 },
					required: true,
				},
			}),
			columnHelper.accessor('email', {
				header: '이메일',
				meta: {
					style: { padding: '8px 28px', minWidth: 120, maxWidth: 220 },
					required: true,
				},
			}),
			columnHelper.accessor('phone_number', {
				header: '전화번호',
				meta: {
					style: { padding: '8px 28px', minWidth: 120, maxWidth: 220 },
					required: true,
				},
			}),
			columnHelper.accessor('gender', {
				header: '성별',
				meta: {
					style: { padding: '8px 16px', minWidth: 40, maxWidth: 60 },
					required: true,
				},
			}),
			columnHelper.accessor('major2', {
				header: '복수전공',
				meta: {
					style: { padding: '8px 16px', minWidth: 60, maxWidth: 120 },
					required: false,
				},
			}),
			columnHelper.accessor('minor', {
				header: '부전공',
				meta: {
					style: { padding: '8px 16px', minWidth: 60, maxWidth: 120 },
					required: false,
				},
			}),
			columnHelper.accessor('user_classification', {
				header: '분류',
				meta: {
					style: { padding: '8px 16px', minWidth: 40, maxWidth: 60 },
					required: true,
				},
			}),
			columnHelper.accessor('user_status', {
				header: '학적',
				meta: {
					style: { padding: '8px 16px', minWidth: 40, maxWidth: 60 },
					required: true,
				},
			}),
			columnHelper.display({
				id: 'adjust',
				header: '관리',
				cell: (info) => (
					<div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
						<button onClick={() => handle_edit(info.row.original)}>수정</button>
						<button
							onClick={() =>
								set_delete_modal({
									open: true,
									student_id: info.row.original.student_id,
								})
							}
						>
							삭제
						</button>
					</div>
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
			...(col.meta || {}),
		}));

	//회원 리스트 가져오기
	const fetch_user = async (page, size) => {
		set_error(null);
		try {
			const res = await get_user_list(page, size, search_type, search_text);
			if (res.success) {
				set_data(res.items || []);
				set_total(res.total || 0);
			} else {
				set_error('검색 결과 없음');
			}
		} catch (err) {
			set_error('회원 목록 불러오기 실패');
		}
	};

	useEffect(() => {
		fetch_user(page, size);
	}, [search_type, search_text, page, size]);

	const handle_search = () => {
		set_page(1);
	};

	//저장(추가/수정)
	const handle_save = async (form) => {
		set_form_error(null);
		try {
			if (edit_modal.mode === 'add') {
				const res = await add_user(form);
				if (res.success) {
					set_modal_message({
						open: true,
						message: '회원 추가 성공',
						type: 'success',
					});
				} else {
					set_modal_message({
						open: true,
						message: '회원 추가 실패',
						type: 'error',
					});
				}
			} else {
				const res = await edit_user(edit_modal.item.student_id, form);
				if (res.success) {
					set_modal_message({
						open: true,
						message: '회원 수정 성공',
						type: 'success',
					});
				} else {
					set_modal_message({
						open: true,
						message: '회원 수정 실패',
						type: 'error',
					});
				}
			}
			set_edit_modal({ open: false, item: null, mode: 'add' });
			fetch_user(page, size); // 저장 후 목록 갱신
		} catch (err) {
			set_form_error('저장 실패');
		}
	};
	const handle_edit = (item = {}) => {
		set_edit_modal({ open: true, item, mode: item && item.student_id ? 'edit' : 'add' });
	};
	const handle_cancel = () => set_edit_modal({ open: false, item: null, mode: 'add' });

	const handle_delete = async () => {
		try {
			const res = await delete_user(delete_modal.student_id);
			if (res.success) {
				set_delete_modal({ open: false, student_id: null });
				set_modal_message({ open: true, message: '회원 삭제 완료', type: 'success' });
			} else {
				set_delete_modal({ open: false, student_id: null });
				set_modal_message({ open: true, message: '회원 삭제 실패', type: 'error' });
			}
			fetch_user(page, size);
		} catch (err) {
			set_delete_modal({ open: false, student_id: null });
			set_modal_message({ open: true, message: '회원 삭제 실패', type: 'error' });
		}
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
			{!error && (
				<Table
					columns={columns}
					data={data}
					page={page}
					size={size}
					total={total}
					onPageChange={set_page}
					onSizeChange={set_size}
				/>
			)}

			{/* 에러 메세지 */}
			{error && <div className="error-text">{error}</div>}

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

			{/* 삭제 확인 모달 */}
			{delete_modal.open && (
				<AlertModal on_close={() => set_delete_modal({ open: false, student_id: null })}>
					<div className="delete-title">삭제 하시겠습니까?</div>
					<div className="delete-wrap">
						<Button class_name="mini-button" onClick={handle_delete}>
							예
						</Button>
						<Button
							class_name="mini-button"
							onClick={() => set_delete_modal({ open: false, student_id: null })}
						>
							아니오
						</Button>
					</div>
				</AlertModal>
			)}

			{/* 수정/추가 모달 */}
			{edit_modal.open && (
				<AlertModal on_close={handle_cancel}>
					<EditForm
						initial_data={edit_modal.item}
						fields={column_options}
						on_save={handle_save}
						on_cancel={handle_cancel}
						form_error={form_error}
					/>
				</AlertModal>
			)}
		</div>
	);
}

export default UserPage;
