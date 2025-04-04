
import './components/css/Menu.css';
import NurseStatus from './components/NurseStatus';
import Home from './components/Home';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import NoMatch from './components/NoMatch';
import NurseSchedule from './components/NurseSchedule';
import Menu from './components/Menu';
import Header from './components/Header';
import KakaoAuth from "./components/login/KakaoAuth";
import Login from "./components/login/Login";
import Register from "./components/login/Register";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  //const navigate = useNavigate(); 
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 저장

  // 📌 처음 렌더링될 때 localStorage에서 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem("userId"); // 저장된 토큰 가져오기
    console.log("localStorage1:" + token);
    console.log("isLoggedIn:" + isLoggedIn);
    if (token) {
      setIsLoggedIn(true);
      console.log("localStorage2:" + token);
    } else {
      setIsLoggedIn(false);
     // navigate("/login"); // 로그인 안 되어 있으면 로그인 페이지로 이동
    }
  }, []);

  return (
    <>
      {!isLoggedIn ? (
        // 🚀 로그인 안 되어 있으면 로그인 화면만 표시
        <Routes>
          <Route path="/login" element={<Login valueChk={() => setIsLoggedIn(true)}/>} />
          <Route path="/auth/kakao" element={<KakaoAuth valueChk={() => setIsLoggedIn(true)}/>} />
          <Route path="/register" element={<Register valueChk={() => setIsLoggedIn(true)}/>} />
          <Route path="*" element={<Login valueChk={() => setIsLoggedIn(true)}/>} />
          
        </Routes>
      ) : (
        // 🚀 로그인 후에는 기존 화면 (Menu + Header 포함)
        <div className="wrapper">
          <Menu valueChk={() => setIsLoggedIn(false)}/>
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth/kakao" element={<KakaoAuth />} />
              <Route path="/nurseStatus" element={<NurseStatus />} />
              <Route path="/nurseSchedule" element={<NurseSchedule />} />
              <Route path="*" element={<NoMatch />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default App;