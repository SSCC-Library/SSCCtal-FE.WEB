/*
전체 라우팅 담당, 각 페이지별 path와 컴포넌트 지정
*/

import { Routes, Route } from 'react-router-dom';
import TestPage from './test_page';
function Main() {
	return (
		<Routes>
			<Route path="/" element={<TestPage />} />
		</Routes>
	);
}

export default Main;
