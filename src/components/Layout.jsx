// src/components/Layout.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../css/style.css';
import '../css/reset.css';
import { useAuth } from '../App';

const Layout = ({ children }) => {
	const [userName, setUserName] = useState(null);
	const [isDropdownOpen, setDropdownOpen] = useState(false);
	const [isModalOpen, setModalOpen] = useState(false);
	const navigate = useNavigate();
	const { authToken, role, logout } = useAuth();
	const isAdmin = role === 'STAFF' || localStorage.getItem('role') === 'STAFF';

	useEffect(() => {
		const name = localStorage.getItem('username');
		if (name) setUserName(name);
	}, []);

	return (
		<div>
			<div className="header-user">
				<div className="logo-user">
					<Link to="/">
						<img src="/img/logo/logo.png" alt="logo" />
					</Link>
				</div>
				<div className="login">
					{userName ? (
						<div
							className={`user-info-wrapper ${isDropdownOpen ? 'show' : ''}`}
							onClick={() => setDropdownOpen((prev) => !prev)}
						>
							<span className="user-info">
								<img
									src="/img/login/user-icon.png"
									alt="user-icon"
									className="user-icon"
								/>
								<strong>{userName}</strong>님
							</span>
							<div className="user-dropdown">
								{isAdmin && (
									<button
										onClick={(e) => {
											e.stopPropagation();
											navigate('/admin');
										}}
									>
										관리자 페이지로
									</button>
								)}
								<button
									onClick={(e) => {
										e.stopPropagation();
										setDropdownOpen(false);
										setUserName(null);
										logout();
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
							onClick={() => navigate('/login')}
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
						if (authToken || localStorage.getItem('token')) navigate('/rentalhistory')
						else navigate('/login');
					}}
					style={{ cursor: 'pointer' }}
				>
					마이 페이지
				</span>
			</div>
			<div className="content">{children}</div>
			<div className="footer">
				<div className="footer-inner">
					<div
						className="footer-logo"
						onClick={() => setModalOpen(true)}
						style={{ cursor: "pointer" }}
					>
						<img src="/img/logo/simple-logo.png" alt="footer-logo" />
						<span>SSCC 물품 대여 시스템</span>
					</div>
					<div className="footer-text">Soongsil Computing Club · Since 1983</div>
					<div className="footer-copy"> © 2025. SSCC All rights reserved. </div>
				</div>
				{isModalOpen && (
					<div className="modal-overlay" onClick={() => setModalOpen(false)}>
						<div className="modal" onClick={(e) => e.stopPropagation()}>
							<h2>Contributors</h2>
							<ul>
								<li>40기 AI융합학부 원영진</li>
								<li>40기 컴퓨터학부 정영인</li>
								<li>41기 AI융합학부 권나현</li>
								<li>41기 컴퓨터학부 송채원</li>
								<li>42기 컴퓨터학부 김지성</li>
							</ul>
							<button className="close-btn" onClick={() => setModalOpen(false)}>Close</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Layout;
