import { Link } from 'react-router-dom';
import './MyPage.css';

const MyPage = () => {
  return (
    <div className="mypage">
      <header className="mypage-header">
        <nav className="mypage-navigation" aria-label="주요 메뉴">
          <Link className="navigation-link" to="/">홈</Link>
          <Link className="navigation-link" to="/register">공고등록</Link>
          <Link className="navigation-link" to="/match">팀 매칭</Link>
          <Link className="navigation-link" to="/mypage" aria-current="page">마이페이지</Link>
        </nav>
        <Link className="register-link" to="/register">공고 등록</Link>
      </header>

      <main className="mypage-content">
        <h1 className="mypage-title">마이페이지</h1>

        <div className="mypage-layout">
          <aside className="profile-section" aria-labelledby="profile-title">
            <h2 id="profile-title">내 프로필</h2>
            <p className="profile-description">내 계정 정보</p>

            <nav className="profile-menu" aria-label="마이페이지 메뉴">
              <a className="profile-menu-link" href="#account-info" aria-current="page">
                내 계정 정보
              </a>
              <button className="profile-menu-button" type="button" disabled>
                내 공고의 매칭 학생 목록
              </button>
              <button className="profile-menu-button" type="button" disabled>
                지원한 공고 내역
              </button>
            </nav>

            <button className="logout-button" type="button" disabled>
              로그아웃
            </button>
          </aside>

          <section className="account-info-section" id="account-info" aria-labelledby="account-info-title">
            <h2 id="account-info-title">내 계정 정보</h2>
            <div className="account-info-fields">
              <div className="account-info-field">
                <label htmlFor="account-email">이메일</label>
                <input id="account-email" name="email" type="email" autoComplete="email" readOnly />
              </div>
              <div className="account-info-field">
                <label htmlFor="account-username">아이디</label>
                <input id="account-username" name="username" type="text" autoComplete="username" readOnly />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MyPage;
