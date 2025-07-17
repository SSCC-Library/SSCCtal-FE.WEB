/*
대여 기록 관련 API
- 대여 기록 조회
- 대여 기록 상세 조회
- 연체 기록 조회
- 연체 기록 상세 조회
- 강제 반납 처리
*/

import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BACKEND_TEST_URL;
const ADMIN_TOKEN = 'mock-admin-token';

const AUTH_HEADER = {
	headers: {
		Authorization: `Bearer ${ADMIN_TOKEN}`,
	},
};

//리스트 조회용 함수
const fetch_list = async ({
	endpoint,
	page = 1,
	size = 10,
	search_type = '',
	search_text = '',
}) => {
	try {
		const res = await axios.get(`${BASE_URL}/admin/${endpoint}`, {
			params: { page, size, search_type, search_text },
			...AUTH_HEADER,
		});
		return res.data;
	} catch (error) {
		console.error(`${endpoint} 리스트 조회 실패`, error);
		throw error;
	}
};

//상세정보 조회용 함수
const fetch_detail = async ({ endpoint, id }) => {
	try {
		const res = await axios.get(`${BASE_URL}/admin/${endpoint}/${id}`, AUTH_HEADER);
		return res.data;
	} catch (error) {
		console.error(`${endpoint} 상세 조회 실패`, error);
		throw error;
	}
};

//리스트 조회 (대여)
export const get_rental_list = (params = {}) => fetch_list({ endpoint: 'rentals', ...params });

//리스트 조회 (연체)
export const get_overdue_list = (params = {}) => fetch_list({ endpoint: 'overdues', ...params });

//상세정보 조회 (대여)
export const get_rental_detail = (copy_item_id) =>
	fetch_detail({ endpoint: 'rentals', id: copy_item_id });

//상세정보 조회 (연체)
export const get_overdue_detail = (rental_id) =>
	fetch_detail({ endpoint: 'overdues', id: rental_id });

//강제 반납 처리
export const force_return = async (rental_id) => {
	try {
		const res = await axios.post(`${BASE_URL}/admin/rentals/${rental_id}/return`, AUTH_HEADER);
		return res.data;
	} catch (error) {
		console.error('강제 반납 처리 실패', error);
		throw error;
	}
};
