import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import { createInvitation, createTeam, getMyTeams, getTeam } from '../api/teamApi';
import { getErrorMessage } from '../api/axios';
import './Match.css';

// 내 팀 목록에 팀원 이름까지 보여 주기 위해 팀별 현황을 함께 불러온다.
const loadMyTeams = async () => {
  const summaries = await getMyTeams();
  return Promise.all(summaries.map(async (summary) => ({
    ...summary,
    members: (await getTeam(summary.id)).members,
  })));
};

const formatDateTime = (value) => (value ? value.replace('T', ' ').slice(0, 16) : '');

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const Match = ({ matchMode, setMatchMode, selectedPost, selectedTeam, onSelectTeam }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [teams, setTeams] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [invitation, setInvitation] = useState(null);
  const [message, setMessage] = useState(location.state?.notice || '');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let ignore = false;
    loadMyTeams()
      .then((data) => ({ data, error: '' }))
      .catch((loadFailure) => ({ data: [], error: getErrorMessage(loadFailure, '팀 목록을 불러오지 못했습니다.') }))
      .then(({ data, error: failure }) => {
        if (ignore) return;
        setTeams(data);
        setLoadError(failure);
      });
    return () => {
      ignore = true;
    };
  }, []);

  // 고른 팀이 없으면 첫 번째 팀을 보여 준다.
  const activeTeam = teams?.find((team) => team.id === selectedTeam?.id) || teams?.[0] || null;
  const isOwner = activeTeam?.myRole === 'OWNER';

  const selectTeam = (team) => {
    onSelectTeam(team);
    setInvitation(null);
    setError('');
  };

  const handleCreateTeam = async (event) => {
    event.preventDefault();
    if (!teamName.trim()) {
      setError('팀 이름을 입력해 주세요.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const created = await createTeam(teamName.trim());
      const newTeam = { ...created, myRole: 'OWNER' };
      setTeams((current) => [newTeam, ...(current || [])]);
      selectTeam(newTeam);
      setIsCreating(false);
      setTeamName('');
      setMessage(`팀을 만들었습니다: ${created.name}. 초대 링크로 팀원을 모아 보세요.`);
    } catch (createError) {
      setError(getErrorMessage(createError, '팀을 만들지 못했습니다.'));
    } finally {
      setBusy(false);
    }
  };

  // 팀장만 초대 링크를 만들 수 있다. 만든 링크는 7일간 유효하다.
  const prepareInvitation = async () => {
    const created = await createInvitation(activeTeam.id);
    setInvitation(created);
    return created;
  };

  const handleCopyLink = async () => {
    setBusy(true);
    setError('');
    try {
      const created = await prepareInvitation();
      try {
        await navigator.clipboard.writeText(created.inviteUrl);
        setMessage(`초대 링크를 복사했습니다. ${formatDateTime(created.expiresAt)}까지 유효합니다.`);
      } catch {
        setMessage('클립보드에 복사하지 못했습니다. 아래 링크를 직접 복사해 주세요.');
      }
    } catch (inviteError) {
      setError(getErrorMessage(inviteError, '초대 링크를 만들지 못했습니다.'));
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    setBusy(true);
    setError('');
    try {
      const created = await prepareInvitation();
      if (navigator.share) {
        await navigator.share({
          title: `${created.teamName} 팀 초대`,
          text: `${created.teamName} 팀에 함께해요!`,
          url: created.inviteUrl,
        });
      } else {
        setMessage('이 브라우저는 공유 기능을 지원하지 않습니다. 아래 링크를 복사해 보내 주세요.');
      }
    } catch (shareError) {
      // 사용자가 공유 창을 닫은 경우(AbortError)는 오류로 보지 않는다.
      if (shareError?.name !== 'AbortError') {
        setError(getErrorMessage(shareError, '초대 링크를 공유하지 못했습니다.'));
      }
    } finally {
      setBusy(false);
    }
  };

  // 이미 만든 초대 링크를 아이콘 한 번으로 다시 복사한다. 복사되면 2초 동안 체크 표시로 바뀐다.
  const handleQuickCopy = async () => {
    try {
      await navigator.clipboard.writeText(invitation.inviteUrl);
      setMessage('');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setMessage('클립보드에 복사하지 못했습니다. 링크를 길게 눌러 직접 복사해 주세요.');
    }
  };

  const goSelectPost = () => {
    if (activeTeam) onSelectTeam(activeTeam);
    navigate('/match-select');
  };

  const renderTeams = () => {
    if (teams === null) return <p className="page-state">팀 목록을 불러오는 중입니다...</p>;
    if (loadError) return <p className="form-error" role="alert">{loadError}</p>;
    if (teams.length === 0) {
      return <p className="page-state">아직 속한 팀이 없습니다. 방 만들기로 팀을 만들거나 초대 링크로 가입해 주세요.</p>;
    }
    return teams.map((team) => (
      <article
        className={`waiting-room-card${team.id === activeTeam?.id ? ' is-selected' : ''}`}
        key={team.id}
        onClick={() => selectTeam(team)}
      >
        <h3 className="waiting-room-title">
          {team.name}
          <span className="waiting-room-role">{team.myRole === 'OWNER' ? '팀장' : '팀원'}</span>
        </h3>
        <p className="waiting-room-count">팀원 {team.memberCount}명 · 팀장 {team.ownerNickname}</p>
        <ul className="waiting-room-members" aria-label="팀원 목록">
          {team.members.map((member) => (
            <li className="waiting-room-member" key={member.memberId}>
              {member.nickname}
              {member.role === 'OWNER' && <div style={{ marginTop: '4px', fontSize: '10px', opacity: 0.8 }}>[팀장]</div>}
            </li>
          ))}
        </ul>
        {/* 팀 단위 공고 지원 API가 백엔드에 아직 없다 */}
        <button className="join-room-button" type="button" disabled title="팀 단위 지원은 아직 지원하지 않습니다">
          지원하기
        </button>
      </article>
    ));
  };

  return (
    <div className="match-page">
      <Header />

      <main className="match-content">
        <div className="match-title-row">
          <h1 className="match-title">팀 매칭</h1>
          <button className="create-room-button" type="button" onClick={() => setIsCreating((open) => !open)}>
            {isCreating ? '닫기' : '방 만들기'}
          </button>
        </div>

        {isCreating && (
          <form className="team-create-form" onSubmit={handleCreateTeam}>
            <label htmlFor="team-name">팀 이름</label>
            <input
              id="team-name"
              type="text"
              maxLength={50}
              placeholder="예: 딸기 수확 팀"
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
            />
            <button type="submit" disabled={busy}>{busy ? '만드는 중...' : '만들기'}</button>
          </form>
        )}

        {message && <p className="form-notice" role="status">{message}</p>}
        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="match-layout">
          <section className="waiting-rooms-section" aria-labelledby="waiting-rooms-title">
            <h2 id="waiting-rooms-title">내 팀</h2>
            {renderTeams()}
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
                  goSelectPost();
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
              {activeTeam && <p>선택한 팀: {activeTeam.name} ({activeTeam.memberCount}명)</p>}
              {matchMode === 'postFirst' && selectedPost && (
                <p>{selectedPost.title}{selectedPost.farm && ` (${selectedPost.farm})`}</p>
              )}
              {matchMode === 'teamFirst' && (
                <button
                  className="load-post-button"
                  type="button"
                  disabled={!activeTeam}
                  onClick={goSelectPost}
                >
                  공고 불러오기
                </button>
              )}
              <div className="team-post-actions">
                <button className="copy-link-button" type="button" onClick={handleCopyLink} disabled={!isOwner || busy}>
                  링크 복사
                </button>
                <button className="share-button" type="button" onClick={handleShare} disabled={!isOwner || busy}>
                  공유
                </button>
              </div>
              {activeTeam && !isOwner && <p className="team-invite-hint">초대 링크는 팀장만 만들 수 있습니다.</p>}
              {invitation && (
                <p className="team-invite-link">
                  <button
                    className={`invite-copy-icon${copied ? ' is-copied' : ''}`}
                    type="button"
                    onClick={handleQuickCopy}
                    aria-label={copied ? '복사됨' : '초대 링크 복사'}
                    title={copied ? '복사됨' : '초대 링크 복사'}
                  >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                  </button>
                  <a href={invitation.inviteUrl}>{invitation.inviteUrl}</a>
                  {copied && <span className="invite-copied-text">복사됨</span>}
                </p>
              )}
            </section>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Match;
