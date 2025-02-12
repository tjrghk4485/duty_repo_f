import { Link, Outlet } from "react-router-dom";
import "./css/Menu.css"

const Menu = () => {
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

      <hr />
      <Outlet />
    </div>
  );
};

export default Menu;
