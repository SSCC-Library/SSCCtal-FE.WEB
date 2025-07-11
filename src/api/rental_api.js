/*
대여 기록 페이지 관련 API
*/

import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BACKEND_TEST_URL;
const ADMIN_TOKEN = 'mock-admin-token';

// const AUTH_HEADER = {
// 	headers: {
// 		Authorization: `Bearer ${ADMIN_TOKEN}`,
// 	},
// };

export const get_rental_list = async (page = 1, size = 10, search_type = '', search_text = '') => {
	try {
		const res = await axios.get(`${BASE_URL}/admin/rentals`, {
			params: { page, size, search_type, search_text },
			// ...AUTH_HEADER,
		});
		return res.data;
	} catch (error) {
		console.error('대여 기록 리스트 조회 실패:', error);
		throw error;
	}
};
export const get_rental_detail = async (rental_id) => {
	try {
		const res = await axios.get(`${BASE_URL}/admin/rentals/${rental_id}`);
		return res.data;
	} catch (error) {
		console.error('대여 기록 상세 조회 실패:', error);
		throw error;
	}
};

export const get_overdue_list = async (page = 1, size = 10, search_type = '', search_text = '') => {
	try {
		const res = await axios.get(`${BASE_URL}/admin/overdues`, {
			params: { page, size, search_type, search_text },
			// ...AUTH_HEADER,
		});
		return res.data;
	} catch (error) {
		console.error('연체 기록 리스트 조회 실패:', error);
		throw error;
	}
};
export const get_overdue_detail = async (rental_id) => {
	try {
		const res = await axios.get(`${BASE_URL}/admin/overdues/${rental_id}`);
		return res.data;
	} catch (error) {
		console.error('연체 기록 상세 조회 실패:', error);
		throw error;
	}
};
export const force_return = async (rental_id) => {
	try {
		const res = await axios.post(`${BASE_URL}/admin/rentals/${rental_id}/return`);
		return res.data;
	} catch (error) {
		console.error('강제 반납 처리 실패:', error);
		throw error;
	}
};
