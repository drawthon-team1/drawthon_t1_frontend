import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Match.css';

const Match = ({ matchMode, setMatchMode, selectedPost }) => {
  const navigate = useNavigate();
  // 팀 모집 기능이 연결되기 전까지 미완료 상태로 유지해 주세요.
  const [isTeamFull] = useState(false);

  return (
    <div className="match-page">
      <header className="match-header">
        <nav className="match-navigation" aria-label="주요 메뉴">
          <Link className="navigation-link" to="/">홈</Link>
          <Link className="navigation-link" to="/register">공고등록</Link>
          <Link className="navigation-link" to="/match" aria-current="page">팀 매칭</Link>
          <Link className="navigation-link" to="/mypage">마이페이지</Link>
        </nav>
      </header>

      <main className="match-content">
        <div className="match-title-row">
          <h1 className="match-title">팀 매칭</h1>
          <button className="create-room-button" type="button" disabled>
            방 만들기
          </button>
        </div>

        <div className="match-layout">
          <section className="waiting-rooms-section" aria-labelledby="waiting-rooms-title">
            <h2 id="waiting-rooms-title">매칭 대기방</h2>
            <article className="waiting-room-card">
              <h3 className="waiting-room-title">딸기 수확 팀 구합니다.</h3>
              <p className="waiting-room-count">팀원 2/4명</p>
              <ul className="waiting-room-members" aria-label="팀원 목록">
                <li className="waiting-room-member">김지원</li>
                <li className="waiting-room-member">안회원</li>
                <li className="waiting-room-member">빈 자리</li>
                <li className="waiting-room-member">빈 자리</li>
              </ul>
              <button className="join-room-button" type="button" disabled={!isTeamFull || selectedPost === null}>
                지원하기
              </button>
            </article>
          </section>

          <section className="match-options-section" aria-labelledby="match-method-title">
            <h2 id="match-method-title">매칭 방식</h2>
            <div className="match-method-options">
              <button
                className="match-method-button"
                type="button"
                aria-pressed={matchMode === 'postFirst'}
                onClick={() => {
                  setMatchMode('postFirst');
                  navigate('/match-select');
                }}
              >
                공고
              </button>
              <button
                className="match-method-button"
                type="button"
                aria-pressed={matchMode === 'teamFirst'}
                onClick={() => setMatchMode('teamFirst')}
              >
                팀원
              </button>
            </div>

            <section className="team-post-section" aria-labelledby="team-post-title">
              <h3 id="team-post-title">팀 공고</h3>
              {matchMode === 'postFirst' && selectedPost && (
                <p>{selectedPost.title} ({selectedPost.farm})</p>
              )}
              {matchMode === 'teamFirst' && (
                <button
                  className="load-post-button"
                  type="button"
                  disabled={!isTeamFull}
                  onClick={() => navigate('/match-select')}
                >
                  공고 불러오기
                </button>
              )}
              <div className="team-post-actions">
                <button className="copy-link-button" type="button">
                  링크 복사
                </button>
                <button className="share-button" type="button">
                  공유
                </button>
              </div>
            </section>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Match;
