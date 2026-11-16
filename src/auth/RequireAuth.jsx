import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * 로그인해야 볼 수 있는 화면을 감싼다. 로그인하지 않았으면 로그인 화면으로 보내고,
 * 로그인 후 원래 화면으로 돌아올 수 있게 주소를 넘긴다. adminOnly면 ADMIN만 통과한다.
 */
const RequireAuth = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p className="auth-loading">로그인 정보를 확인하는 중입니다...</p>;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/" replace state={{ notice: '관리자만 사용할 수 있는 화면입니다.' }} />;
  }
  return children;
};

export default RequireAuth;
