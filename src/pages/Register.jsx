import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [selections, setSelections] = useState({
    workType: null,
    workerCount: null,
    compensationType: null,
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

  return (
    <div className="register-page">
      <header className="register-header">
        <nav className="register-navigation" aria-label="주요 메뉴">
          <Link className="navigation-link" to="/">홈</Link>
          <Link className="navigation-link" to="/register" aria-current="page">공고등록</Link>
          <Link className="navigation-link" to="/match">팀 매칭</Link>
          <Link className="navigation-link" to="/mypage">마이페이지</Link>
        </nav>
        <Link className="register-link" to="/register">공고 등록</Link>
      </header>

      <main className="register-content">
        <h1 className="register-title">공고 등록</h1>

        <form className="register-form">
          <div className="register-form-layout">
            <section className="work-details-section" aria-label="작업 정보">
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

              <fieldset className="work-schedule-group">
                <legend>일시</legend>
                <label className="schedule-input-group" htmlFor="work-date">
                  날짜
                  <input id="work-date" name="workDate" type="date" />
                </label>
                <label className="schedule-input-group" htmlFor="work-time">
                  시간
                  <input id="work-time" name="workTime" type="time" />
                </label>
              </fieldset>

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

              <div className="compensation-inputs">
                <label className="compensation-input-group" htmlFor="daily-wage">
                  유급 선택 시 일당
                  <input
                    id="daily-wage"
                    name="dailyWage"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="금액 입력 (원)"
                  />
                </label>
                <label className="compensation-input-group" htmlFor="volunteer-hours">
                  봉사 선택 시 봉사 시간
                  <input
                    id="volunteer-hours"
                    name="volunteerHours"
                    type="number"
                    min="0"
                    placeholder="시간 입력"
                  />
                </label>
              </div>
            </section>

            <section className="post-content-section" aria-label="공고 내용">
              <div className="post-input-group">
                <label htmlFor="post-title">공고 제목</label>
                <input id="post-title" name="title" type="text" />
              </div>

              <div className="post-image-upload-group">
                <label htmlFor="post-image">이미지 업로드</label>
                <input id="post-image" name="image" type="file" accept="image/*" />
              </div>

              <div className="post-input-group">
                <label htmlFor="post-description">상세 설명</label>
                <textarea id="post-description" name="description" rows="5" />
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
