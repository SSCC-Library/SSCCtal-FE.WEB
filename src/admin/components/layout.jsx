/*
레이아웃 컴포넌트
- 전체 페이지 기본 구조 담당 (Nav + 페이지 내용)
- <Outlet />에 각 라우트별 페이지가 렌더됨
*/

import Nav from './nav';
import { Outlet } from 'react-router-dom';
import './layout.css';

function Layout() {
	return (
		<div className="layout-wrap">
			<Nav />
			<main className="main-container">
				<Outlet />
			</main>
		</div>
	);
}

export default Layout;
