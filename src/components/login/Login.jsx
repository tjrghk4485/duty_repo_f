import React from "react";
import '../css/Login.css';
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Login = ({valueChk}) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const Rest_api_key='b656293336f5e166383d543eb8f22357' //REST API KEY
    const redirect_uri = 'http://localhost:3000/auth/kakao' //Redirect URI
    // oauth 요청 URL
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`
    const handleLogin = (event)=>{
        event.preventDefault(); // form 제출 막기
        window.location.href = kakaoURL
    }

    const onChangeIdHandler = (e) => {
        const idValue = e.target.value;
        console.log("idValue=" + idValue);
        setId(idValue);
        console.log("id=" + id);
        }

    const onChangePasswordHandler = (e) => {
        const value  = e.target.value;
        setPassword(value);
        }
    
    const login = async (event) => {
        event.preventDefault(); // form 제출 막기
        try {
            const responseData = await axios.get('http://localhost:3001/user/login', {
              params:{
                "id": id,
                "password" : password
            }});
            if (responseData) {
              console.log("responseData.data=" + JSON.stringify(responseData));
              localStorage.setItem("userId", id);
              //localStorage.setItem("nickname", password);
              valueChk();
              navigate("/nurseStatus"); // ✅ 로그인 성공 후 이동
            } else {
              alert('회원가입에 실패하였습니다. 다시 시도해주세요.');
            }
          } catch (error) {
            alert('회원가입에 실패하였습니다. 다시 시도해주세요.');
            console.error(error);
          }

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
                        <input
                            onChange={onChangeIdHandler}
                            type="text"
                            id='id'
                            name='id'
                            value={id}
                            placeholder='아이디 입력'
                            theme='underLine'
                            maxLength={10}
                         />
                            <input onChange={onChangePasswordHandler}
                                type="password"
                                id='password'
                                name='password'
                                value={password}
                                placeholder='비밀번호 입력'
                                theme='underLine'
                                maxLength={16}
                            />
                            <NavLink to="/register">회원가입</NavLink>
                            <button id="loginBut"onClick={login}>Login</button>
                            <button id="loginBut" onClick={handleLogin}style={{color:'rgb(10, 10, 10)', background:'rgb(236, 233, 31)'}}>카카오 로그인</button>
                        </div>
                        </div>
                </form>
            </div>
        )
}

export default Login;