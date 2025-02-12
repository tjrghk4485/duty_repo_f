import { Link } from "react-router-dom";
import "./css/Menu.css"
const NoMatch = () => {
  return (
    <div className="content">
      <h2>잘못된 경로로 접근하셨습니다.</h2>
      <p>
        <Link to="/">Home으로 이동하기</Link>
      </p>
    </div>
  );
};

export default NoMatch;