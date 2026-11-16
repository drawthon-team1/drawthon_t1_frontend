import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { getPostings } from '../api/postApi';
import { getErrorMessage } from '../api/axios';
import { toPostCard } from '../api/postFormat';
import './PostList.css';

// 화면 선택지 -> 백엔드 필터 값 (GET /api/v1/posting 파라미터)
const DURATION_VALUES = {
  '하루': 'ONE_DAY', '3일 이하': 'UP_TO_3_DAYS', '일주일 이하': 'UP_TO_1_WEEK',
  '2주~1개월 미만': 'TWO_WEEKS_TO_1_MONTH', '1개월 이상': 'ONE_MONTH_OR_MORE',
};
const TIME_SLOT_VALUES = { '새벽': 'DAWN', '오전': 'MORNING', '오후': 'AFTERNOON', '저녁': 'EVENING', '야간': 'NIGHT' };
const STATUS_VALUES = { '모집 중': 'RECRUITING', '마감 직전': 'CLOSING_SOON', '모집 완료': 'CLOSED' };
const TASK_TYPE_VALUES = {
  '수확': 'HARVEST', '선별·포장': 'SORTING_PACKING', '파종·재배': 'PLANTING_CULTIVATION', '제초': 'WEEDING', '기타': 'ETC',
};
const TAB_REWARD_TYPES = { '유급': 'WAGE', '봉사': 'VOLUNTEER_HOURS' };

const durationOptions = Object.keys(DURATION_VALUES);
const timeSlotOptions = Object.keys(TIME_SLOT_VALUES);
const statusOptions = Object.keys(STATUS_VALUES);
const taskTypeOptions = Object.keys(TASK_TYPE_VALUES);

const toValues = (selected, mapping) => selected.map((label) => mapping[label]);

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
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchError, setSearchError] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [region, setRegion] = useState({ city: '', district: '' });
  const [schedule, setSchedule] = useState({ startDate: '', endDate: '' });
  const [duration, setDuration] = useState([]);
  const [timeSlot, setTimeSlot] = useState([]);
  const [status, setStatus] = useState([]);
  const [taskType, setTaskType] = useState([]);

  // 공고 유형 탭은 탭별 건수를 보여 주기 위해 서버가 아니라 화면에서 거르고, 나머지 조건은 서버 필터로 보낸다.
  const loadPosts = useCallback(async (filters) => {
    setLoading(true);
    setSearchError('');
    try {
      setPosts(await getPostings(filters));
    } catch (loadError) {
      setSearchError(getErrorMessage(loadError, '공고를 불러오지 못했습니다.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    getPostings({})
      .then((data) => ({ data, error: '' }))
      .catch((loadError) => ({ data: [], error: getErrorMessage(loadError, '공고를 불러오지 못했습니다.') }))
      .then(({ data, error }) => {
        if (ignore) return;
        setPosts(data);
        setSearchError(error);
        setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const tabs = [
    { name: '전체', count: posts.length },
    { name: '유급', count: posts.filter((post) => post.rewardType === 'WAGE').length },
    { name: '봉사', count: posts.filter((post) => post.rewardType === 'VOLUNTEER_HOURS').length },
  ];
  const displayedPosts = useMemo(() => posts
    .filter((post) => activeTab === '전체' || post.rewardType === TAB_REWARD_TYPES[activeTab])
    .map(toPostCard), [posts, activeTab]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (schedule.startDate && schedule.endDate && schedule.startDate > schedule.endDate) {
      setSearchError('시작일은 마감일보다 늦을 수 없습니다.');
      return;
    }

    loadPosts({
      keyword: searchKeyword.trim(),
      sigungu: region.city,
      eupMyeonDong: region.district,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      durations: toValues(duration, DURATION_VALUES),
      timeSlots: toValues(timeSlot, TIME_SLOT_VALUES),
      statuses: toValues(status, STATUS_VALUES),
      workTypes: toValues(taskType, TASK_TYPE_VALUES),
    });
  };

  return (
    <div className="post-list-page">
      <Header />

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
                  <p className="post-applicants">
                    {post.applicants}
                    {post.status && <span className="post-status"> · {post.status}</span>}
                  </p>
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
          {loading && <p className="post-results-empty">공고를 불러오는 중입니다...</p>}
          {!loading && displayedPosts.length === 0 && <p className="post-results-empty">검색 결과가 없습니다.</p>}
        </section>
      </main>
    </div>
  );
};

export default PostList;