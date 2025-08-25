/*
상단 네비게이션 바
- 주요 메뉴/로고/알림/관리자 영역 포함
*/

import React from 'react';
import { Link, NavLink } from 'react-router-dom';
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

	return (
		<div className="nav-container">
			<div className="header">
				<div className="logo">
					{/* 메인 페이지 이동용 로고 */}
					<Link to="/admin">
						<img src="/img/sscc_logo.png" alt="logo" />
					</Link>
				</div>
				<div className="admin-box">
					<AlertIcon alerts={alerts} />
					<div className="admin">관리자 님</div>
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
