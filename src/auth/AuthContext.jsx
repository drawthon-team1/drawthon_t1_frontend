import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

/** 로그인 상태(user)를 앱 전체에서 공유한다. user가 null이면 로그인하지 않은 상태. */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const member = await authApi.getMe().catch(() => null);
    setUser(member);
    setLoading(false);
    return member;
  }, []);

  // 앱을 처음 열 때 세션이 남아 있는지 확인한다.
  useEffect(() => {
    let ignore = false;
    authApi.getMe()
      .catch(() => null)
      .then((member) => {
        if (ignore) return;
        setUser(member);
        setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const member = await authApi.login(credentials);
    setUser(member);
    return member;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAdmin: user?.role === 'ADMIN',
    login,
    logout,
    refresh,
  }), [user, loading, login, logout, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.');
  }
  return context;
};
