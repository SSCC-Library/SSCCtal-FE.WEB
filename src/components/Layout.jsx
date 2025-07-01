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
