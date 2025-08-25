/*
검색 입력 컴포넌트
*/

import './input_field.css';

function InputField({ type, value, onChange, placeholder, onSearch }) {
	return (
		<div className="input-container">
			<input
				type={type}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				className="input-field"
				onKeyDown={(e) => {
					if (e.key === 'Enter') onSearch();
				}}
			/>
			<button className="search-btn" type="button" onClick={onSearch}>
				&#8981;
			</button>
		</div>
	);
}

export default InputField;
