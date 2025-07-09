/*
모달 컴포넌트
*/

import React, { useEffect } from 'react';
import './alert_modal.css';

function AlertModal({ on_close, children, width = 400, max_width = 600 }) {
	useEffect(() => {
		const handle_key = (e) => {
			if (e.key === 'Escape') on_close();
		};
		window.addEventListener('keydown', handle_key);
		return () => window.removeEventListener('keydown', handle_key);
	}, [on_close]);

	return (
		<div className="alert-backdrop" onClick={on_close} tabIndex={-1}>
			<div
				className="alert-modal"
				style={{ minWidth: width, maxWidth: max_width, textAlign: 'left' }}
				onClick={(e) => e.stopPropagation()} // 바깥 클릭 닫기, 안쪽 클릭 방지
			>
				{children}
			</div>
		</div>
	);
}

export default AlertModal;
