import { Link } from 'react-router-dom';
import './PostList.css';

const samplePosts = [
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

const PostList = () => {
  return (
    <div className="post-list-page">
      <header className="post-list-header">
        <nav className="post-list-navigation" aria-label="주요 메뉴">
          <Link className="navigation-link" to="/">홈</Link>
          <Link className="navigation-link" to="/register">공고등록</Link>
          <Link className="navigation-link" to="/match">팀 매칭</Link>
          <Link className="navigation-link" to="/mypage">마이페이지</Link>
        </nav>
        <Link className="register-link" to="/register">공고 등록</Link>
      </header>

      <main className="post-list-content">
        <h1 className="post-list-title">공고 목록</h1>

        <section className="post-list-controls" aria-label="공고 검색 및 분류">
          <div className="post-filter-group" aria-label="공고 종류">
            <button className="post-filter-button" type="button" disabled>
              전체 4건
            </button>
            <button className="post-filter-button" type="button" disabled>
              유급 2건
            </button>
            <button className="post-filter-button" type="button" disabled>
              봉사 2건
            </button>
          </div>

          <form className="post-search-form" role="search">
            <input
              className="post-search-input"
              type="search"
              name="query"
              aria-label="일감 또는 농장명 검색"
              placeholder="일감 또는 농장명 검색"
              disabled
            />
            <button className="post-search-button" type="submit" disabled>
              검색
            </button>
          </form>
        </section>

        <section className="post-results" aria-label="공고 목록">
          <ul className="post-list">
            {samplePosts.map((post) => (
              <li className="post-list-item" key={post.id}>
                <article className="post-card">
                  <header className="post-card-header">
                    <span className="post-category">{post.category}</span>
                    <span className="post-compensation">{post.compensation}</span>
                  </header>
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-details">
                    <span className="post-location">{post.location}</span>
                    {' / '}
                    <span className="post-hours">{post.hours}</span>
                  </p>
                  <p className="post-applicants">{post.applicants}</p>
                  <button className="post-detail-button" type="button" disabled>
                    상세 보기
                  </button>
                </article>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default PostList;