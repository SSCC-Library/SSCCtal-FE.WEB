/*
전체 라우팅 담당, 각 페이지별 path와 컴포넌트 지정
*/

import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout';
import MainPage from '@/pages/Main/main_page';

function Main() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<MainPage />} />
			</Route>
		</Routes>
	);
}

export default Main;
