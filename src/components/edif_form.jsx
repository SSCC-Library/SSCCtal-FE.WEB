// components/edit_form.jsx
import React, { useState, useEffect } from 'react';
import './edit_form.css';
import Button from './button';

function EditForm({ initial_data, fields, on_save, on_cancel, loading = false, error = null }) {
	const [form, set_form] = useState(initial_data || {});
	const [form_error, set_form_error] = useState(null);

	useEffect(() => {
		set_form(initial_data || {});
	}, [initial_data]);

	const handle_change = (e) => {
		const { name, value } = e.target;
		set_form((prev) => ({ ...prev, [name]: value }));
	};

	const handle_submit = (e) => {
		e.preventDefault();

		const empty_field = fields.find(
			(field) => !form[field.value] || form[field.value].trim() === ''
		);
		if (empty_field) {
			set_form_error(`${empty_field.label} 입력은 필수입니다.`);
			return;
		}
		set_form_error(null);
		on_save(form);
	};

	return (
		// <form className="edit-form" onSubmit={handle_submit}>
		// 	{fields.map((field) => (
		// 		<label key={field.value} className="edit-form-label">
		// 			{field.label}
		// 			<input
		// 				name={field.value}
		// 				type="text"
		// 				value={form[field.value] ?? ''}
		// 				onChange={handle_change}
		// 				className="edit-form-input"
		// 				autoComplete="off"
		// 				disabled={loading}
		// 			/>
		// 		</label>
		// 	))}
		// 	{(form_error || error) && <div className="edit-form-error">{form_error || error}</div>}
		// 	<div className="edit-form-btns">
		// 		<Button type="submit" class_name="mini-button" disabled={loading}>
		// 			{loading ? '저장중...' : '저장'}
		// 		</Button>
		// 		<Button
		// 			type="button"
		// 			onClick={on_cancel}
		// 			class_name="mini-button"
		// 			disabled={loading}
		// 		>
		// 			취소
		// 		</Button>
		// 	</div>
		// </form>
		<form className="edit-form" onSubmit={handle_submit}>
			<div className="edit-form-fields-row">
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
							disabled={loading}
						/>
					</label>
				))}
			</div>
			{(form_error || error) && <div className="edit-form-error">{form_error || error}</div>}
			<div className="edit-form-btns">
				<Button type="submit" class_name="mini-button" disabled={loading}>
					{loading ? '저장중...' : '저장'}
				</Button>
				<Button
					type="button"
					onClick={on_cancel}
					class_name="mini-button"
					disabled={loading}
				>
					취소
				</Button>
			</div>
		</form>
	);
}

export default EditForm;
