import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../auth/AuthContext';
import './MyPage.css';

const ROLE_LABEL = { ADMIN: '관리자', USER: '일반 회원' };

const MyPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="mypage">
      <Header />

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
              {/* 아래 두 기능은 백엔드 API가 아직 없다 */}
              <button className="profile-menu-button" type="button" disabled>
                내 공고의 매칭 학생 목록
              </button>
              <button className="profile-menu-button" type="button" disabled>
                지원한 공고 내역
              </button>
            </nav>

            <button className="logout-button" type="button" onClick={handleLogout}>
              로그아웃
            </button>
          </aside>

          <section className="account-info-section" id="account-info" aria-labelledby="account-info-title">
            <h2 id="account-info-title">내 계정 정보</h2>
            <div className="account-info-fields">
              <div className="account-info-field">
                <label htmlFor="account-email">이메일</label>
                <input id="account-email" name="email" type="email" value={user.email} readOnly />
              </div>
              <div className="account-info-field">
                <label htmlFor="account-nickname">닉네임</label>
                <input id="account-nickname" name="nickname" type="text" value={user.nickname} readOnly />
              </div>
              <div className="account-info-field">
                <label htmlFor="account-role">회원 유형</label>
                <input id="account-role" name="role" type="text" value={ROLE_LABEL[user.role] || user.role} readOnly />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MyPage;
