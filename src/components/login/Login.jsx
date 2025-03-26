import React from "react";
import '../css/Login.css';
import { NavLink } from "react-router-dom";

const Login = () => {


    const Rest_api_key='b656293336f5e166383d543eb8f22357' //REST API KEY
    const redirect_uri = 'http://localhost:3000/auth/kakao' //Redirect URI
    // oauth 요청 URL
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`
    const handleLogin = (event)=>{
        event.preventDefault(); // form 제출 막기
        window.location.href = kakaoURL
    }

        return (
            <div>
                <div id="domain" >🇩🇺🇹🇾</div>
                <form className="loginForm">
                    <div>
                        <h1 id='login_title'>LOGIN</h1>
                    </div>
                    <div>
                        <div className="input">
                            <input type="text" className="userId" id="userId" placeholder="아이디" autoFocus></input>
                            <input type="password" className="password" id="password" placeholder="비밀번호"></input>
                            <NavLink to="/register">회원가입</NavLink>
                            <button id="loginBut">Login</button>
                            <button id="loginBut" onClick={handleLogin}style={{color:'rgb(10, 10, 10)', background:'rgb(236, 233, 31)'}}>카카오 로그인</button>
                        </div>
                        </div>
                </form>
            </div>
        )
}

export default Login;