import React, { useEffect, useState } from 'react';
import '../css/rentalhistory.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const RentalHistory = () => {
	const [records, setRecords] = useState([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const REACT_APP_API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
	const navigate = useNavigate();
	const { authToken } = useAuth();

	useEffect(() => {
	  const size = 12;

	  // 토큰이 없으면 로그인 페이지로 보냄 (새로고침 등 초기 진입 시 보호)
	  if (!authToken) {
	    navigate('/login', { replace: true });
	    return;
	  }

	  let cancelled = false;

	  axios
	    .get(`${REACT_APP_API_BASE_URL}/api/v1/users/items/rental-records`, {
	      params: { page, size },
	      headers: { Authorization: `Bearer ${authToken}` }, // 안전하게 헤더 보장
	    })
	    .then((res) => {
	      if (cancelled) return;
	      const data = res?.data;
	      if (data?.success && data?.data) {
	        setRecords(data.data);
	        if (data.total !== undefined) setTotalPages(Math.ceil(data.total / size));
	      }
	    })
	    .catch((err) => {
	      if (cancelled) return;
	      const status = err?.response?.status;
	      const detail = err?.response?.data?.detail;
	      if (status === 401) {
	        // 만료 또는 유효하지 않은 토큰 → 전역 로그아웃 훅 호출
	        if (typeof window !== 'undefined' && typeof window.__appLogout === 'function') {
	          window.__appLogout(detail || '로그인이 만료되었습니다. 다시 로그인해주세요.');
	        } else {
	          navigate('/login', { replace: true });
	        }
	      } else if (status === 403) {
	        // 권한 없음: 사용자 페이지에서 403이면 로그인은 유지, 홈으로 보냄
	        alert(detail || '접근 권한이 없습니다.');
	        navigate('/', { replace: true });
	      } else {
	        console.error('대여 기록 불러오기 실패', err);
	      }
	    });

	  return () => {
	    cancelled = true;
	  };
	}, [authToken, page, REACT_APP_API_BASE_URL, navigate]);

	return (
		<div className="rental-wrapper">
			<main>
				<table className="rental-table">
					<thead>
						<tr>
							<th>대여 물품 명</th>
							<th>상태</th>
							<th className="hide-mobile">대여일</th>
							<th>반납 예정일</th>
							<th className="hide-mobile">반납일</th>
							<th>연체</th>
						</tr>
					</thead>
					<tbody>
						{records.map((item, idx) => {
							const rental = item.rental;
							const statusMap = {
								borrowed: '대여 중',
								returned: '반납',
								overdue: '연체 중',
							};
							const rentalStatusRaw = rental?.rental_status ?? '-';
							const rentalStatus = statusMap[rentalStatusRaw] ?? rentalStatusRaw;
							const borrowDate = rental?.item_borrow_date
								? rental.item_borrow_date.split('T')[0]
								: '-';
							const expectationReturnDate = rental?.expectation_return_date ?? '-';
							const itemReturnDate = rental?.item_return_date
								? rental.item_return_date.split('T')[0]
								: '-';
							const overdue = rental?.overdue;
							const overdueClass =
								rentalStatusRaw === 'overdue' ? 'overdue' : 'no-overdue';
							const overdueText =
								rentalStatusRaw === 'overdue' ? `${overdue}일 연체 중` : '-';
							// key fallback for missing rental_id
							const key = rental?.rental_id ?? `no-id-${idx}`;
							return (
								<tr key={key}>
									<td>{item.item_name}</td>
									<td
										className={
											rentalStatusRaw === 'overdue' ? 'status-overdue' : ''
										}
									>
										{rentalStatus}
									</td>
									<td className="hide-mobile">{borrowDate}</td>
									<td
										className={
											rentalStatusRaw === 'overdue'
												? 'status-overdue'
												: rentalStatusRaw === 'returned'
													? 'status-returned'
													: ''
										}
									>
										{expectationReturnDate}
									</td>
									<td className="hide-mobile">{itemReturnDate}</td>
									<td className={overdueClass}>{overdueText}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
				{/* 페이지네이션 */}
				{totalPages > 1 && (
					<div className="pagination-user">
						<button
							className="prev-btn-user"
							onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
							disabled={page === 1}
						>
							&laquo; 이전
						</button>
						{[...Array(totalPages)].map((_, i) => (
							<button
								key={i}
								className={i + 1 === page ? 'active' : ''}
								onClick={() => setPage(i + 1)}
							>
								{i + 1}
							</button>
						))}
						<button
							className="next-btn-user"
							onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
							disabled={page === totalPages}
						>
							다음 &raquo;
						</button>
					</div>
				)}
			</main>
		</div>
	);
};

export default RentalHistory;
