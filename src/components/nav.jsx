import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import AlertIcon from './alert_icon';
import './nav.css';

function Nav() {
	const location = useLocation();
	const current = location.pathname;

	const menus = [
		{ to: '/items', label: '물품 관리' },
		{ to: '/rentals', label: '대여 기록' },
		{ to: '/overdue', label: '연체 관리' },
		{ to: '/users', label: '회원 관리' },
		{ to: '/requests', label: '요청 사항 ' },
	];

	const alerts = [
		{
			message: '회원정보 수정 요청이 있습니다.',
			onClick: () => {
				/* 상세 페이지 이동 등 */
			},
		},
		{ message: '회원정보 수정 요청이 있습니다.' },
	];

	return (
		<div className="nav-container">
			<div className="header">
				<div className="logo">
					{/* 메인 페이지 이동용 로고 */}
					<Link to="/">
						<img src="src/assets/img/sscc_logo.png" alt="logo" />
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
