import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/itemlist.css';

function ItemList() {
  const [allItems, setAllItems] = useState([]);     // 전체 물품 목록
  const [items, setItems] = useState([]);            // 필터링된 물품 목록
  const [search, setSearch] = useState('');          // 검색어
  const [page, setPage] = useState(1);               // 페이지 번호
  const size = 12;                                   // 고정된 페이지 크기
  const token = localStorage.getItem('token');       // 로그인 후 저장된 토큰

  // 전체 물품 목록 불러오기
  const fetchItems = async () => {
    try {
      const res = await axios.get('/api/v1/items', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: { page: 1 } // 전체 리스트 불러오기 (페이지 필터링 제거 가능)
      });

      const loaded = res.data.items || [];
      setAllItems(loaded);
    } catch (err) {
      console.error('물품 목록 불러오기 실패:', err);
    }
  };

  // 검색어 변경 또는 전체 데이터 바뀔 때마다 필터링
  useEffect(() => {
    const s = search.trim().toLowerCase();

    const filtered = allItems.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(s);
      const tags = (item.hashtag || '').split(' ');
      const tagMatch = tags.some(tag => tag.toLowerCase().replace(/^#/, '').includes(s));
      return nameMatch || tagMatch;
    });

    setItems(filtered);
    setPage(1); // 검색하면 1페이지로 초기화
  }, [search, allItems]);

  // 마운트 시 최초 한 번 전체 목록 불러오기
  useEffect(() => {
    fetchItems();
  }, []);

  const totalPages = Math.ceil(items.length / size);
  const startIndex = (page - 1) * size;
  const pageItems = items.slice(startIndex, startIndex + size);

  return (
    <div className="container">
      <div className="list-wrapper">
        {/* 검색창 */}
        <div className="search-box">
          <input
            type="text"
            placeholder="물품명 또는 해시태그를 입력하세요."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 물품 목록 */}
        <div className="item-container">
          {pageItems.length > 0 ? (
            pageItems.map((item, index) => (
              <div
                className="item-card"
                key={index}
                onClick={() => {
                  console.log(item);
                  if (item.type === '책' && item.name) {
                    const query = encodeURIComponent(item.name);
                    window.open(`https://www.google.com/search?q=${query}`, '_blank');
                  }
                }}
                style={{ cursor: item.type === '책' ? 'pointer' : 'default' }}
              >
                <img
                  src={item.image_url || '/img/placeholder.png'}
                  alt={item.name}
                  className="item-img"
                />
                <div className="item-title">{item.name}</div>
                <div className="item-hashtags">
                  {(item.hashtag || '').split(' ').map((tag, i) => (
                    <span key={i} className="hashtag">{tag}</span>
                  ))}
                </div>
                <div className={`availability ${item.copy_status === '대출 가능' ? 'available' : 'unavailable'}`}>
                  {item.copy_status === '대출 가능' ? '🟢 대여 가능' : '🔴 대여 불가'}
                </div>
                <div className="item-counts">
                  <div>{item.available_count}/{item.total_count}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-result">검색 결과가 없습니다.</div>
          )}
        </div>

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
            <span className="page-info">{page} / {totalPages}</span>
            <button
              className="next-btn"
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              다음 &raquo;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemList;