import React, { useEffect, useState } from 'react';
import '../css/rentalhistory.css';

const RentalHistory = () => {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) return;

    const token = localStorage.getItem('token');
    const size = 12;
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/users/items/rental-records?page=${page}&size=${size}&student_id=${studentId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setRecords(data.data);
          if (data.total !== undefined) {
            setTotalPages(Math.ceil(data.total / size));
          }
        }
      })
      .catch(err => console.error('대여 기록 불러오기 실패', err));
  }, [page]);

  return (
    <div className="rental-wrapper">
      <main>
        <table className="rental-table">
          <thead>
            <tr>
              <th>대여 물품 명</th>
              <th>상태</th>
              <th>대여일</th>
              <th>반납 예정일</th>
              <th>반납일</th>
              <th>연체</th>
            </tr>
          </thead>
          <tbody>
            {records.map((item, idx) => {
              const rental = item.rental;
              const statusMap = {
                borrowed: '대여 중',
                returned: '반납',
                overdue: '연체 중'
              };
              const rentalStatusRaw = rental?.rental_status ?? '-';
              const rentalStatus = statusMap[rentalStatusRaw] ?? rentalStatusRaw;
              const borrowDate = rental?.item_borrow_date ? rental.item_borrow_date.split('T')[0] : '-';
              const expectationReturnDate = rental?.expectation_return_date ?? '-';
              const itemReturnDate = rental?.item_return_date ? rental.item_return_date.split('T')[0] : '-'
              const overdue = rental?.overdue;
              const overdueClass = rentalStatusRaw === 'overdue' ? 'overdue' : 'no-overdue';
              const overdueText =
                rentalStatusRaw === 'overdue'
                  ? `${overdue}일 연체 중`
                  : '-';
              // key fallback for missing rental_id
              const key = rental?.rental_id ?? `no-id-${idx}`;
              return (
                <tr key={key}>
                  <td>{item.item_name}</td>
                  <td className={rentalStatusRaw === 'overdue' ? 'status-overdue' : ''}>
                    {rentalStatus}
                  </td>
                  <td>{borrowDate}</td>
                  <td className={rentalStatusRaw === 'overdue' ? 'status-overdue' : rentalStatusRaw === 'returned' ? 'status-returned' : ''}>
                    {expectationReturnDate}
                  </td>
                  <td>{itemReturnDate}</td>
                  <td className={overdueClass}>
                    {overdueText}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="prev-btn"
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
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
              className="next-btn"
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
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