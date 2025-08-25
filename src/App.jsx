import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import ItemList from './pages/ItemList';
import Login from './pages/Login';
import RentalHistory from './pages/RentalHistory';
import Layout from './components/Layout';
import AdminRoutes from './AdminRoutes';

function App() {
	return (
		<Routes>
			<Route
				path="/"
				element={
					<Layout>
						<Main />
					</Layout>
				}
			/>
			<Route
				path="/itemlist"
				element={
					<Layout>
						<ItemList />
					</Layout>
				}
			/>
			<Route
				path="/login"
				element={
					<Layout>
						<Login />
					</Layout>
				}
			/>
			<Route
				path="/rentalhistory"
				element={
					<Layout>
						<RentalHistory />
					</Layout>
				}
			/>

			{/* 관리자 페이지 */}
			<Route path="/admin/*" element={<AdminRoutes />} />
		</Routes>
	);
}

export default App;
