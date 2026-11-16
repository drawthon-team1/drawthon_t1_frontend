import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../auth/AuthContext';
import { applyPosting, getPosting, withdrawPosting } from '../api/postApi';
import { getErrorMessage } from '../api/axios';
import {
  formatCompensation, formatHours, formatLocation, formatPeriod, RECRUITMENT_STATUS_LABEL, REWARD_TYPE_LABEL,
} from '../api/postFormat';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  // { id, post, error }: 주소의 공고 ID가 바뀌면 이전 결과를 쓰지 않는다.
  const [loaded, setLoaded] = useState(null);
  const [actionError, setActionError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // 신청 내역 조회 API가 없어서, 이 화면에서 신청에 성공했을 때만 완료 상태로 표시한다.
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    let ignore = false;
    getPosting(id)
      .then((data) => ({ id, post: data, error: '' }))
      .catch((error) => ({ id, post: null, error: getErrorMessage(error, '공고를 불러오지 못했습니다.') }))
      .then((next) => { if (!ignore) setLoaded(next); });
    return () => { ignore = true; };
  }, [id]);

  const current = loaded?.id === id ? loaded : null;
  const post = current?.post;
  const loadError = current?.error;
  const setPost = (update) => setLoaded((prev) => ({ ...prev, post: update(prev.post) }));

  const runAction = async (action, onSuccess) => {
    setActionError('');
    setSubmitting(true);
    try {
      const updated = await action(id);
      setPost((current) => ({ ...current, applicantCount: updated.applicantCount }));
      onSuccess();
    } catch (error) {
      const message = getErrorMessage(error);
      // 새로고침 등으로 신청 여부를 모르는 상태에서 다시 신청하면 409가 온다. 이미 신청한 상태로 보여 주고 취소할 수 있게 한다.
      if (action === applyPosting && error.response?.status === 409 && message.includes('이미 신청')) {
        setApplied(true);
        setActionError('이미 신청한 공고입니다.');
      } else {
        setActionError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loadError) {
    return (
      <div className="post-detail-page">
        <Header />
        <p className="page-state form-error" role="alert">{loadError}</p>
      </div>
    );
  }
  if (!post) {
    return (
      <div className="post-detail-page">
        <Header />
        <p className="page-state">공고를 불러오는 중입니다...</p>
      </div>
    );
  }

  const isVolunteer = post.rewardType === 'VOLUNTEER_HOURS';
  const applyLabel = isVolunteer ? '봉사 신청하기' : '일자리 신청하기';
  const canApply = user?.role === 'USER' && !applied
    && (post.recruitmentStatus === 'RECRUITING' || post.recruitmentStatus === 'CLOSING_SOON');

  return (
    <div className="post-detail-page">
      <Header />

      <main className="post-detail-content">
        <h1 className="post-detail-title">{post.programTitle}</h1>

        {applied ? (
          <section className="result-panel" aria-live="polite">
            <h2>{actionError === '이미 신청한 공고입니다.' ? '이미 신청한 공고입니다' : '신청이 완료되었습니다'}</h2>
            <p>{post.programTitle}</p>
            <p>리워드: {formatCompensation(post)} · 일정: {formatPeriod(post.programStartDate, post.programEndDate)}</p>
            {actionError && actionError !== '이미 신청한 공고입니다.' && <p className="form-error" role="alert">{actionError}</p>}
            <div className="result-panel-actions">
              <Link className="primary" to="/">메인으로</Link>
              <button
                type="button"
                disabled={submitting}
                onClick={() => runAction(withdrawPosting, () => setApplied(false))}
              >
                신청 취소
              </button>
            </div>
          </section>
        ) : (
          <div className="post-detail-layout">
            <section className="post-description-section" aria-labelledby="post-description-title">
              <figure className="post-image">
                <figcaption>공고 이미지 영역</figcaption>
              </figure>
              <h2 id="post-description-title">상세 설명</h2>
              <p className="post-description" style={{ whiteSpace: 'pre-line' }}>
                {post.programContent || '상세 설명이 없습니다.'}
              </p>
            </section>

            <section className="post-summary-section" aria-label="공고 정보">
              <header className="post-summary-header">
                <span className="post-category">{REWARD_TYPE_LABEL[post.rewardType]}</span>
                <h2 className="post-compensation">{formatCompensation(post)}</h2>
              </header>

              <dl className="post-information">
                <div className="post-information-row">
                  <dt>일정</dt>
                  <dd>{formatPeriod(post.programStartDate, post.programEndDate)}</dd>
                </div>
                <div className="post-information-row">
                  <dt>시간</dt>
                  <dd>{formatHours(post)}</dd>
                </div>
                <div className="post-information-row">
                  <dt>모집 기간</dt>
                  <dd>{formatPeriod(post.recruitmentStartDate, post.recruitmentEndDate)}</dd>
                </div>
                <div className="post-information-row">
                  <dt>신청 현황</dt>
                  <dd>
                    {post.applicantCount ?? 0}/{post.recruitmentCapacity ?? '-'}명
                    {' '}({RECRUITMENT_STATUS_LABEL[post.recruitmentStatus]})
                  </dd>
                </div>
                <div className="post-information-row">
                  <dt>위치</dt>
                  <dd>{formatLocation(post)}</dd>
                </div>
                <div className="post-information-row">
                  <dt>선정 방식</dt>
                  <dd>선착순</dd>
                </div>
              </dl>

              {actionError && <p className="form-error" role="alert">{actionError}</p>}
              {user?.role === 'ADMIN' && <p className="form-notice">관리자 계정은 공고에 신청할 수 없습니다.</p>}

              <button className="post-more-details-button" type="button" disabled>
                상세 보기
              </button>
              <button
                className="post-apply-button"
                type="button"
                disabled={!canApply || submitting}
                onClick={() => runAction(applyPosting, () => setApplied(true))}
              >
                {submitting ? '신청 중...' : applyLabel}
              </button>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default PostDetail;
