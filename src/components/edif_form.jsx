/*
Editform 컴포넌트
meta 기반 필수 입력 필드 설정
fields 배열에서 모든 input 설정값 받아서 동적으로 생성
*/

import React, { useState, useEffect } from 'react';
import Button from './button';
import './edit_form.css';

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

		const empty_field = fields.find((field) => {
			if (!field.required) return false;

			const v = form[field.value];

			// null/undefined → 빈값
			if (v === null || v === undefined) return true;

			// 숫자 0은 유효값
			if (typeof v === 'number') return false;

			// boolean은 보통 select/checkbox에서만 쓸 텐데, false를 빈값 취급할지 정책 결정
			if (typeof v === 'boolean') return !v && field.strict === true;

			// 문자열만 trim 검사
			if (typeof v === 'string') return v.trim() === '';

			// 배열이면 길이 0이면 빈값
			if (Array.isArray(v)) return v.length === 0;

			// 그 외(객체 등)는 여기선 빈값으로 취급
			return true;
		});

		if (empty_field) {
			set_form_error(`${empty_field.label} 입력은 필수입니다.`);
			return;
		}

		set_form_error(null);
		on_save(form);
	};

	return (
		<form className="edit-form" onSubmit={handle_submit}>
			<div className="edit-form-fields-row">
				{fields.map((field) => (
					<label key={field.value} className="edit-form-label">
						{field.label}
						{field.type === 'select' ? (
							<select
								name={field.value}
								value={form[field.value] ?? ''}
								onChange={handle_change}
								className="edit-form-select"
								disabled={loading}
								required={field.required}
							>
								<option value="" disabled>
									선택하세요
								</option>
								{field.options.map((opt) => (
									<option key={opt.value} value={opt.value}>
										{opt.label}
									</option>
								))}
							</select>
						) : (
							<input
								name={field.value}
								type="text"
								value={form[field.value] ?? ''}
								onChange={handle_change}
								className="edit-form-input"
								autoComplete="off"
								disabled={loading}
								required={field.required}
							/>
						)}
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
