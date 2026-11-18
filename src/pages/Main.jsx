import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import NearbyMap from '../components/NearbyMap';
import { getPostings } from '../api/postApi';
import { getErrorMessage } from '../api/axios';
import { toPostCard } from '../api/postFormat';
import './Main.css';

const MAIN_POST_COUNT = 3;

const Main = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 다른 화면에서 넘겨준 안내 문구는 한 번만 보여 준다. 브라우저 기록에 남으면 새로고침해도 계속 보이므로 지운다.
  const [notice] = useState(location.state?.notice);
  useEffect(() => {
    if (location.state?.notice) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);
  // { posts, error }. 공고 목록은 로그인 없이 볼 수 있어 첫 화면에서 바로 불러온다.
  const [result, setResult] = useState(null);

  useEffect(() => {
    let ignore = false;
    getPostings({ statuses: ['RECRUITING'] })
      .then((data) => ({ posts: data.slice(0, MAIN_POST_COUNT).map(toPostCard), error: '' }))
      .catch((loadError) => ({ posts: [], error: getErrorMessage(loadError, '공고를 불러오지 못했습니다.') }))
      .then((next) => {
        if (!ignore) setResult(next);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const loading = result === null;
  const posts = result?.posts || [];
  const error = result?.error || '';

  const renderPosts = () => {
    if (loading) return <p className="page-state">공고를 불러오는 중입니다...</p>;
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
          <NearbyMap />
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
