/*
상단 네비게이션 바
- 주요 메뉴/로고/알림/관리자 영역 포함
*/

import React, { useCallback, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import AlertIcon from './alert_icon';
import './nav.css';

function Nav() {
	const menus = [
		{ to: '/admin/items', label: '물품 관리' },
		{ to: '/admin/rentals', label: '대여 기록' },
		{ to: '/admin/overdue', label: '연체 관리' },
		{ to: '/admin/users', label: '회원 관리' },
		{ to: '/admin/requests', label: '요청 사항 ' },
	];

	//추후 알림 메세지 등록
	const alerts = '';

	const navigate = useNavigate();
	const [open, set_open] = useState(false);

	const on_logout = useCallback(
		async (e) => {
			e.stopPropagation();

			const token = localStorage.getItem('token');

			try {
				await fetch('/api/v1/auth/logout', {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				});
			} catch (err) {
				console.error('로그아웃 API 호출 실패:', err);
			} finally {
				localStorage.removeItem('token');
				localStorage.removeItem('username');
				localStorage.removeItem('role');
				navigate('/');
			}
		},
		[navigate]
	);

	return (
		<div className="nav-container">
			<div className="header">
				<div className="logo">
					{/* 메인 페이지 이동용 로고 */}
					<Link to="/admin">
						<img src="/img/logo/logo.png" alt="logo" />
					</Link>
				</div>
				<div className="admin-box">
					<AlertIcon alerts={alerts} />
					<div className="admin" onClick={() => set_open((v) => !v)}>
						관리자 님
					</div>
					<div className={`admin-dropdown ${open ? 'open' : ''}`}>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								navigate('/');
							}}
						>
							유저 페이지로
						</button>
						<button onClick={on_logout}>로그아웃</button>
					</div>
				</div>
			</div>
			<div className="divider"></div>
			<ul className="gnb">
				{/* 주요 메뉴 */}
				{menus.map((menu) => {
					return (
						<li key={menu.to}>
							<NavLink
								to={menu.to}
								className={({ isActive }) =>
									isActive ? 'gnb-link active' : 'gnb-link'
								}
							>
								{menu.label}
							</NavLink>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

export default Nav;
