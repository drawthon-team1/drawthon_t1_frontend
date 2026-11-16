import api from './axios';

/** 지도 마커 목록 (로그인 없이 조회 가능) */
export const getMapNotices = async () => {
  const { data } = await api.get('/api/map/notices');
  return data;
};

export const getMapNotice = async (noticeId) => {
  const { data } = await api.get(`/api/map/notices/${noticeId}`);
  return data;
};
