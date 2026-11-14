import './Signup.css';

const Signup = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="signup-page">
      <header className="signup-header">
        <nav className="signup-navigation" aria-label="회원 메뉴">
          <a className="login-link" href="/login">로그인</a>
        </nav>
      </header>

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
              />
            </div>

            <div className="input-group">
              <label htmlFor="signup-username">아이디</label>
              <input
                id="signup-username"
                name="username"
                type="text"
                autoComplete="username"
                required
              />
            </div>

            <button className="signup-submit-button" type="submit">
              회원가입
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Signup;