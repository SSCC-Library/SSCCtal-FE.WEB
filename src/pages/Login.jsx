import { useState } from 'react';
import axios from 'axios';
import '../css/style.css';
import '../css/reset.css';

const Login = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/login`,
        {
          student_id: studentId,
          password: password
        }
      );

      const token = res.data.token;

      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('username', res.data.name); 
        window.location.href = '/';
      } else {
        setError('토큰이 발급되지 않았습니다.');
      }
    } catch (err) {
      setError('로그인에 실패했습니다. 학번과 비밀번호를 확인하세요.');
    }
  };

  return (
    <div className="notice-box login-box">
      <h3>로그인</h3>
      <p className="subtext">유세인트 계정을 입력하세요.</p>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="학번"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">로그인</button>
        {error && <p className="error-msg">{error}</p>}
      </form>
    </div>
  );
};

export default Login;