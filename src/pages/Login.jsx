import { useState } from 'react';
import axios from 'axios';
import '../css/style.css';
import '../css/reset.css';

const Login = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

      const token = res.data.data.token;

      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('username', res.data.data.name);
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
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <input
            type="text"
            placeholder="학번"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
          <div style={{ position: 'relative', marginTop: '0px' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호"
              value={password}
              onChange={(e) => {
                const filtered = e.target.value.replace(/[^\x20-\x7E]/g, '');
                setPassword(filtered);
              }}
              style={{
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '100%'
              }}
            >
              <img
                src={showPassword ? '/img/login/eye-slash.png' : '/img/login/eye.png'}
                alt={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                tabIndex={-1}
              />
            </div>
          </div>
        </div>
        <button type="submit" style={{ marginTop: '12px' }}>로그인</button>
        <div style={{ minHeight: '1.2em', marginTop: '4px' }}>
          <p className="error-msg">{error || '\u00A0'}</p>
        </div>
      </form>
    </div>
  );
};

export default Login;