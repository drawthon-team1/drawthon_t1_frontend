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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* path="주소"를 치면 element={<컴포넌트 />}를 보여줍니다 */}
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* 공고 관련 페이지 */}
        <Route path="/postings" element={<PostList />} />
        <Route path="/detail/:id" element={<PostDetail />} />
        <Route path="/register" element={<Register />} />
        
        {/* 팀 매칭 및 마이페이지 */}
        <Route path="/match" element={<Match />} />
        <Route path="/match-select" element={<MatchSelect />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;