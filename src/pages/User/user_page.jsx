import React, { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import InputField from '@/components/input_field';
import Table from '@/components/table';
import './user.css';

const columnHelper = createColumnHelper();

function UserPage() {
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
			columnHelper.display({
				id: 'delete',
				header: '관리',
				cell: (info) => <button>삭제</button>,
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
				name: '권나현',
				major: 'AI융합학부',
				student_id: '11111111',
				email: '11111111@gmail.com',
			},
			{
				name: '김지성',
				major: '컴퓨터학부',
				student_id: '22222222',
				email: '22222222@gmail.com',
			},
			{
				name: '송채원',
				major: '컴퓨터학부',
				student_id: '33333333',
				email: '33333333@gmail.com',
			},
			{
				name: '원영진',
				major: 'AI융합학부',
				student_id: '44444444',
				email: '44444444@gmail.com',
			},
			{
				name: '정영인',
				major: '컴퓨터학부',
				student_id: '55555555',
				email: '55555555@gmail.com',
			},
		],
		[]
	);

	return (
		<div className="user-container">
			<InputField />
			<Table columns={columns} data={data} />;
		</div>
	);
}

export default UserPage;
