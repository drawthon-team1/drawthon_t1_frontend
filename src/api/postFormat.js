// 백엔드 공고 응답을 화면 카드에 맞는 문구로 바꾼다.

export const REWARD_TYPE_LABEL = { WAGE: '유급', VOLUNTEER_HOURS: '봉사' };

export const formatCompensation = (post) => {
  if (post.reward == null) {
    return post.rewardType === 'WAGE' ? '일당 협의' : '봉사시간 미정';
  }
  return post.rewardType === 'WAGE'
    ? `일당 ${post.reward.toLocaleString('ko-KR')}원`
    : `봉사 ${post.reward}시간`;
};

/** "9", "09:00" 모두 "09:00"으로 */
export const formatTime = (time) => {
  if (!time) return '';
  const [hour, minute = '00'] = String(time).split(':');
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
};

export const formatHours = (post) => {
  const start = formatTime(post.activityStartTime);
  const end = formatTime(post.activityEndTime);
  if (start && end) return `${start}–${end}`;
  return start || '시간 미정';
};

export const formatLocation = (post) => post.address || post.activityPlace || post.registeringOrganizationName || '장소 미정';

export const formatApplicants = (post) => {
  const count = post.applicantCount ?? 0;
  return post.recruitmentCapacity ? `신청 ${count}/${post.recruitmentCapacity} 명` : `신청 ${count}명`;
};

/** "2026-11-21" -> "2026.11.21", 시작일과 종료일이 같으면 하나만 */
export const formatPeriod = (start, end) => {
  const format = (date) => (date ? date.replaceAll('-', '.') : '');
  if (!start && !end) return '미정';
  if (!end || start === end) return format(start);
  return `${format(start)} ~ ${format(end)}`;
};

export const RECRUITMENT_STATUS_LABEL = {
  UPCOMING: '모집 예정',
  RECRUITING: '모집 중',
  CLOSING_SOON: '마감 직전',
  CLOSED: '모집 완료',
};

/** 목록·메인 카드에 쓰는 형태 */
export const toPostCard = (post) => ({
  id: post.id,
  category: REWARD_TYPE_LABEL[post.rewardType] || '공고',
  compensation: formatCompensation(post),
  title: post.programTitle,
  location: formatLocation(post),
  hours: formatHours(post),
  applicants: formatApplicants(post),
  status: RECRUITMENT_STATUS_LABEL[post.recruitmentStatus],
});
