import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../auth/AuthContext';
import { getErrorMessage } from '../api/axios';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: location.state?.email || '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form);
      // 로그인이 필요해서 넘어온 경우 원래 보던 화면으로 돌아간다.
      navigate(location.state?.from || '/', { replace: true });
    } catch (loginError) {
      setError(getErrorMessage(loginError, '로그인에 실패했습니다.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <Header />

      <main className="login-container">
        <section className="login-hero" aria-label="농촌 일자리 소개">
          <p className="login-hero-message">
            가까운 농촌에서<br />
            오늘의 일감을 만나요
          </p>
        </section>

        <section className="login-form-section" aria-labelledby="login-title">
          <h1 id="login-title" className="login-title">로그인</h1>
          <p className="login-description">이메일로 로그인하세요.</p>
          {location.state?.message && <p className="form-notice" role="status">{location.state.message}</p>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-input-group">
              <label htmlFor="login-email">이메일</label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="login-input-group">
              <label htmlFor="login-password">비밀번호</label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {error && <p className="form-error" role="alert">{error}</p>}

            <button className="login-submit-button" type="submit" disabled={submitting}>
              {submitting ? '로그인 중...' : '로그인'}
            </button>
            <Link className="login-signup-link" to="/signup">회원가입</Link>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Login;
