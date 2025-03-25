import "./css/Menu.css"
import KakaoLogin from "react-kakao-login";
const Home = ({valueChk}) => { 
  const Rest_api_key='b656293336f5e166383d543eb8f22357' //REST API KEY
  const redirect_uri = 'http://localhost:3000/auth/kakao' //Redirect URI
  // oauth 요청 URL
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`
  const handleLogin = ()=>{
      window.location.href = kakaoURL
  }
  const handleLogout = ()=>{
    localStorage.removeItem("kakaoId");
    console.log("localStorage:" + localStorage.getItem("kakaoId"));
    valueChk();
    
}
  return(
  <>
  <button onClick={handleLogin}style={{color:'rgb(10, 10, 10)', background:'rgb(236, 233, 31)'}}>카카오 로그인</button>
  <button onClick={handleLogout}style={{color:'rgb(10, 10, 10)', background:'rgb(236, 233, 31)'}}>로그아웃</button>
  </>
  )

}
  export default Home;
