import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../auth/AuthContext';
import { getPostings } from '../api/postApi';
import { getErrorMessage } from '../api/axios';
import { toPostCard } from '../api/postFormat';
import './Main.css';

const MAIN_POST_COUNT = 3;

const Main = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  // 다른 화면에서 넘겨준 안내 문구는 한 번만 보여 준다. 브라우저 기록에 남으면 새로고침해도 계속 보이므로 지운다.
  const [notice] = useState(location.state?.notice);
  useEffect(() => {
    if (location.state?.notice) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);
  // { userId, posts, error }: 어떤 회원으로 불러온 결과인지 함께 저장한다.
  const [result, setResult] = useState(null);
  const userId = user?.id;

  // 공고 API는 로그인이 필요하므로 로그인한 경우에만 불러온다.
  useEffect(() => {
    if (!userId) return undefined;
    let ignore = false;
    getPostings({ statuses: ['RECRUITING'] })
      .then((data) => ({ userId, posts: data.slice(0, MAIN_POST_COUNT).map(toPostCard), error: '' }))
      .catch((loadError) => ({ userId, posts: [], error: getErrorMessage(loadError, '공고를 불러오지 못했습니다.') }))
      .then((next) => {
        if (!ignore) setResult(next);
      });
    return () => {
      ignore = true;
    };
  }, [userId]);

  // 로그인하지 않았으면 userId가 없고 result도 null이라, 둘 다 있을 때만 결과를 쓴다.
  const current = userId && result?.userId === userId ? result : null;
  const loading = Boolean(userId) && !current;
  const posts = current ? current.posts : [];
  const error = current ? current.error : '';

  const renderPosts = () => {
    if (authLoading || loading) return <p className="page-state">공고를 불러오는 중입니다...</p>;
    if (!user) {
      return (
        <p className="page-state">
          <Link to="/login">로그인</Link>하면 모집 중인 공고를 볼 수 있어요.
        </p>
      );
    }
    if (error) return <p className="form-error" role="alert">{error}</p>;
    if (posts.length === 0) return <p className="page-state">모집 중인 공고가 없습니다.</p>;

    return (
      <ul className="post-list">
        {posts.map((post) => (
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
              <button
                className="post-detail-button"
                type="button"
                onClick={() => navigate(`/detail/${post.id}`)}
                style={{ cursor: 'pointer' }}
              >
                상세 보기
              </button>
            </article>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="main-page">
      <Header />
      {/* main-content는 2칸 그리드라, 안내 문구는 그 밖에 둬야 지도 배치가 밀리지 않는다 */}
      {notice && <p className="form-notice main-notice" role="status">{notice}</p>}

      <main className="main-content">

        <section className="nearby-jobs-section" aria-labelledby="nearby-jobs-title">
          <h1 id="nearby-jobs-title">내 주변 농촌 일자리</h1>
          {/* TODO: 카카오맵 연동 전까지는 시안용 지도를 그대로 둔다 */}
          <section className="map-container" aria-label="충남권 시안용 지도">
            <h2 className="map-title">충남권 지도</h2>
            <ul className="map-locations">
              <li className="map-location map-location-asan">아산시</li>
              <li className="map-location map-location-cheonan">천안시</li>
              <li className="map-location map-location-yesan">예산군</li>
            </ul>
            <p className="map-caption">시안용 지도</p>
          </section>
        </section>

        <section className="nearby-posts-section" aria-labelledby="nearby-posts-title">
          <div id="nearby-posts-title">
            <h2>모집 중인 공고</h2>
            <Link className="more-link" to="/postings">더 보기 &gt;</Link>
          </div>
          {renderPosts()}
        </section>
      </main>
    </div>
  );
};

export default Main;
