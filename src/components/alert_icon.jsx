import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './alert_icon.css';

function AlertIcon({ alerts = [] }) {
	const [open, set_open] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		function handleClick(e) {
			if (ref.current && !ref.current.contains(e.target)) set_open(false);
		}
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	}, []);

	const has_alert = alerts.length > 0;

	return (
		<div className="alert-icon-wrap" ref={ref}>
			<span
				className={`alert-icon${has_alert ? ' has-alert' : ''}`}
				onClick={() => set_open((v) => !v)}
				tabIndex={0}
			>
				<span role="img" aria-label="알림">
					🔔
				</span>
				{has_alert && <span className="alert-badge" />}
			</span>
			{open && (
				<div className="alert-dropdown">
					<div className="alert-dropdown-title">알림</div>
					{alerts.length === 0 ? (
						<div className="alert-dropdown-empty">새로운 요청 없음</div>
					) : (
						alerts.map((alert, i) => (
							<Link to="/requests" key={i}>
								<div className="alert-dropdown-item">{alert.message}</div>
							</Link>
						))
					)}
				</div>
			)}
		</div>
	);
}

export default AlertIcon;
