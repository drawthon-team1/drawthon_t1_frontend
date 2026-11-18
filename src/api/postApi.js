import api from './axios';

const BASE = '/api/v1/posting';

// 배열 값은 백엔드가 받는 형식(durations=ONE_DAY,UP_TO_3_DAYS)으로, 빈 값은 빼고 보낸다.
const toParams = (filters = {}) => Object.fromEntries(
  Object.entries(filters)
    .filter(([, value]) => (Array.isArray(value) ? value.length > 0 : value !== '' && value != null))
    .map(([key, value]) => [key, Array.isArray(value) ? value.join(',') : value]),
);

/**
 * 공고 목록. filters: { keyword, rewardType, sigungu, eupMyeonDong, startDate, endDate,
 * durations[], timeSlots[], statuses[], workTypes[] }
 */
export const getPostings = async (filters) => {
  /**const { data } = await api.get(BASE, { params: toParams(filters) });
  return data;*/
  return [];
};

export const getPosting = async (postingId) => {
  const { data } = await api.get(`${BASE}/${postingId}`);
  return data;
};

/** 공고 직접 생성 (ADMIN) */
export const createPosting = async (posting) => {
  const { data } = await api.post(BASE, posting);
  return data;
};

/** 공고 신청 (USER) */
export const applyPosting = async (postingId) => {
  const { data } = await api.post(`${BASE}/${postingId}/application`);
  return data;
};

/** 공고 신청 철회 (USER) */
export const withdrawPosting = async (postingId) => {
  const { data } = await api.delete(`${BASE}/${postingId}/application`);
  return data;
};

/** 1365 농어촌 공고 검색 (저장하지 않음) */
export const searchExternalPostings = async ({ keyword, pageNo = 1, numOfRows = 10 } = {}) => {
  const { data } = await api.get(`${BASE}/external`, { params: toParams({ keyword, pageNo, numOfRows }) });
  return data;
};

/** 1365 공고 가져오기 (ADMIN) */
export const importExternalPosting = async (programRegistrationNumber) => {
  const { data } = await api.post(`${BASE}/external`, { programRegistrationNumber });
  return data;
};

/** 자연어 설명으로 공고 초안 만들기 (ADMIN, 저장하지 않음) */
export const createPostingDraft = async (description) => {
  const { data } = await api.post(`${BASE}/ai/draft`, { description });
  return data;
};
