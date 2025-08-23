import React, { useEffect, useState } from 'react';
import '../css/rentalhistory.css';

const RentalHistory = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users/items/rental-records?page=1`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.items) {
          setRecords(data.items);
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
            {records.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.status}</td>
                <td>{item.item_borrow_date}</td>
                <td>{item.expectation_return_date || '-'}</td>
                <td>{item.item_return_date || '-'}</td>
                <td className={item.overdue > 0 ? 'overdue' : 'no-overdue'}>
                  {item.overdue > 0 ? `${item.overdue}일 연체 중` : '없음'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default RentalHistory;