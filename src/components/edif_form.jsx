// components/edit_form.jsx
import React, { useState } from 'react';
import './edit_form.css';
import Button from './button';

function EditForm({ initial_data, fields, on_save, on_cancel }) {
	const [form, set_form] = useState(initial_data);

	const handle_change = (e) => {
		const { name, value } = e.target;
		set_form((prev) => ({ ...prev, [name]: value }));
	};

	const handle_submit = (e) => {
		e.preventDefault();
		on_save(form);
	};

	return (
		<form className="edit-form" onSubmit={handle_submit}>
			{fields.map((field) => (
				<label key={field.value} className="edit-form-label">
					{field.label}
					<input
						name={field.value}
						type="text"
						value={form[field.value] ?? ''}
						onChange={handle_change}
						className="edit-form-input"
						autoComplete="off"
					/>
				</label>
			))}
			<div className="edit-form-btns">
				<Button type="submit" class_name="mini-button">
					저장
				</Button>
				<Button type="button" onClick={on_cancel} class_name="mini-button">
					취소
				</Button>
			</div>
		</form>
	);
}

export default EditForm;
