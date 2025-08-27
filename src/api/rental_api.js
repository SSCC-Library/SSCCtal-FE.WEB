/*
대여 기록 관련 API
- 대여 기록 조회
- 대여 기록 상세 조회
- 대여 상태 변경
*/

import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const ADMIN_TOKEN = localStorage.getItem('token');

const AUTH_HEADER = {
	headers: {
		Authorization: `Bearer ${ADMIN_TOKEN}`,
	},
};

//대여/연체 리스트 조회
export const get_rental_list = async (
	page = 1,
	search_type = '',
	search_text = '',
	rental_status
) => {
	try {
		const res = await axios.get(`${BASE_URL}/api/v1/admin/rentals`, {
			params: { page, search_type, search_text, rental_status },
			...AUTH_HEADER,
		});
		return res.data;
	} catch (error) {
		console.error('대여/연체 기록 리스트 조회 실패:', error);
		throw error;
	}
};

//대여 정보 상세 조회
export const get_rental_detail = async (rental_id) => {
	try {
		const res = await axios.get(`${BASE_URL}/api/v1/admin/rentals/${rental_id}`, AUTH_HEADER);
		return res.data;
	} catch (error) {
		console.error('대여 기록 상세 조회 실패:', error);
		throw error;
	}
};

//대여 상태 변경
export const edit_rental_status = async (rental_id, rental_status) => {
	try {
		const res = await axios.post(
			`${BASE_URL}/api/v1/admin/rentals/status/${rental_id}`,
			{
				rental_id: rental_id,
				rental_status: rental_status,
			},
			AUTH_HEADER
		);
		return res.data;
	} catch (error) {
		console.error('강제 반납 처리 실패', error);
		throw error;
	}
};
