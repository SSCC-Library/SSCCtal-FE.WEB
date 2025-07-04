/*
모달 컴포넌트
*/

import './alert_modal.css';

function AlertModal({ on_close, children, width = 400 }) {
	return (
		<div className="alert-backdrop" onClick={on_close}>
			<div
				className="alert-modal"
				style={{ minWidth: width, textAlign: 'left' }}
				onClick={(e) => e.stopPropagation()} // 바깥 클릭 닫기, 안쪽 클릭 방지
			>
				{children}
			</div>
		</div>
	);
}

export default AlertModal;
