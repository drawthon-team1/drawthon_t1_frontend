import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './Header.css';

/**
 * 모든 화면이 함께 쓰는 헤더. 로그인 상태와 역할에 따라 메뉴가 바뀐다.
 * - 로그인 전: 홈, 공고 목록, 로그인, 회원가입
 * - 로그인 후: 홈, 공고 목록, 팀 매칭, 마이페이지, 로그아웃 (+ ADMIN이면 공고등록)
 */
const Header = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) => `navigation-link${isActive ? ' is-active' : ''}`;

  return (
    <header className="site-header">
      <nav className="site-navigation" aria-label="주요 메뉴">
        <NavLink className={linkClass} to="/" end>홈</NavLink>
        <NavLink className={linkClass} to="/postings">공고 목록</NavLink>
        {isAdmin && <NavLink className={linkClass} to="/register">공고등록</NavLink>}
        {user ? (
          <>
            <NavLink className={linkClass} to="/match">팀 매칭</NavLink>
            <NavLink className={linkClass} to="/mypage">마이페이지</NavLink>
            <button className="navigation-link navigation-button" type="button" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <NavLink className={linkClass} to="/login">로그인</NavLink>
            <NavLink className={linkClass} to="/signup">회원가입</NavLink>
          </>
        )}
      </nav>
      {user && (
        <p className="site-user">
          {user.nickname}님{isAdmin && <span className="site-user-role">관리자</span>}
        </p>
      )}
    </header>
  );
};

export default Header;
