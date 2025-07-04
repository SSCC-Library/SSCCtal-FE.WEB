import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './nav.css';

function Nav() {
	console.log('ih');
	const location = useLocation();
	const current = location.pathname;

	const menus = [
		{ to: '/items', label: '물품 관리' },
		{ to: '/rentals', label: '대여 기록' },
		{ to: '/overdue', label: '연체 관리' },
		{ to: '/users', label: '회원 관리' },
	];

	return (
		<div className="nav-container">
			<div className="header">
				<div className="logo">
					{/* 메인 페이지 이동용 로고 */}
					<Link to="/">
						<img src="src/assets/img/logo.png" alt="logo" />
					</Link>
					<div className="divider"></div>
					<div className="logo-text">
						<strong>SSCC</strong>
						<br />
						<span>물품 대여</span>
					</div>
				</div>
				<div className="admin">관리자 님</div>
			</div>
			<div className="divider2"></div>
			<ul className="gnb">
				{/* 주요 메뉴 */}
				{menus.map((menu) => {
					console.log('current:', current, 'menu:', menu.to);
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
