import api from './axios';

/** 팀 만들기. 만든 회원이 팀장(OWNER)이 된다. */
export const createTeam = async (name) => {
  const { data } = await api.post('/api/teams', { name });
  return data;
};

/** 내가 속한 팀 목록 (myRole: OWNER / MEMBER) */
export const getMyTeams = async () => {
  const { data } = await api.get('/api/teams');
  return data;
};

/** 팀 현황 (팀원 목록 포함). 팀원만 조회할 수 있다. */
export const getTeam = async (teamId) => {
  const { data } = await api.get(`/api/teams/${teamId}`);
  return data;
};

/** 초대 링크 만들기 (팀장만, 7일 유효). inviteUrl은 프론트의 /invitations/{token} 주소다. */
export const createInvitation = async (teamId) => {
  const { data } = await api.post(`/api/teams/${teamId}/invitations`);
  return data;
};

/** 초대 정보 (팀 이름, 팀장, 인원, 만료 시각, 이미 가입했는지) */
export const getInvitation = async (token) => {
  const { data } = await api.get(`/api/team-invitations/${token}`);
  return data;
};

/** 초대 수락. 이미 가입한 회원이 다시 호출해도 중복 가입되지 않는다. */
export const acceptInvitation = async (token) => {
  const { data } = await api.post(`/api/team-invitations/${token}/accept`);
  return data;
};
