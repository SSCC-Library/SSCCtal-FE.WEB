/*
회원 관리 페이지 관련 API
*/

import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BACKEND_TEST_URL;
const ADMIN_TOKEN = 'mock-admin-token';

// const AUTH_HEADER = {
// 	headers: {
// 		Authorization: `Bearer ${ADMIN_TOKEN}`,
// 	},
// };

export const get_user_list = async (page = 1, size = 10, search_type = '', search_text = '') => {
	try {
		const res = await axios.get(`${BASE_URL}/admin/users`, {
			params: { page, size, search_type, search_text },
			// ...AUTH_HEADER,
		});
		return res.data;
	} catch (error) {
		console.error('회원 리스트 조회 실패:', error);
		throw error;
	}
};

export const get_user_detail = async (student_id) => {
	try {
		const res = await axios.get(`${BASE_URL}/admin/users/${student_id}`);
		return res.data;
	} catch (error) {
		console.error('회원 상세 조회 실패:', error);
		throw error;
	}
};

export const add_user = async (user_data) => {
	try {
		const res = await axios.post(`${BASE_URL}/admin/users`, user_data);
		return res.data;
	} catch (error) {
		console.error('회원 추가 실패:', error);
		throw error;
	}
};

export const edit_user = async (student_id, user_data) => {
	try {
		const res = await axios.post(`${BASE_URL}/admin/users/${student_id}`, user_data);
		return res.data;
	} catch (error) {
		console.error('회원 정보 수정 실패:', error);
		throw error;
	}
};
