import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <nav className="login-navigation" aria-label="회원 메뉴">
          <Link className="signup-link" to="/signup">회원가입</Link>
        </nav>
      </header>

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

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-input-group">
              <label htmlFor="login-email">이메일</label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
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
              />
            </div>

            <button className="login-submit-button" type="submit" disabled>
              로그인
            </button>
            <Link className="login-signup-link" to="/signup">회원가입</Link>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Login;
