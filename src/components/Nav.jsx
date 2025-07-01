import React from 'react';
import { Link } from 'react-router-dom';
import './nav.css';

function Nav() {
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
				<li>
					<Link to="/items">물품 관리</Link>
				</li>
				<li>
					<Link to="/rentals">대여 기록</Link>
				</li>
				<li>
					<Link to="/overdue">연체 관리</Link>
				</li>
				<li>
					<Link to="/users">회원 관리</Link>
				</li>
			</ul>
		</div>
	);
}

export default Nav;
