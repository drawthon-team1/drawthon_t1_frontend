import api, { clearCsrf, refreshCsrf } from './axios';

/** 일반 회원가입 (USER). nickname은 화면의 "닉네임" 입력값 */
export const signup = async ({ email, password, nickname }) => {
  const { data } = await api.post('/api/auth/signup', { email, password, nickname });
  return data;
};

/** 관리자 회원가입 (ADMIN). 백엔드 설정(PUBLIC_ADMIN_SIGNUP_ENABLED)이 켜져 있을 때 누구나 호출할 수 있다. */
export const signupAdmin = async ({ email, password, nickname }) => {
  const { data } = await api.post('/api/auth/admin/signup', { email, password, nickname });
  return data;
};

export const login = async ({ email, password }) => {
  const { data } = await api.post('/api/auth/login', { email, password });
  // 로그인하면 세션이 바뀌므로 CSRF 토큰도 새로 받는다.
  await refreshCsrf();
  return data;
};

/** 로그인한 회원 정보. 로그인하지 않았으면 null */
export const getMe = async () => {
  try {
    const { data } = await api.get('/api/auth/me');
    return data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return null;
    }
    throw error;
  }
};

export const logout = async () => {
  await api.post('/api/auth/logout');
  clearCsrf();
};
