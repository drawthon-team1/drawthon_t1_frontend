import axios from 'axios';

// VITE_API_BASE_URL이 없으면 같은 주소의 /api로 요청한다 (개발 시 vite proxy가 백엔드로 넘김).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  withCredentials: true,
});

const SAFE_METHODS = ['get', 'head', 'options'];
let csrf = null;

/** 백엔드에서 CSRF 토큰을 받아 둔다. 로그인·로그아웃 뒤에는 새로 받는다. */
export const refreshCsrf = async () => {
  const { data } = await api.get('/api/auth/csrf');
  csrf = data;
  return csrf;
};

export const clearCsrf = () => {
  csrf = null;
};

// GET이 아닌 요청에는 CSRF 토큰을 헤더에 넣는다.
api.interceptors.request.use(async (config) => {
  if (!SAFE_METHODS.includes((config.method || 'get').toLowerCase())) {
    const token = csrf || (await refreshCsrf());
    config.headers[token.headerName] = token.token;
  }
  return config;
});

// CSRF 토큰이 만료돼 403이 나면 토큰을 새로 받아 한 번만 다시 보낸다.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const isUnsafe = config && !SAFE_METHODS.includes((config.method || 'get').toLowerCase());
    if (response?.status === 403 && isUnsafe && !config.csrfRetried
        && String(response.data?.message || '').includes('CSRF')) {
      config.csrfRetried = true;
      await refreshCsrf();
      return api(config);
    }
    return Promise.reject(error);
  },
);

/** 백엔드 오류 응답({message} 또는 Problem Details의 detail)에서 사용자에게 보여 줄 문구를 꺼낸다. */
export const getErrorMessage = (error, fallback = '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.') => {
  const data = error?.response?.data;
  if (data?.errors?.length) {
    return data.errors.map((item) => item.message).join('\n');
  }
  if (data?.message || data?.detail) {
    return data.message || data.detail;
  }
  // 응답이 아예 없거나, 개발 서버 프록시가 백엔드에 닿지 못해 본문 없는 5xx를 돌려준 경우
  if (!error?.response || error.response.status >= 500) {
    return '서버에 연결할 수 없습니다. 백엔드 서버가 켜져 있는지 확인해 주세요.';
  }
  return fallback;
};

export default api;
