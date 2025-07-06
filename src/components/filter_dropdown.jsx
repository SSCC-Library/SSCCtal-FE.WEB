import { useState, useRef, useEffect } from 'react';
import './filter_dropdown.css';

function FilterDropDown({ filter_options, value, onChange }) {
	const [open, set_open] = useState(false);
	const ref = useRef(null);
	const display_options = [...filter_options, { value: '', label: '없음' }];

	useEffect(() => {
		function handleClick(e) {
			if (ref.current && !ref.current.contains(e.target)) set_open(false);
		}
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	}, []);

	const selected_label = filter_options.find((opt) => opt.value === value)?.label || '필터 선택';
	return (
		<div className="dropdown-wrap" ref={ref} tabIndex={0}>
			<div className="dropdown-trigger" onClick={() => set_open((v) => !v)}>
				{selected_label}
				<span className="dropdown-arrow-icon">▼</span>
			</div>
			{open && (
				<div className="dropdown-menu">
					<div className="dropdown-arrow"></div>
					<div className="dropdown-grid">
						{display_options.map((opt) => (
							<div
								key={opt.value}
								className={`dropdown-option${value === opt.value ? ' selected' : ''}`}
								tabIndex={0}
								onClick={() => {
									onChange(opt.value);
									set_open(false);
								}}
							>
								{opt.label}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export default FilterDropDown;
