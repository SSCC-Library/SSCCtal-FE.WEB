/*
물품 관리 API
- 물품 리스트 조회
- 물품 상세 조회
*/

import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const ADMIN_TOKEN = 'mock-admin-token';

const AUTH_HEADER = {
	headers: {
		Authorization: `Bearer ${ADMIN_TOKEN}`,
	},
};

export const get_item_list = async (page = 1, size = 10, search_type = '', search_text = '') => {
	try {
		const res = await axios.get(`${BASE_URL}/api/v1/admin/items`, {
			params: { page, size, search_type, search_text },
			// ...AUTH_HEADER,
		});
		return res.data;
	} catch (error) {
		console.error('물품 리스트 조회 실패:', error);
		throw error;
	}
};
export const get_item_detail = async (copy_id) => {
	try {
		// const res = await axios.get(`${BASE_URL}/admin/items/${item_id}`, AUTH_HEADER);
		const res = await axios.get(`${BASE_URL}/api/v1/admin/items/${copy_id}`);
		return res.data;
	} catch (error) {
		console.error('물품 상세 조회 실패:', error);
		throw error;
	}
};
