import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './test_page.css';

function TestPage() {
	return (
		<div className="notice-box">
			<div className="title">대여 이용 안내</div>
			<p>
				기본 대여 기간은 <strong>2주</strong>입니다.
			</p>
			<p>
				물품 대여는 동아리방 내 키오스크에서만 진행되며,
				<br />
				대여하지 않은 물품은 <strong>외부 반출이 불가능</strong>합니다.
			</p>
			<p>모두가 편리하게 이용할 수 있도록 동아리원 여러분의 적극적인 협조 부탁드립니다.</p>
		</div>
	);
}

export default TestPage;
