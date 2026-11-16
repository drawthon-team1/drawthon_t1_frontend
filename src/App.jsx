import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// pages 폴더에 있는 실제 9개의 화면(컴포넌트) 파일 이름에 맞춰서 불러옵니다.
import Main from './pages/Main';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Register from './pages/Register';
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';
import Match from './pages/Match';
import MatchSelect from './pages/MatchSelect';
import MyPage from './pages/MyPage';
import Invitation from './pages/Invitation';
import { AuthProvider } from './auth/AuthContext';
import RequireAuth from './auth/RequireAuth';

function App() {
  const [matchMode, setMatchMode] = useState('postFirst');
  const [selectedPost, setSelectedPost] = useState(null);
  // 팀 매칭 화면에서 고른 내 팀. 공고 선택 화면에서 팀 인원을 보여 주는 데 쓴다.
  const [selectedTeam, setSelectedTeam] = useState(null);

  return (
    <BrowserRouter>
      <AuthProvider>
      <Routes>
        {/* path="주소"를 치면 element={<컴포넌트 />}를 보여줍니다 */}
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* 공고 관련 페이지. 공고 API는 로그인이 필요하고, 공고 등록은 ADMIN만 가능하다 */}
        <Route path="/postings" element={<RequireAuth><PostList /></RequireAuth>} />
        <Route path="/detail/:id" element={<RequireAuth><PostDetail /></RequireAuth>} />
        <Route path="/register" element={<RequireAuth adminOnly><Register /></RequireAuth>} />
        
        {/* 팀 매칭 및 마이페이지 */}
        <Route path="/match" element={<RequireAuth><Match matchMode={matchMode} setMatchMode={setMatchMode} selectedPost={selectedPost} selectedTeam={selectedTeam} onSelectTeam={setSelectedTeam} /></RequireAuth>} />
        <Route path="/match-select" element={<RequireAuth><MatchSelect selectedPost={selectedPost} onConfirmPost={setSelectedPost} selectedTeam={selectedTeam} /></RequireAuth>} />
        <Route path="/mypage" element={<RequireAuth><MyPage /></RequireAuth>} />
        {/* 백엔드가 만드는 팀 초대 링크(app.frontend-base-url/invitations/{token})가 열리는 화면 */}
        <Route path="/invitations/:token" element={<RequireAuth><Invitation /></RequireAuth>} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;