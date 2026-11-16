import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { signup, signupAdmin } from '../api/authApi';
import { getErrorMessage } from '../api/axios';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', nickname: '', isAdmin: false });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const request = { email: form.email, password: form.password, nickname: form.nickname };
      await (form.isAdmin ? signupAdmin(request) : signup(request));
      navigate('/login', { state: { email: form.email, message: '회원가입이 완료되었습니다. 로그인해 주세요.' } });
    } catch (signupError) {
      setError(getErrorMessage(signupError, '회원가입에 실패했습니다.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signup-page">
      <Header />

      <main className="signup-container">
        <section className="signup-hero" aria-label="농촌 일자리 소개">
          <p className="signup-hero-message">
            가까운 농촌에서<br />
            오늘의 일감을 만나요
          </p>
        </section>

        <section className="signup-form-section" aria-labelledby="signup-title">
          <h1 id="signup-title" className="signup-title">회원가입</h1>
          <p className="signup-description">
            농촌 일자리와 봉사 공고를 찾아보세요.
          </p>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="signup-email">이메일</label>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="signup-password">비밀번호</label>
              <input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              {/* 백엔드 회원 정보는 아이디 대신 닉네임을 받는다 */}
              <label htmlFor="signup-nickname">닉네임</label>
              <input
                id="signup-nickname"
                name="nickname"
                type="text"
                autoComplete="nickname"
                maxLength={40}
                required
                value={form.nickname}
                onChange={handleChange}
              />
            </div>

            <label className="signup-admin-option">
              <input name="isAdmin" type="checkbox" checked={form.isAdmin} onChange={handleChange} />
              관리자(공고 등록자)로 가입
            </label>

            {error && <p className="form-error" role="alert">{error}</p>}

            <button className="signup-submit-button" type="submit" disabled={submitting}>
              {submitting ? '가입 중...' : '회원가입'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Signup;
