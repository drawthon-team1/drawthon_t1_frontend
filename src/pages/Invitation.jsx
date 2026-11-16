import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { acceptInvitation, getInvitation } from '../api/teamApi';
import { getErrorMessage } from '../api/axios';

const formatDateTime = (value) => (value ? value.replace('T', ' ').slice(0, 16) : '');

/** 팀 초대 링크(/invitations/:token)로 들어온 회원이 팀 정보를 보고 가입하는 화면 */
const Invitation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(null);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');

  useEffect(() => {
    let ignore = false;
    getInvitation(token)
      .then((invitation) => ({ token, invitation, error: '' }))
      .catch((error) => ({ token, invitation: null, error: getErrorMessage(error, '초대 정보를 불러오지 못했습니다.') }))
      .then((next) => { if (!ignore) setLoaded(next); });
    return () => { ignore = true; };
  }, [token]);

  const current = loaded?.token === token ? loaded : null;
  const invitation = current?.invitation;

  const handleJoin = async () => {
    setJoinError('');
    setJoining(true);
    try {
      await acceptInvitation(token);
      navigate('/match', { state: { notice: `팀에 가입했습니다: ${invitation.teamName}` } });
    } catch (error) {
      setJoinError(getErrorMessage(error, '팀에 가입하지 못했습니다.'));
    } finally {
      setJoining(false);
    }
  };

  const renderBody = () => {
    if (!current) return <p className="page-state">초대 정보를 불러오는 중입니다...</p>;
    if (current.error) {
      return (
        <section className="result-panel">
          <h2>초대 링크를 열 수 없습니다</h2>
          <p className="form-error" role="alert">{current.error}</p>
          <div className="result-panel-actions"><Link to="/match">팀 매칭으로</Link></div>
        </section>
      );
    }
    return (
      <section className="result-panel" aria-live="polite">
        <h2>팀 초대: {invitation.teamName}</h2>
        <p>팀장 {invitation.ownerNickname} · 현재 {invitation.memberCount}명</p>
        <p>링크 유효 기간: {formatDateTime(invitation.expiresAt)}까지</p>
        {joinError && <p className="form-error" role="alert">{joinError}</p>}
        <div className="result-panel-actions">
          {invitation.alreadyJoined ? (
            <>
              <p className="form-notice">이미 가입한 팀입니다.</p>
              <Link className="primary" to="/match">팀 매칭으로</Link>
            </>
          ) : (
            <>
              <button className="primary" type="button" onClick={handleJoin} disabled={joining}>
                {joining ? '가입 중...' : '팀 가입하기'}
              </button>
              <Link to="/">다음에 하기</Link>
            </>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="invitation-page">
      <Header />
      <main>{renderBody()}</main>
    </div>
  );
};

export default Invitation;
