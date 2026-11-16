import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { createPosting, createPostingDraft } from '../api/postApi';
import { getErrorMessage } from '../api/axios';
import './Register.css';

// 화면 선택지 -> 백엔드 값. 화면의 작업 종류는 백엔드 분류(수확/선별·포장/파종·재배/제초/기타)와 달라
// "비닐 씌우기"는 기타(ETC)로 보낸다.
const WORK_TYPE_VALUES = { harvest: 'HARVEST', weeding: 'WEEDING', greenhouse: 'ETC', other: 'ETC' };
const WORK_TYPE_OPTIONS = { HARVEST: 'harvest', WEEDING: 'weeding' };
const CAPACITY_VALUES = { 1: 1, 2: 2, 3: 3, '4-plus': 4 };
const toWorkerCountOption = (capacity) => {
  if (!capacity) return null;
  return capacity >= 4 ? '4-plus' : String(capacity);
};

/** 화면 입력값을 공고 생성 API(POST /api/v1/posting) 요청으로 바꾼다. 빠진 값이 있으면 오류 문구 목록을 돌려준다. */
const toCreateRequest = (selections, formData) => {
  const errors = [];
  if (!formData.title.trim()) errors.push('공고 제목을 입력해 주세요.');
  if (!formData.activityDate) errors.push('실제 활동 날짜를 입력해 주세요.');
  if (!formData.recruitStartDate || !formData.recruitEndDate) errors.push('모집 시작·마감 날짜를 입력해 주세요.');
  if (formData.recruitStartDate && formData.recruitEndDate && formData.recruitEndDate < formData.recruitStartDate) {
    errors.push('모집 마감 날짜는 시작 날짜보다 빠를 수 없습니다.');
  }
  if (!selections.workerCount) errors.push('모집 인원을 선택해 주세요.');
  if (!selections.compensationType) errors.push('보상 종류를 선택해 주세요.');

  const isPaid = selections.compensationType === 'paid';
  const reward = Number(isPaid ? formData.dailyWage : formData.volunteerHours);
  if (selections.compensationType && !(reward > 0)) {
    errors.push(isPaid ? '일당을 입력해 주세요.' : '봉사 시간을 입력해 주세요.');
  }

  return {
    errors,
    request: {
      programTitle: formData.title.trim(),
      programContent: formData.description,
      // 화면의 실제 활동 일시는 하루짜리라 봉사 시작일과 종료일을 같은 날로 보낸다.
      programStartDate: formData.activityDate,
      programEndDate: formData.activityDate,
      activityStartTime: formData.activityTime || null,
      // 백엔드는 모집 기간을 날짜로만 저장하므로 모집 시작·마감 시간은 보내지 않는다.
      recruitmentStartDate: formData.recruitStartDate,
      recruitmentEndDate: formData.recruitEndDate,
      recruitmentCapacity: CAPACITY_VALUES[selections.workerCount],
      activityPlace: formData.address || null,
      address: formData.address || null,
      rewardType: isPaid ? 'WAGE' : 'VOLUNTEER_HOURS',
      reward,
      workType: WORK_TYPE_VALUES[selections.workType] || 'ETC',
    },
  };
};

const Register = () => {
  // 기본 선택 사항들
  const [selections, setSelections] = useState({
    workType: null,
    workerCount: null,
    compensationType: null,
  });

  // 폼 입력 데이터
  const [formData, setFormData] = useState({
    address: '',           // 주소 입력
    phone: '',             // 연락처
    recruitStartDate: '',
    recruitStartTime: '',
    recruitEndDate: '',
    recruitEndTime: '',
    activityDate: '',      // 실제 활동 일시 - 날짜
    activityTime: '',      // 실제 활동 일시 - 시간
    dailyWage: '',         // 유급 선택 시 일당
    volunteerHours: '',    // 봉사 선택 시 봉사 시간
    title: '',             // 공고 제목
    image: '',             // 이미지
    description: '',       // 상세 설명
  });

  const optionProps = (name, value) => ({
    type: 'radio',
    name,
    value,
    checked: selections[name] === value,
    onChange: () => setSelections((current) => ({ ...current, [name]: value })),
    onClick: () => {
      if (selections[name] === value) {
        setSelections((current) => ({ ...current, [name]: null }));
      }
    },
    onKeyDown: (event) => {
      if (event.key === ' ' && selections[name] === value) {
        event.preventDefault();
        setSelections((current) => ({ ...current, [name]: null }));
      }
    },
  });

  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);

  // 폼 입력 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { errors: validationErrors, request } = toCreateRequest(selections, formData);
    setErrors(validationErrors);
    if (validationErrors.length > 0) return;

    setSubmitting(true);
    try {
      setCreated(await createPosting(request));
    } catch (error) {
      setErrors([getErrorMessage(error, '공고를 등록하지 못했습니다.')]);
    } finally {
      setSubmitting(false);
    }
  };

  // 상세 설명에 적은 자연어로 AI 초안을 받아 빈 입력칸을 채운다. 초안은 저장되지 않는다.
  const handleAiDraft = async () => {
    if (!formData.description.trim()) {
      setAiMessages(['상세 설명에 공고 내용을 자유롭게 적은 뒤 눌러 주세요.']);
      return;
    }
    setAiLoading(true);
    setAiMessages([]);
    try {
      const draft = await createPostingDraft(formData.description);
      setFormData((current) => ({
        ...current,
        title: draft.programTitle || current.title,
        description: draft.programContent || current.description,
        activityDate: draft.programStartDate || current.activityDate,
        activityTime: draft.activityStartTime || current.activityTime,
        recruitStartDate: draft.recruitmentStartDate || current.recruitStartDate,
        recruitEndDate: draft.recruitmentEndDate || current.recruitEndDate,
        address: draft.address || draft.activityPlace || current.address,
        dailyWage: draft.rewardType === 'WAGE' && draft.reward ? String(draft.reward) : current.dailyWage,
        volunteerHours: draft.rewardType === 'VOLUNTEER_HOURS' && draft.reward ? String(draft.reward) : current.volunteerHours,
      }));
      setSelections((current) => ({
        ...current,
        workType: draft.workType ? (WORK_TYPE_OPTIONS[draft.workType] || 'other') : current.workType,
        workerCount: toWorkerCountOption(draft.recruitmentCapacity) || current.workerCount,
        compensationType: draft.rewardType ? (draft.rewardType === 'WAGE' ? 'paid' : 'volunteer') : current.compensationType,
      }));
      setAiMessages([
        'AI 초안을 채웠습니다. 내용을 확인한 뒤 게시해 주세요.',
        ...(draft.missingFields?.length ? [`직접 입력이 필요한 항목: ${draft.missingFields.join(', ')}`] : []),
        ...(draft.warnings || []),
      ]);
    } catch (error) {
      setAiMessages([getErrorMessage(error, 'AI 초안을 만들지 못했습니다.')]);
    } finally {
      setAiLoading(false);
    }
  };

  if (created) {
    return (
      <div className="register-page">
        <Header />
        <main className="register-content">
          <section className="result-panel" aria-live="polite">
            <h2>공고가 등록되었습니다</h2>
            <p>{created.programTitle}</p>
            <div className="result-panel-actions">
              <Link className="primary" to={`/detail/${created.id}`}>등록한 공고 보기</Link>
              <Link to="/">메인으로</Link>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="register-page">
      <Header />

      <main className="register-content">
        <h1 className="register-title">공고 등록</h1>

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <div className="register-form-layout">
            <section className="work-details-section" aria-label="작업 정보">
              {/* 작업 종류 */}
              <fieldset className="work-type-group">
                <legend>작업 종류</legend>
                <label className="work-type-option">
                  <input {...optionProps('workType', 'harvest')} />
                  농작물 수확
                </label>
                <label className="work-type-option">
                  <input {...optionProps('workType', 'weeding')} />
                  밭 메기
                </label>
                <label className="work-type-option">
                  <input {...optionProps('workType', 'greenhouse')} />
                  비닐 씌우기
                </label>
                <label className="work-type-option">
                  <input {...optionProps('workType', 'other')} />
                  기타
                </label>
              </fieldset>

              {/* 모집 일시 */}
              <fieldset className="work-schedule-group">
                <legend>모집 일시</legend>
                <label className="schedule-input-group" htmlFor="recruit-start-date">
                  시작 날짜
                  <input
                    id="recruit-start-date"
                    name="recruitStartDate"
                    type="date"
                    className="form-input"
                    value={formData.recruitStartDate}
                    onChange={handleInputChange}
                  />
                </label>
                <label className="schedule-input-group" htmlFor="recruit-start-time">
                  시작 시간
                  <input
                    id="recruit-start-time"
                    name="recruitStartTime"
                    type="time"
                    className="form-input"
                    value={formData.recruitStartTime}
                    onChange={handleInputChange}
                  />
                </label>
                <label className="schedule-input-group" htmlFor="recruit-end-date">
                  마감 날짜
                  <input
                    id="recruit-end-date"
                    name="recruitEndDate"
                    type="date"
                    className="form-input"
                    value={formData.recruitEndDate}
                    onChange={handleInputChange}
                  />
                </label>
                <label className="schedule-input-group" htmlFor="recruit-end-time">
                  마감 시간
                  <input
                    id="recruit-end-time"
                    name="recruitEndTime"
                    type="time"
                    className="form-input"
                    value={formData.recruitEndTime}
                    onChange={handleInputChange}
                  />
                </label>
              </fieldset>

              {/* 실제 활동 일시 */}
              <fieldset className="work-schedule-group">
                <legend>실제 활동 일시</legend>
                <label className="schedule-input-group" htmlFor="activity-date">
                  날짜
                  <input
                    id="activity-date"
                    name="activityDate"
                    type="date"
                    className="form-input"
                    value={formData.activityDate}
                    onChange={handleInputChange}
                  />
                </label>
                <label className="schedule-input-group" htmlFor="activity-time">
                  시간
                  <input
                    id="activity-time"
                    name="activityTime"
                    type="time"
                    className="form-input"
                    value={formData.activityTime}
                    onChange={handleInputChange}
                  />
                </label>
              </fieldset>

              {/* 모집 인원 */}
              <fieldset className="worker-count-group">
                <legend>모집 인원</legend>
                <label className="worker-count-option">
                  <input {...optionProps('workerCount', '1')} />
                  1명
                </label>
                <label className="worker-count-option">
                  <input {...optionProps('workerCount', '2')} />
                  2명
                </label>
                <label className="worker-count-option">
                  <input {...optionProps('workerCount', '3')} />
                  3명
                </label>
                <label className="worker-count-option">
                  <input {...optionProps('workerCount', '4-plus')} />
                  4명 이상
                </label>
              </fieldset>

              {/* 주소 입력 */}
              <div className="post-input-group">
                <label htmlFor="address">주소 입력</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="form-input"
                  placeholder="주소를 입력하세요"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              {/* 연락처 기입 */}
              <div className="post-input-group">
                <label htmlFor="phone">연락처 기입</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="form-input"
                  placeholder="연락처를 입력하세요"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <p className="image-helper-text">연락처는 아직 서버에 저장되지 않습니다.</p>
              </div>

              {/* 보상 종류 */}
              <fieldset className="compensation-type-group">
                <legend>보상 종류</legend>
                <label className="compensation-type-option">
                  <input {...optionProps('compensationType', 'paid')} />
                  유급
                </label>
                <label className="compensation-type-option">
                  <input {...optionProps('compensationType', 'volunteer')} />
                  봉사
                </label>
              </fieldset>

              {/* 보상 상세 입력 (조건부 렌더링) */}
              <div className="compensation-inputs">
                {/* 유급 선택 시 일당 입력칸 + "원" 표시 */}
                {selections.compensationType === 'paid' && (
                  <div className="compensation-input-wrapper">
                    <label className="compensation-input-group" htmlFor="daily-wage">
                      <input
                        id="daily-wage"
                        name="dailyWage"
                        type="number"
                        className="form-input"
                        min="0"
                        step="1000"
                        placeholder="금액 입력"
                        value={formData.dailyWage}
                        onChange={handleInputChange}
                      />
                      <span className="compensation-unit">원</span>
                    </label>
                  </div>
                )}
                
                {/* 봉사 선택 시 봉사 시간 입력칸 + "시간" 표시 */}
                {selections.compensationType === 'volunteer' && (
                  <div className="compensation-input-wrapper">
                    <label className="compensation-input-group" htmlFor="volunteer-hours">
                      <input
                        id="volunteer-hours"
                        name="volunteerHours"
                        type="number"
                        className="form-input"
                        min="0"
                        placeholder="시간 입력"
                        value={formData.volunteerHours}
                        onChange={handleInputChange}
                      />
                      <span className="compensation-unit">시간</span>
                    </label>
                  </div>
                )}
              </div>
            </section>

            <section className="post-content-section" aria-label="공고 내용">
              {/* 공고 제목 */}
              <div className="post-input-group">
                <label htmlFor="post-title">공고 제목</label>
                <input
                  id="post-title"
                  name="title"
                  type="text"
                  className="form-input"
                  placeholder="공고 제목을 입력하세요"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              {/* 이미지 업로드 */}
              <div className="post-image-upload-group">
                <label htmlFor="post-image">농장 사진 등록</label>
                <p className="image-helper-text">농장 사진 또는 활동과 관련한 사진을 올리면 신청자들에게 도움이 됩니다.</p>
                <input
                  id="post-image"
                  name="image"
                  type="file"
                  className="form-input"
                  accept="image/*"
                />
                <p className="image-helper-text">이미지 업로드는 아직 서버에 저장되지 않습니다.</p>
              </div>

              {/* 상세 설명 */}
              <div className="post-input-group">
                <div className="description-header">
                  <label htmlFor="post-description">상세 설명</label>
                  <button className="ai-write-button" type="button" onClick={handleAiDraft} disabled={aiLoading}>
                    {aiLoading ? 'AI 작성 중...' : 'AI 공고 작성'}
                  </button>
                </div>
                <textarea
                  id="post-description"
                  name="description"
                  className="form-input"
                  rows="5"
                  placeholder="상세 설명을 입력하세요"
                  value={formData.description}
                  onChange={handleInputChange}
                />
                {aiMessages.map((message) => <p className="form-notice" key={message}>{message}</p>)}
              </div>
            </section>
          </div>

          {errors.map((message) => <p className="form-error" role="alert" key={message}>{message}</p>)}
          <button className="register-submit-button" type="submit" disabled={submitting}>
            {submitting ? '게시 중...' : '게시하기'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Register;
