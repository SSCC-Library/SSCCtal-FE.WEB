/*
요청 사항 페이지
- 다음 버전에서 개발 예정
- 회원의 수정 요청을 승인/거절
*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../../components/alert_modal';
import Button from '../../components/button';

function RequestPage() {
	const [open, set_open] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		set_open(true);
	});

	const handle_close = () => {
		set_open(false);
		navigate('/admin'); // 메인으로 강제 이동
	};

	return (
		<>
			{open && (
				<AlertModal on_close={handle_close}>
					<div className="is-develop">개발 중입니다.</div>
					<Button
						class_name="mini-button"
						onClick={handle_close}
						style={{ margin: '2em auto 0 auto' }}
					>
						메인 페이지로
					</Button>
				</AlertModal>
			)}
		</>
	);
}

export default RequestPage;
