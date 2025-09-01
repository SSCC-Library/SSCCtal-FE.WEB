import { Routes, Route, Navigate } from 'react-router-dom';
import Main from './pages/Main';
import ItemList from './pages/ItemList';
import Login from './pages/Login';
import RentalHistory from './pages/RentalHistory';
import Layout from './components/Layout';
import AdminRoutes from './AdminRoutes';
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

function decodePayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(atob(base64));
    return json || {};
  } catch (_) {
    return {};
  }
}

const AuthContext = createContext();

function AuthProvider({ children }) {
	const [authToken, setAuthToken] = useState(() => localStorage.getItem('token'));
	const [role, setRole] = useState(() => {
	  const t = localStorage.getItem('token');
	  return t ? decodePayload(t)?.user_classification : undefined;
	});

	const login = (token) => {
	  try {
	    localStorage.setItem('token', token);
	  } catch (_) {}
	  setAuthToken(token);
	  const payload = decodePayload(token);
	  setRole(payload?.user_classification);
	  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	};

	const logout = () => {
		try {
			localStorage.removeItem('token');
			localStorage.removeItem('username');
			localStorage.removeItem('role');
		} catch (_) {}
		delete axios.defaults.headers.common['Authorization'];
		setRole(undefined);
		setAuthToken(null);
		// 라우터 훅을 여기서 못 쓰니 간단히 리다이렉트
		if (typeof window !== 'undefined') {
			window.location.replace('/login');
		}
	};

	React.useEffect(() => {
		// 401 인터셉터 등에서 호출할 수 있게 노출
		window.__appLogout = logout;
		return () => {
			if (window.__appLogout === logout) delete window.__appLogout;
		};
	}, []);

	React.useEffect(() => {
	  // 전역 axios 인터셉터: 인증 실패에서만 로그아웃 (OPTIONS, 무인증 요청, 타 도메인 제외)
	  const API_BASE = import.meta.env.VITE_BACKEND_URL;
	  const interceptorId = axios.interceptors.response.use(
	    (resp) => resp,
	    (err) => {
	      const status = err?.response?.status;
	      const detail = err?.response?.data?.detail;
	      const cfg = err?.config || {};
	      const method = (cfg.method || '').toUpperCase();
	      const hasAuthHeader = !!(cfg.headers && (cfg.headers.Authorization || cfg.headers.authorization));

	      // URL 정규화
	      let reqUrl = '';
	      try {
	        reqUrl = new URL(cfg.url, API_BASE || window.location.origin).href;
	      } catch { reqUrl = cfg.url || ''; }

	      // 1) OPTIONS(프리플라이트)는 무시
	      if (method === 'OPTIONS') return Promise.reject(err);

	      // 2) API_BASE로 향하는 요청이 아니면 무시
	      if (API_BASE && typeof reqUrl === 'string' && !reqUrl.startsWith(API_BASE)) {
	        return Promise.reject(err);
	      }

	      // 3) 인증 헤더가 없는 요청의 401은 무시 (예: 공개 리소스, 잘못된 엔드포인트 등)
	      if (!hasAuthHeader) return Promise.reject(err);

	      // 4) 진짜 인증 실패만 로그아웃
	      if (status === 401) {
	        logout();
	        return Promise.reject(err);
	      }
	      if ((status === 400 || status === 498) && typeof detail === 'string' && /invalid token/i.test(detail)) {
	        logout();
	      }
	      return Promise.reject(err);
	    }
	  );
	  return () => axios.interceptors.response.eject(interceptorId);
	}, [logout]);

	React.useEffect(() => {
	  if (authToken) {
	    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
	    const payload = decodePayload(authToken);
	    setRole(payload?.user_classification);
	  } else {
	    delete axios.defaults.headers.common['Authorization'];
	    setRole(undefined);
	  }
	}, [authToken]);

	React.useEffect(() => {
		// 모든 요청 직전에 최신 토큰을 주입해서 타이밍 레이스 방지
		const reqId = axios.interceptors.request.use((config) => {
			const t = authToken || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
			if (t) {
				config.headers = config.headers || {};
				config.headers.Authorization = `Bearer ${t}`;
			}
			return config;
		});
		return () => axios.interceptors.request.eject(reqId);
	}, [authToken]);

	return (
		<AuthContext.Provider value={{ authToken, role, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}

function ProtectedRoute({ children }) {
  const { authToken } = useAuth();
  const effectiveToken = authToken || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  if (!effectiveToken) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { authToken, role } = useAuth();
  const effectiveToken = authToken || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  const effectiveRole = role ?? (effectiveToken ? decodePayload(effectiveToken)?.user_classification : undefined);
  if (!effectiveToken) return <Navigate to="/login" replace />;
  if (effectiveRole !== 'STAFF') return <Navigate to="/" replace />;
  return children;
}

function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Layout>
								<Main />
							</Layout>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/itemlist"
					element={
						<ProtectedRoute>
							<Layout>
								<ItemList />
							</Layout>
						</ProtectedRoute>
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
						<ProtectedRoute>
							<Layout>
								<RentalHistory />
							</Layout>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/*"
					element={
						<AdminRoute>
							<AdminRoutes />
						</AdminRoute>
					}
				/>
			</Routes>
		</AuthProvider>
	);
}

export default App;
