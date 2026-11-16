import { Link } from 'react-router-dom';
import './PostDetail.css';

const PostDetail = () => {
  return (
    <div className="post-detail-page">
      <header className="post-detail-header">
        <nav className="post-detail-navigation" aria-label="주요 메뉴">
          <Link className="navigation-link" to="/">홈</Link>
          <Link className="navigation-link" to="/register">공고등록</Link>
          <Link className="navigation-link" to="/match">팀 매칭</Link>
          <Link className="navigation-link" to="/mypage">마이페이지</Link>
        </nav>
      </header>

      <main className="post-detail-content">
        <h1 className="post-detail-title">
          [밭 메기] 텃밭 잡초 제거 (푸른들 농원)
        </h1>

        <div className="post-detail-layout">
          <section className="post-description-section" aria-labelledby="post-description-title">
            <figure className="post-image">
              <figcaption>공고 이미지 영역</figcaption>
            </figure>
            <h2 id="post-description-title">상세 설명</h2>
            <p className="post-description">
              텃밭의 잡초를 제거하고 작업 구역을 정리합니다.<br />
              작업 시작 전 집결 장소에서 작업 방법을 안내합니다.
            </p>
          </section>

          <section className="post-summary-section" aria-label="공고 정보">
            <header className="post-summary-header">
              <span className="post-category">봉사</span>
              <h2 className="post-compensation">봉사 3시간</h2>
            </header>

            <dl className="post-information">
              <div className="post-information-row">
                <dt>일정</dt>
                <dd><time dateTime="2026-11-21">2026.11.21</time></dd>
              </div>
              <div className="post-information-row">
                <dt>시간</dt>
                <dd>09:00~12:00</dd>
              </div>
              <div className="post-information-row">
                <dt>신청 현황</dt>
                <dd>1/3명</dd>
              </div>
              <div className="post-information-row">
                <dt>위치</dt>
                <dd>충남 천안시</dd>
              </div>
              <div className="post-information-row">
                <dt>선정 방식</dt>
                <dd>선착순</dd>
              </div>
            </dl>

            <button className="post-more-details-button" type="button" disabled>
              상세 보기
            </button>
            <button className="post-apply-button" type="button" disabled>
              봉사 신청하기
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PostDetail;
