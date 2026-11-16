import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

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

  // 폼 입력 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="register-page">
      <header className="register-header">
        <nav className="register-navigation" aria-label="주요 메뉴">
          <Link className="navigation-link" to="/">홈</Link>
          <Link className="navigation-link" to="/register" aria-current="page">공고등록</Link>
          <Link className="navigation-link" to="/match">팀 매칭</Link>
          <Link className="navigation-link" to="/mypage">마이페이지</Link>
        </nav>
      </header>

      <main className="register-content">
        <h1 className="register-title">공고 등록</h1>

        <form className="register-form">
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
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </div>

              {/* 상세 설명 */}
              <div className="post-input-group">
                <div className="description-header">
                  <label htmlFor="post-description">상세 설명</label>
                  <button className="ai-write-button" type="button">
                    AI 공고 작성
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
              </div>
            </section>
          </div>

          <button className="register-submit-button" type="submit" disabled>
            게시하기
          </button>
        </form>
      </main>
    </div>
  );
};

export default Register;
