import React from 'react';
import './button.css';

function Button({ children, onClick, type = 'button', class_name = '', ...rest }) {
	return (
		<button type={type} className={`common-btn ${class_name}`} onClick={onClick} {...rest}>
			{children}
		</button>
	);
}

export default Button;
