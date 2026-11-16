const matchesOptions = (selected, value) => {
  if (selected.length === 0) return true;
  const values = Array.isArray(value) ? value : [value];
  return selected.some((option) => values.includes(option));
};

// 상세 공고 데이터는 지역과 일정 객체 및 화면 선택지와 같은 분류값으로 연결해 주세요.
export const filterPosts = (posts, { activeTab, searchKeyword, region, schedule, duration, timeSlot, status, taskType }) => {
  const keyword = searchKeyword.trim().toLocaleLowerCase();

  return posts.filter((post) => {
    const matchesTab = activeTab === '전체'
      || (activeTab === '유급' && (post.category === '유급' || post.category === '일자리'))
      || (activeTab === '봉사' && post.category === '봉사');
    const matchesKeyword = !keyword
      || post.title.toLocaleLowerCase().includes(keyword)
      || (typeof post.farm === 'string' && post.farm.toLocaleLowerCase().includes(keyword));
    const matchesRegion = (!region.city || post.region?.city === region.city)
      && (!region.district || post.region?.district === region.district);
    const matchesSchedule = (!schedule.startDate || (post.schedule?.endDate && post.schedule.endDate >= schedule.startDate))
      && (!schedule.endDate || (post.schedule?.startDate && post.schedule.startDate <= schedule.endDate));

    return matchesTab
      && matchesKeyword
      && matchesRegion
      && matchesSchedule
      && matchesOptions(duration, post.duration)
      && matchesOptions(timeSlot, post.timeSlot)
      && matchesOptions(status, post.status)
      && matchesOptions(taskType, post.taskType);
  });
};
