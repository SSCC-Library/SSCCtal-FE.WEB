import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/itemlist.css';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

function ItemList() {
  const [inputText, setInputText] = useState('');
  const [total, setTotal] =  useState(0);  
  const [items, setItems] = useState([]);            // 서버에서 받아온 물품 목록
  const [page, setPage] = useState(1);               // 페이지 번호
  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState('hashtag'); // 기본값 hashtag
  const location = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const size = 12;
  const token = localStorage.getItem('token');       // 로그인 후 저장된 토큰

  useEffect(() => {
    if (location.pathname === '/itemlist' && location.search === '') {
      setInputText('');
      setSearchText('');
      setPage(1);
      fetchItems(1, size, '', 'hashtag');
    }
  }, [location, size]);

  // 전체 물품 목록 불러오기
  const fetchItems = async (page = 1, size = 12, searchText = '', searchType = 'hashtag') => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/items/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          size,
          search_type: searchType,
          search_text: searchText,
        },
      });
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch (error) {
      console.error(error);
    }
  };

  // 페이지, 검색어, 검색타입, size가 바뀔 때마다 목록 불러오기
  useEffect(() => {
    fetchItems(page, size, searchText, searchType);
  }, [page, searchText, searchType, size]);

  const totalPages = Math.ceil(total / size);

  return (
    <div className="container">
      <div className="list-wrapper">
        {/* 검색창 */}
        <div className="search-bar-wrapper">
          <div className="search-combo">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="combo-dropdown"
            >
              <option value="name">물품명</option>
              <option value="hashtag">해시태그</option>
            </select>
            <input
              type="text"
              className="combo-input"
              placeholder="검색어를 입력하세요."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSearchText(inputText);
                  setPage(1);
                }
              }}
            />
          </div>
          <button
            onClick={() => {
              setSearchText(inputText);
              setPage(1);
            }}
            className="search-button"
          >
            검색
          </button>
        </div>
        {/* 물품 목록 */}
        <div className="item-container">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div
                className="item-card"
                key={index}
                onClick={() => {
                  if (item.type === 'book' && item.name) {
                    const query = encodeURIComponent(item.name);
                    window.open(`https://www.google.com/search?q=${query}`, '_blank');
                  }
                }}
              >
                <div className="item-card-content" style={{ display: isMobile ? 'flex' : 'block', alignItems: isMobile ? 'center' : 'initial' }}>
                  <img
                    src={item.image_url || '/img/placeholder.png'}
                    alt={item.name}
                    className="item-img"
                    style={{ width: isMobile ? '80px' : '', height: isMobile ? 'auto' : '', marginRight: isMobile ? '10px' : '' }}
                  />
                  <div className="item-info" style={{ flex: 1 }}>
                    <div className="item-title">{item.name}</div>
                    <div className="item-hashtags">
                      {(item.hashtag || '').split(' ').map((tag, i) => (
                        <span key={i} className="hashtag">{tag}</span>
                      ))}
                    </div>
                    <div className={`availability ${item.copy_status === 'available' ? 'available' : 'unavailable'}`}>
                      {item.copy_status === 'available' ? '🟢 대여 가능' : '🔴 대여 불가'}
                    </div>
                    <div className="item-counts">
                      <div>{item.available_count ?? item.item?.available_count}/{item.total_count ?? item.item?.total_count}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-result">{token ? "검색 결과가 없습니다." : "로그인이 필요합니다."}</div>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="prev-btn"
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
              className="next-btn"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
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
