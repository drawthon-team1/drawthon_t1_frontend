import { Link } from 'react-router-dom';
import './Main.css';

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
];

const Main = () => {
  return (
    <div className="main-page">
      <header className="main-header">
        <nav className="main-navigation" aria-label="주요 메뉴">
          <Link className="navigation-link" to="/" aria-current="page">홈</Link>
          <Link className="navigation-link" to="/register">공고등록</Link>
          <Link className="navigation-link" to="/match">팀 매칭</Link>
          <Link className="navigation-link" to="/mypage">마이페이지</Link>
        </nav>
        <Link className="register-link" to="/register">공고 등록</Link>
      </header>

      <main className="main-content">
        <section className="nearby-jobs-section" aria-labelledby="nearby-jobs-title">
          <h1 id="nearby-jobs-title">내 주변 농촌 일자리</h1>
          <section className="map-container" aria-label="충남권 시안용 지도">
            <h2 className="map-title">충남권 지도</h2>
            <ul className="map-locations">
              <li className="map-location map-location-asan">아산시</li>
              <li className="map-location map-location-cheonan">천안시</li>
              <li className="map-location map-location-yesan">예산군</li>
            </ul>
            <p className="map-caption">시안용 지도</p>
          </section>
          <div className="map-actions">
            <Link className="team-matching-link" to="/match">팀매칭</Link>
            <Link className="map-register-link" to="/register">공고 등록</Link>
          </div>
        </section>

        <section className="nearby-posts-section" aria-labelledby="nearby-posts-title">
          <h2 id="nearby-posts-title">내 주변 공고</h2>
          <ul className="post-list">
            {samplePosts.map((post) => (
              <li className="post-list-item" key={post.id}>
                <article className="post-card">
                  <header className="post-header">
                    <span className="post-category">{post.category}</span>
                    <h3 className="post-compensation">{post.compensation}</h3>
                  </header>
                  <p className="post-title">{post.title}</p>
                  <p className="post-details">
                    <span className="post-location">{post.location}</span>
                    {' / '}
                    <span className="post-hours">{post.hours}</span>
                    {' '}
                    <span className="post-applicants">{post.applicants}</span>
                  </p>
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

export default Main;
