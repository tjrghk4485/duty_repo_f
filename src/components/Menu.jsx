import { Link, Outlet } from "react-router-dom";
import "./css/Menu.css"
import { useState, useEffect } from "react";

const Menu = () => {
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    const storedProfileImage = localStorage.getItem("profile_image");

    if (storedNickname) setNickname(storedNickname);
    if (storedProfileImage) setProfileImage(storedProfileImage);
  }, []);

  return (
    <div className="sidebar" >
      <nav>
        <ul>
          <li>
            <Link to="/" className="sidebar-link">간호사정보</Link>
          </li>
          <li>
            <Link to="/about" className="sidebar-link">설정</Link>
          </li>
          <li>
            <Link to="/news" className="sidebar-link">듀티표작성</Link>
          </li>
        </ul>
        
      </nav>
    <div>
      <h2>{nickname} </h2>
      <h2>어서오고.</h2>
      {profileImage && <img src={profileImage} alt="프로필 이미지" width={50} />}
    </div>
      <hr />
      <Outlet />
    </div>
  );
};

export default Menu;
