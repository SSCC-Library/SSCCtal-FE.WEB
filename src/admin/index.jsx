/*
ReactDOM에서 루트에 렌더링(앱 진입점)
전체 라우팅을 HashRouter(webOS 환경) + Main 컴포넌트로 분리
*/

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Main from './main';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Main />
		</BrowserRouter>
	</React.StrictMode>
);
