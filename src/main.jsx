/*
전체 라우팅 담당, 각 페이지별 path와 컴포넌트 지정
*/

import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout';
import MainPage from '@/pages/Main/main_page';
import ItemPage from '@/pages/Item/item_page';
import RentalPage from '@/pages/Rental/rental_page';
import OverduePage from '@/pages/Overdue/overdue_page';
import UserPage from '@/pages/User/user_page';
import RequestPage from './pages/Request/request_page';
import '@/css/reset.css';

function Main() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<MainPage />} />
				<Route path="/items" element={<ItemPage />} />
				<Route path="/rentals" element={<RentalPage />} />
				<Route path="/overdue" element={<OverduePage />} />
				<Route path="/users" element={<UserPage />} />
				<Route path="/requests" element={<RequestPage />} />
			</Route>
		</Routes>
	);
}

export default Main;
