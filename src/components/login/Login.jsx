import React from "react";
import '../css/Login.css';
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import apiClient from '../env/apiClient';

const Login = ({valueChk}) => {
    const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;
    const API_REDIRECT_URL = import.meta.env.VITE_APP_API_REDIRECT_URL;
    const REST_API_KEY= import.meta.env.VITE_APP_API_REST_API_KEY; 
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    //const redirect_uri = `${API_BASE_URL}/auth/kakao/Fe` //Redirect URI운영
    // oauth 요청 URL
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${API_REDIRECT_URL}&response_type=code`
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
             const responseData = await axios.get(`${API_BASE_URL}/user/login`, {
            //const responseData = apiClient.get('/user/login',{
              params:{
                "id": id,
                "password" : password
            }});
            if (responseData.data[0]) {
              console.log("responseData.data=" + JSON.stringify(responseData.data[0]));
              localStorage.setItem("userId", id);
              //localStorage.setItem("nickname", password);
              valueChk();
              navigate("/nurseStatus"); // ✅ 로그인 성공 후 이동
            } else {
              alert('로그인 실패하였습니다. 계정확인해주세요.');
            }
          } catch (error) {
            alert('로그인인 실패하였습니다. 계정확인해주세요.');
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