import React from 'react';
import './css/Menu.css'
import { useLocation } from 'react-router-dom'; // 현재 경로를 가져오기 위해 useLocation 훅 사용

function Header() {
  const location = useLocation(); // 현재 경로 정보 가져오기
  let pageTitle = '';

  // 경로에 맞는 페이지 이름 설정
  switch (location.pathname) {
    case '/':
      pageTitle = '간호사정보';
      break;
    case '/about':
      pageTitle = '설정';
      break;
    case '/news':
      pageTitle = '듀티표작성';
      break;
    default:
      pageTitle = 'Page Not Found'; // 기본값 (404 등)
  }

  return (
    <header className="header">
      <h1>{pageTitle}</h1>
    </header>
  );
}

export default Header;