import { Link, Outlet } from "react-router-dom";
import "./css/Menu.css"
import { useState, useEffect } from "react";
import houseIcon from '../assets/house.svg';  // 이미지 파일을 import
import nurseIcon from '../assets/hospital.svg';  // 이미지 파일을 import
import tableIcon from '../assets/table.svg';  // 이미지 파일을 import
import dutyIcon from '../assets/Duty.svg';  // 이미지 파일을 import
import outIcon from '../assets/box-arrow-left.svg';  // 이미지 파일을 import
import domainIcon from '../assets/domain.svg';  // 이미지 파일을 import
import { useNavigate } from "react-router-dom";
const Menu = ({valueChk}) => {
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;
  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    const storedProfileImage = localStorage.getItem("profile_image");

    if (storedNickname) setNickname(storedNickname);
    if (storedProfileImage) setProfileImage(storedProfileImage);
  }, []);

   // 드롭다운이 열렸는지 여부를 관리
   const [isOpen, setIsOpen] = useState(false);

  //  // 드롭다운 열고 닫기
  //  const toggleDropdown = () => {
  //    setIsOpen(!isOpen);
  //  };

   const handleLogout = ()=>{
    localStorage.removeItem("userId");
    localStorage.removeItem("nickname");
    localStorage.removeItem("profile_image");
    console.log("localStorage:" + localStorage.getItem("userId"));
    valueChk();
    navigate("/login");
    
}

  return (
    <div className="sidebar" >
      <div
      style={{
        display: 'flex',
        justifyContent: 'left',  // 수평 중앙 정렬
      }}
    >
      <img src={domainIcon} width="150" height="100" alt="Domain Icon" />
    </div>
      <nav>
                 
         
          
            <Link to="/nurseStatus" className="sidebar-link"><img src= {nurseIcon}
            alt="간호사정보" width="20"height="20" className="me-2" />
            간호사정보</Link>
          
            <Link to="/nurseSchedule" className="sidebar-link"><img src= {tableIcon}
            alt="듀티표작성" width="20"height="20" className="me-2" />
            듀티표작성</Link>
         
       </nav>
      <div style={{
            position: 'relative', top: '560px',
            bottom: '0', // 부모 div 맨 밑으로 배치
            left: '0', // 왼쪽에 배치
            marginTop: '5px', // 추가적인 공간을 위해 옵션으로 설정
            
          }}>
      <div
        className="d-flex align-items-center link-dark text-decoration-none "
        aria-expanded={isOpen ? 'true' : 'false'}
      >
        {/* <img
          src= {localStorage.getItem("profile_image")}
          alt=""
          width="32"
          height="32"
          className="rounded-circle me-2"
        /> */}
        {/* <a>{localStorage.getItem("nickname")}님,반갑습니다.</a>        */}
      </div>
      
      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <ul className="dropup-menu text-small shadow show">
          {/* <a className="dropdown-item" href="#">New project...</a>
          <a className="dropdown-item" href="#">Settings</a>
          <a className="dropdown-item" href="#">Profile</a>
          <hr className="dropdown-divider" /> */}
          <a className="dropdown-item" href="#">로그아웃</a>
        </ul>
      )}
    </div>
    
    <div style={{
            position: 'absolute',
            bottom: '0', // 부모 div 맨 밑으로 배치
            right: '10px',
            marginTop: '5px',  // 추가적인 공간을 위해 옵션으로 설정
            alignItems: 'flex-end',
            display: 'flex',          // Flexbox 컨테이너로 만듭니다.
            flexDirection: 'column',  // 자식 요소들을 수직으로 쌓습니다.
          }}>
        <div>
            <a href={`${API_BASE_URL}/sample/dutyGuide.pdf`} target="_blank" rel="noopener noreferrer">메뉴얼</a>
        </div>
        <div>
            <a href="#" onClick={handleLogout}><img src= {outIcon} alt="임시로그아웃" width="20" height="20" className="me-2" /> 로그아웃</a>
        </div>
      </div>
    
  </div>
    
  );
};

export default Menu;
