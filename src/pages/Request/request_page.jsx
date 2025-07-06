import React, { useMemo, useState, useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import Table from '@/components/table';
import Button from '../../components/button';
import './request.css';

const columnHelper = createColumnHelper();

function RequestPage() {
	const [requests, set_requests] = useState([]);
	const [loading, set_loading] = useState(true);

	// 요청 리스트 받아오기
	useEffect(() => {
		// TODO: 실제 API 붙이면 fetch로 대체
		setTimeout(() => {
			set_requests([
				{
					id: 'req-1',
					user_name: '권나현',
					content: '이메일 수정 요청',
					created_at: '2025-07-01',
					status: '대기',
				},
				{
					id: 'req-2',
					user_name: '김지성',
					content: '전화번호 변경 요청',
					created_at: '2025-07-02',
					status: '대기',
				},
			]);
			set_loading(false);
		}, 500);
	}, []);

	const columns = useMemo(
		() => [
			columnHelper.accessor('user_name', {
				header: '요청자',
				meta: { style: { padding: '8px 16px', minWidth: 80, maxWidth: 120 } },
			}),
			columnHelper.accessor('content', {
				header: '요청 내용',
				meta: { style: { padding: '8px 20px', minWidth: 120, maxWidth: 260 } },
			}),
			columnHelper.accessor('created_at', {
				header: '요청일',
				meta: { style: { padding: '8px 12px', minWidth: 80, maxWidth: 120 } },
			}),
			columnHelper.accessor('status', {
				header: '상태',
				meta: { style: { padding: '8px 10px', minWidth: 60, maxWidth: 80 } },
			}),
			columnHelper.display({
				id: 'manage',
				header: '관리',
				cell: (info) => (
					<div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
						<button>승인</button>
						<button>거절</button>
					</div>
				),
				meta: {
					style: { padding: '8px 6px', minWidth: 80, maxWidth: 100, textAlign: 'center' },
				},
			}),
		],
		[]
	);

	return (
		<div className="request-page-wrap">
			{loading ? (
				<div className="request-loading">로딩 중...</div>
			) : requests.length === 0 ? (
				<div className="request-empty">요청 사항이 없습니다.</div>
			) : (
				<Table columns={columns} data={requests} />
			)}
		</div>
	);
}

export default RequestPage;
