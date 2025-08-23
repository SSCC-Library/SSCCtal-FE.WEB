import React, { useEffect, useState } from 'react';
import '../css/rentalhistory.css';

const RentalHistory = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) return;

    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users/items/rental-records?page=1&student_id=${studentId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setRecords(data.data);
        }
      })
      .catch(err => console.error('대여 기록 불러오기 실패', err));
  }, []);

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
              const itemReturnDate = rental?.item_return_date ?? '-';
              const overdue = rental?.overdue;
              const overdueClass = overdue > 0 ? 'overdue' : 'no-overdue';
              const overdueText =
                overdue > 0
                  ? `${overdue}일 연체 중`
                  : '없음';
              // key fallback for missing rental_id
              const key = rental?.rental_id ?? `no-id-${idx}`;
              return (
                <tr key={key}>
                  <td>{item.item_name}</td>
                  <td>{rentalStatus}</td>
                  <td>{borrowDate}</td>
                  <td
                    style={
                      overdue > 0
                        ? { color: 'red', fontWeight: 'bold' }
                        : undefined
                    }
                  >
                    {expectationReturnDate}
                  </td>
                  <td>{itemReturnDate}</td>
                  <td
                    className={overdueClass}
                    style={
                      overdue > 0
                        ? { color: 'red', fontWeight: 'bold' }
                        : undefined
                    }
                  >
                    {overdueText}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default RentalHistory;