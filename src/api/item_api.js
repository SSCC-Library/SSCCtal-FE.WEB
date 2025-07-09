/*
물품 관리 페이지 관련 API
*/

import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const get_item_list = async (page = 1, size = 10, search_type = '', search_text = '') => {
	try {
		const res = await axios.get(`${BASE_URL}/admin/items`, {
			params: { page, size, search_type, search_text },
		});
		return res.data;
	} catch (error) {
		console.error('물품 리스트 조회 실패:', error);
		throw error;
	}
};
export const get_item_detail = async (item_id) => {
	try {
		const res = await axios.get(`${BASE_URL}/admin/items/${item_id}`);
		return res.data;
	} catch (error) {
		console.error('물품 상세 조회 실패:', error);
		throw error;
	}
};
export const add_item = async (item_data) => {
	try {
		const res = await axios.post(`${BASE_URL}/admin/items`, item_data);
		return res.data;
	} catch (error) {
		console.error('물품 추가 실패:', error);
		throw error;
	}
};
export const edit_item = async (item_id, item_data) => {
	try {
		const res = await axios.patch(`${BASE_URL}/admin/items/${item_id}`, item_data);
		return res.data;
	} catch (error) {
		console.error('물품 수정 실패:', error);
		throw error;
	}
};
