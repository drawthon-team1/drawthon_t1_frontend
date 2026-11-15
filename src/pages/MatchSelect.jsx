import { Link } from 'react-router-dom';
import './MatchSelect.css';

const samplePosts = [
  {
    id: 'harvest',
    category: '유급',
    title: '[농작물 수확] 오전 벼 수확',
    farm: '하늘 농장',
    location: '충남 아산시',
    hours: '08:00–12:00',
    compensation: '일당 100,000원',
    applicants: 2,
    capacity: 4,
  },
  {
    id: 'weeding',
    category: '봉사',
    title: '[밭 메기] 텃밭 잡초 제거',
    farm: '푸른들 농원',
    location: '충남 천안시',
    hours: '09:00–12:00',
    compensation: '봉사 3시간',
    applicants: 1,
    capacity: 3,
  },
  {
    id: 'greenhouse',
    category: '유급',
    title: '[비닐 씌우기] 하우스 비닐 덮기',
    farm: '새봄 농장',
    location: '충남 예산군',
    hours: '08:00–17:00',
    compensation: '일당 110,000원',
    applicants: 3,
    capacity: 4,
  },
  {
    id: 'boxes',
    category: '봉사',
    title: '[기타] 수확 상자 정리',
    farm: '햇살 농장',
    location: '충남 아산시',
    hours: '14:00–16:00',
    compensation: '봉사 2시간',
    applicants: 0,
    capacity: 2,
  },
];

const MatchSelect = () => {
  const selectedPost = samplePosts[0];
  const teamSize = 2;
  const remainingSlots = selectedPost.capacity - selectedPost.applicants;

  return (
    <div className="match-select-page">
      <header className="match-select-header">
        <nav className="match-select-navigation" aria-label="주요 메뉴">
          <Link className="navigation-link" to="/">홈</Link>
          <Link className="navigation-link" to="/register">공고등록</Link>
          <Link className="navigation-link" to="/match">팀 매칭</Link>
          <Link className="navigation-link" to="/mypage">마이페이지</Link>
        </nav>
        <Link className="register-link" to="/register">공고 등록</Link>
      </header>

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
              <button className="post-filter-button" type="button" disabled>전체</button>
              <button className="post-filter-button" type="button" disabled>유급</button>
              <button className="post-filter-button" type="button" disabled>봉사</button>
            </div>

            <fieldset className="post-selection-group">
              <legend>공고 선택</legend>
              <ul className="select-post-list">
                {samplePosts.map((post, index) => (
                  <li className="select-post-list-item" key={post.id}>
                    <label className="post-selection-option">
                      <input
                        type="radio"
                        name="selectedPost"
                        value={post.id}
                        defaultChecked={index === 0}
                        disabled
                      />
                      <span className="post-selection-content">
                        <span className="post-selection-heading">
                          <span className="post-selection-category">{post.category}</span>
                          <span className="post-selection-title">
                            {post.title} ({post.farm})
                          </span>
                          <span className="post-selection-compensation">{post.compensation}</span>
                        </span>
                        <span className="post-selection-details">
                          <span className="post-selection-location">{post.location}</span>
                          {' / '}
                          <span className="post-selection-hours">{post.hours}</span>
                          {post.capacity - post.applicants === 1 && (
                            <span className="post-selection-remaining">남은 자리 1명</span>
                          )}
                          <span className="post-selection-applicants">
                            신청 {post.applicants}/{post.capacity} 명
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
            <span className="selected-post-category">{selectedPost.category}</span>
            <h3 className="selected-post-name">{selectedPost.title}</h3>
            <p className="selected-post-location">
              {selectedPost.farm} / {selectedPost.location}
            </p>
            <dl className="selected-post-details">
              <div className="selected-post-detail">
                <dt>근무 시간</dt>
                <dd>{selectedPost.hours}</dd>
              </div>
              <div className="selected-post-detail">
                <dt>보상</dt>
                <dd>{selectedPost.compensation}</dd>
              </div>
              <div className="selected-post-detail">
                <dt>공고 신청 현황</dt>
                <dd>{selectedPost.applicants} / {selectedPost.capacity}명</dd>
              </div>
              <div className="selected-post-detail">
                <dt>내 팀 참여 인원</dt>
                <dd>{teamSize}명</dd>
              </div>
            </dl>
            <p className="selected-post-availability">
              남은 자리 {remainingSlots}명 / 내 팀 참여 인원 {teamSize}명
            </p>
            <button className="confirm-post-button" type="button" disabled>
              이 공고로 확정
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MatchSelect;