/*
알림/에러/상태 표시용 모달 컴포넌트
*/

import React, { useEffect, useRef } from 'react';
import './alert_modal.css';

function AlertModal({ on_close, children, width = 400, max_width = 600 }) {
	const modal_ref = useRef(null);

	useEffect(() => {
		const handle_key = (e) => {
			if (e.key === 'Escape') on_close();
		};
		window.addEventListener('keydown', handle_key);
		return () => window.removeEventListener('keydown', handle_key);
	}, [on_close]);

	useEffect(() => {
		// 모달 열릴 때 내부 포커스 (접근성: 키보드 유저 대비)
		modal_ref.current?.focus();
	}, []);

	return (
		<div className="alert-backdrop" onClick={on_close} tabIndex={-1}>
			<div
				className="alert-modal"
				style={{ minWidth: width, maxWidth: max_width }}
				onClick={(e) => e.stopPropagation()} // 바깥 클릭 닫기, 안쪽 클릭 방지
			>
				{children}
			</div>
		</div>
	);
}

export default AlertModal;
