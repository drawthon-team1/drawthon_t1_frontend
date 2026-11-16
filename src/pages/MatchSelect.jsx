import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import { getPostings } from '../api/postApi';
import { getErrorMessage } from '../api/axios';
import { formatCompensation, formatHours, formatLocation, REWARD_TYPE_LABEL } from '../api/postFormat';
import './MatchSelect.css';

const TABS = { '전체': null, '유급': 'WAGE', '봉사': 'VOLUNTEER_HOURS' };

// 공고 API 응답을 이 화면의 카드 형태로 바꾼다.
const toSelectPost = (post) => ({
  id: post.id,
  rewardType: post.rewardType,
  category: REWARD_TYPE_LABEL[post.rewardType],
  title: post.programTitle,
  farm: post.registeringOrganizationName || '',
  location: formatLocation(post),
  hours: formatHours(post),
  compensation: formatCompensation(post),
  applicants: post.applicantCount ?? 0,
  capacity: post.recruitmentCapacity || null,
});

const MatchSelect = ({ selectedPost, onConfirmPost, selectedTeam }) => {
  const navigate = useNavigate();
  const [draftPost, setDraftPost] = useState(selectedPost);
  const [posts, setPosts] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [activeTab, setActiveTab] = useState('전체');

  // 팀이 지원할 수 있는 모집 중 공고만 불러온다.
  useEffect(() => {
    let ignore = false;
    getPostings({ statuses: ['RECRUITING'] })
      .then((data) => ({ data: data.map(toSelectPost), error: '' }))
      .catch((error) => ({ data: [], error: getErrorMessage(error, '공고를 불러오지 못했습니다.') }))
      .then(({ data, error }) => {
        if (ignore) return;
        setPosts(data);
        setLoadError(error);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const visiblePosts = (posts || []).filter((post) => !TABS[activeTab] || post.rewardType === TABS[activeTab]);
  // 팀 매칭 화면에서 고른 팀의 인원. 팀이 없으면 null
  const teamSize = selectedTeam?.memberCount ?? null;
  const remainingSlots = draftPost?.capacity ? draftPost.capacity - draftPost.applicants : null;
  const notEnoughSlots = teamSize != null && remainingSlots != null && teamSize > remainingSlots;

  return (
    <div className="match-select-page">
      <Header />
      {/* 🚨 여기에 있던 두 번째 </header> 불량 태그를 삭제했습니다! */}

      <main className="match-select-content">
        <Link className="back-to-match-link" to="/match">
          &lt; 팀 매칭으로 돌아가기
        </Link>
        <h1 className="match-select-title">우리 팀이 지원할 공고 선택</h1>
        <p className="match-select-description">
          공고를 고르면 보상과 신청 가능 인원을 알 수 있어요.
        </p>

        <div className="match-select-layout">
          <section className="select-post-list-section" aria-labelledby="select-post-list-title">
            <h2 id="select-post-list-title">공고 목록</h2>
            <div className="post-filter-group" aria-label="공고 종류">
              {Object.keys(TABS).map((tab) => (
                <button
                  className="post-filter-button"
                  type="button"
                  key={tab}
                  aria-pressed={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            {posts === null && <p className="page-state">공고를 불러오는 중입니다...</p>}
            {loadError && <p className="form-error" role="alert">{loadError}</p>}
            {posts && !loadError && visiblePosts.length === 0 && <p className="page-state">모집 중인 공고가 없습니다.</p>}

            <fieldset className="post-selection-group">
              <legend>공고 선택</legend>
              <ul className="select-post-list">
                {visiblePosts.map((post) => (
                  <li className="select-post-list-item" key={post.id}>
                    <label className="post-selection-option">
                      <input
                        type="radio"
                        name="selectedPost"
                        value={post.id}
                        checked={draftPost?.id === post.id}
                        onChange={() => setDraftPost(post)}
                      />
                      <span className="post-selection-content">
                        <span className="post-selection-heading">
                          <span className="post-selection-category">{post.category}</span>
                          <span className="post-selection-title">
                            {post.title}{post.farm && ` (${post.farm})`}
                          </span>
                          <span className="post-selection-compensation">{post.compensation}</span>
                        </span>
                        <span className="post-selection-details">
                          <span className="post-selection-location">{post.location}</span>
                          {' / '}
                          <span className="post-selection-hours">{post.hours}</span>
                          {post.capacity && post.capacity - post.applicants === 1 && (
                            <span className="post-selection-remaining">남은 자리 1명</span>
                          )}
                          <span className="post-selection-applicants">
                            신청 {post.applicants}/{post.capacity ?? '제한 없음'} 명
                          </span>
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
          </section>

          <section className="selected-post-section" aria-labelledby="selected-post-title">
            <h2 id="selected-post-title">선택한 공고</h2>
            {draftPost ? (
              <>
                <span className="selected-post-category">{draftPost.category}</span>
                <h3 className="selected-post-name">{draftPost.title}</h3>
                <p className="selected-post-location">
                  {draftPost.farm ? `${draftPost.farm} / ${draftPost.location}` : draftPost.location}
                </p>
                <dl className="selected-post-details">
                  <div className="selected-post-detail">
                    <dt>근무 시간</dt>
                    <dd>{draftPost.hours}</dd>
                  </div>
                  <div className="selected-post-detail">
                    <dt>보상</dt>
                    <dd>{draftPost.compensation}</dd>
                  </div>
                  <div className="selected-post-detail">
                    <dt>공고 신청 현황</dt>
                    <dd>{draftPost.applicants} / {draftPost.capacity ?? '제한 없음'}명</dd>
                  </div>
                  <div className="selected-post-detail">
                    <dt>내 팀 참여 인원</dt>
                    <dd>{teamSize != null ? `${teamSize}명 (${selectedTeam.name})` : '팀을 먼저 골라 주세요'}</dd>
                  </div>
                </dl>
                <p className="selected-post-availability">
                  남은 자리 {remainingSlots ?? '제한 없음'}{remainingSlots != null && '명'}
                  {teamSize != null && ` / 내 팀 참여 인원 ${teamSize}명`}
                </p>
                {notEnoughSlots && <p className="form-error">남은 자리보다 팀 인원이 많습니다.</p>}
              </>
            ) : (
              <p>공고를 선택해 주세요.</p>
            )}
            <button
              className="confirm-post-button"
              type="button"
              disabled={!draftPost}
              onClick={() => {
                onConfirmPost(draftPost);
                navigate('/match');
              }}
            >
              이 공고로 확정
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MatchSelect;