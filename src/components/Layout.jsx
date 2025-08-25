// src/components/Layout.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../css/style.css';
import '../css/reset.css';

const Layout = ({ children }) => {
  const [userName, setUserName] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showContributors, setShowContributors] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('username');
    if (token && name) {
      setUserName(name);
    }
  }, []);

  return (
    <div>
      <div className="header">
        <div className="logo">
          <Link to="/"><img src="/img/logo/logo.png" alt="logo" /></Link>
        </div>
        <div className="login">
          {userName ? (
            <div
              className={`user-info-wrapper ${isDropdownOpen ? 'show' : ''}`}
              onClick={() => setDropdownOpen(prev => !prev)}
            >
              <span className="user-info">
                <img src="/img/login/user-icon.png" alt="user-icon" className="user-icon" />
                <strong>{userName}</strong>님
              </span>
              <div className="user-dropdown">
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    const token = localStorage.getItem('token');

                    try {
                      await fetch('/api/v1/auth/logout', {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json'
                        }
                      });
                    } catch (err) {
                      console.error('로그아웃 API 호출 실패:', err);
                    }

                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    setUserName(null);
                    setDropdownOpen(false);
                    window.location.href = '/';
                  }}
                >
                  로그아웃
                </button>
              </div>
            </div>
          ) : (
            <img
              src="/img/login/login.png"
              alt="login"
              style={{ cursor: 'pointer' }}
              onClick={() => window.location.replace('/login')}
            />
          )}
        </div>
      </div>
      <hr />
      <div className="gnb-user">
        <Link to="/">공지사항</Link>
        <Link
          to="/itemlist"
          onClick={() => {
            localStorage.removeItem('searchType');
            localStorage.removeItem('searchText');
            const input = document.getElementById('search-input');
            if (input) input.value = '';
          }}
        >
          물품 안내
        </Link>
        <span
          onClick={() => {
            const token = localStorage.getItem('token');
            if (token) {
              navigate('/rentalhistory');
            } else {
              navigate('/login');
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          마이 페이지
        </span>
      </div>
      <div className="content-user">
        {children}
      </div>
      <div className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <img src="/img/logo/simple-logo.png" alt="footer-logo" />
            <span>SSCC 물품 대여 시스템</span>
          </div>
          <div className="footer-text">
            Since 1983
          </div>
          <div
            className="footer-copy"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowContributors(true)}
          >
            © 2025. SSCC All rights reserved.
          </div>
        </div>
      </div>
      {showContributors && (
        <div
          className="modal-backdrop"
          onClick={() => setShowContributors(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title">Contributors</h2>
            <ul className="modal-list">
              <li>40기 AI융합학부 원영진</li>
              <li>40기 컴퓨터학부 정영인</li>
              <li>41기 AI융합학부 권나현</li>
              <li>41기 컴퓨터학부 송채원</li>
              <li>42기 컴퓨터학부 김지성</li>
            </ul>
            <button
              onClick={() => setShowContributors(false)}
              className="modal-close-button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;