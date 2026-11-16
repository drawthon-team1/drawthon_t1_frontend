import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { filterPosts } from './postListFilters';
import './PostList.css';

const posts = [
  {
    id: 'harvest',
    category: '유급',
    compensation: '일당 100,000원',
    title: '[농작물 수확] 오전 벼 수확 (하늘 농장)',
    location: '충남 아산시',
    hours: '08:00–12:00',
    applicants: '신청 2/4 명',
  },
  {
    id: 'weeding',
    category: '봉사',
    compensation: '봉사 3시간',
    title: '[밭 메기] 텃밭 잡초 제거 (푸른들 농원)',
    location: '충남 천안시',
    hours: '09:00–12:00',
    applicants: '신청 1/3 명',
  },
  {
    id: 'greenhouse',
    category: '유급',
    compensation: '일당 110,000원',
    title: '[비닐 씌우기] 하우스 비닐 덮기 (새봄 농장)',
    location: '충남 예산군',
    hours: '08:00–17:00',
    applicants: '신청 3/4 명',
  },
  {
    id: 'boxes',
    category: '봉사',
    compensation: '봉사 2시간',
    title: '[기타] 수확 상자 정리 (햇살 농장)',
    location: '충남 아산시',
    hours: '14:00–16:00',
    applicants: '신청 0/2 명',
  },
];

const durationOptions = ['하루', '3일 이하', '일주일 이하', '2주~1개월 미만', '1개월 이상'];
const timeSlotOptions = ['새벽', '오전', '오후', '저녁', '야간'];
const statusOptions = ['모집 중', '마감 직전', '모집 완료'];
const taskTypeOptions = ['수확', '선별·포장', '파종·재배', '제초', '기타'];

const toggleOption = (setSelection, option) => {
  setSelection((current) => (
    current.includes(option)
      ? current.filter((value) => value !== option)
      : [...current, option]
  ));
};

const PostList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('전체');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [displayedPosts, setDisplayedPosts] = useState(posts);
  const [searchError, setSearchError] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [region, setRegion] = useState({ city: '', district: '' });
  const [schedule, setSchedule] = useState({ startDate: '', endDate: '' });
  const [duration, setDuration] = useState([]);
  const [timeSlot, setTimeSlot] = useState([]);
  const [status, setStatus] = useState([]);
  const [taskType, setTaskType] = useState([]);

  const totalCount = posts.length;
  const paidCount = posts.filter((post) => post.category === '유급' || post.category === '일자리').length;
  const volunteerCount = posts.filter((post) => post.category === '봉사').length;
  const tabs = [
    { name: '전체', count: totalCount },
    { name: '유급', count: paidCount },
    { name: '봉사', count: volunteerCount },
  ];
  const handleSearch = (event) => {
    event.preventDefault();
    if (schedule.startDate && schedule.endDate && schedule.startDate > schedule.endDate) {
      setSearchError('시작일은 마감일보다 늦을 수 없습니다.');
      return;
    }

    setSearchError('');
    setDisplayedPosts(filterPosts(posts, {
      activeTab, searchKeyword, region, schedule, duration, timeSlot, status, taskType,
    }));
  };

  return (
    <div className="post-list-page">
      <header className="post-list-header">
        <nav className="post-list-navigation" aria-label="주요 메뉴">
          <Link className="navigation-link" to="/">홈</Link>
          <Link className="navigation-link" to="/register">공고등록</Link>
          <Link className="navigation-link" to="/match">팀 매칭</Link>
          <Link className="navigation-link" to="/mypage">마이페이지</Link>
        </nav>
      </header>

      <main className="post-list-content">
        <h1 className="post-list-title">공고 목록</h1>

        <section className="post-list-controls" aria-label="공고 검색 및 분류">
          <fieldset className="post-filter-group" aria-label="공고 종류">
            {tabs.map((tab) => (
              <label className="post-filter-button" key={tab.name}>
                <input
                  type="radio"
                  name="postCategory"
                  value={tab.name}
                  checked={activeTab === tab.name}
                  onChange={() => setActiveTab(tab.name)}
                />
                {tab.name} {tab.count}건
              </label>
            ))}
          </fieldset>

          <form className="post-search-form" role="search" onSubmit={handleSearch}>
            <input
              className="post-search-input"
              type="search"
              name="query"
              aria-label="일감 또는 농장명 검색"
              placeholder="일감 또는 농장명을 입력하세요"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
            />
            <button className="post-search-button" type="submit">
              검색
            </button>
          </form>

          <button
            className="post-advanced-filter-toggle"
            type="button"
            aria-expanded={isFilterOpen}
            aria-controls="post-advanced-filters"
            onClick={() => setIsFilterOpen((open) => !open)}
          >
            상세 필터 {isFilterOpen ? '접기' : '펼치기'}
          </button>

          <section
            id="post-advanced-filters"
            className="post-advanced-filters"
            aria-labelledby="post-advanced-filters-title"
            hidden={!isFilterOpen}
          >
            <h2 id="post-advanced-filters-title">상세 필터</h2>
            <p className="post-filter-notice">상세 필터 데이터가 없는 공고는 해당 조건을 선택해 검색하면 표시되지 않습니다. 지역 목록은 연동 예정입니다.</p>

            <fieldset className="post-filter-field">
              <legend>지역</legend>
              <div className="post-filter-input-row">
                <label className="post-filter-input">
                  시·군
                  <select
                    value={region.city}
                    onChange={(event) => setRegion({ city: event.target.value, district: '' })}
                    disabled
                  >
                    <option value="">지역 목록 연동 예정</option>
                  </select>
                </label>
                <label className="post-filter-input">
                  읍·면·동
                  <select
                    value={region.district}
                    onChange={(event) => setRegion((current) => ({ ...current, district: event.target.value }))}
                    disabled
                  >
                    <option value="">지역 목록 연동 예정</option>
                  </select>
                </label>
              </div>
            </fieldset>

            <fieldset className="post-filter-field">
              <legend>일정</legend>
              <div className="post-filter-input-row">
                <label className="post-filter-input">
                  시작일
                  <input
                    type="date"
                    value={schedule.startDate}
                    onChange={(event) => setSchedule((current) => ({ ...current, startDate: event.target.value }))}
                  />
                </label>
                <label className="post-filter-input">
                  마감일
                  <input
                    type="date"
                    value={schedule.endDate}
                    onChange={(event) => setSchedule((current) => ({ ...current, endDate: event.target.value }))}
                  />
                </label>
              </div>
            </fieldset>

            {[
              { label: '기간', options: durationOptions, selected: duration, setSelected: setDuration },
              { label: '시간대', options: timeSlotOptions, selected: timeSlot, setSelected: setTimeSlot },
              { label: '모집 상태', options: statusOptions, selected: status, setSelected: setStatus },
            ].map((group) => (
              <fieldset className="post-filter-field" key={group.label}>
                <legend>{group.label}</legend>
                <div className="post-filter-badges">
                  {group.options.map((option) => (
                    <label className="post-filter-badge" key={option}>
                      <input
                        type="checkbox"
                        checked={group.selected.includes(option)}
                        onChange={() => toggleOption(group.setSelected, option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            <label className="post-filter-input post-task-type">
              작업 종류
              <span className="post-filter-hint">여러 항목을 선택하려면 Ctrl 또는 Command 키를 누른 채 선택해 주세요.</span>
              <select
                multiple
                value={taskType}
                onChange={(event) => setTaskType(
                  Array.from(event.target.selectedOptions, (option) => option.value)
                )}
              >
                {taskTypeOptions.map((option) => (
                  <option value={option} key={option}>{option}</option>
                ))}
              </select>
            </label>
            <button className="post-filter-apply-button" type="button" onClick={handleSearch}>
              필터 적용 검색
            </button>
          </section>

          {searchError && <p className="post-search-error" role="alert">{searchError}</p>}
        </section>

        <section className="post-results" aria-label="공고 목록">
          <ul className="post-list">
            {displayedPosts.map((post) => (
              <li className="post-list-item" key={post.id}>
                <article className="post-card">
                  <header className="post-card-header">
                    <span className="post-category" data-category={post.category}>{post.category}</span>
                    <span className="post-compensation">{post.compensation}</span>
                  </header>
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-details">
                    <span className="post-location">{post.location}</span>
                    {' / '}
                    <span className="post-hours">{post.hours}</span>
                  </p>
                  <p className="post-applicants">{post.applicants}</p>
                  <button
                    className="post-detail-button"
                    type="button"
                    onClick={() => navigate(`/detail/${post.id}`)}
                  >
                    상세 보기
                  </button>
                </article>
              </li>
            ))}
          </ul>
          {displayedPosts.length === 0 && <p className="post-results-empty">검색 결과가 없습니다.</p>}
        </section>
      </main>
    </div>
  );
};

export default PostList;