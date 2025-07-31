import React from "react";
import '../css/Login.css';
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import apiClient from '../env/apiClient';
import domainIcon from '../../assets/domain.svg';  // 이미지 파일을 import

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
        // ✨ 두 요소를 감싸는 새로운 부모 div 추가 ✨
        <div className="main-content-container"> 
          <div>
            <img src={domainIcon} width="300" height="200" alt="Domain Icon" />
          </div>
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
                <input
                  onChange={onChangePasswordHandler}
                  type="password"
                  id='password'
                  name='password'
                  value={password}
                  placeholder='비밀번호 입력'
                  theme='underLine'
                  maxLength={16}
                />
                <NavLink to="/register">회원가입</NavLink>
                <button id="loginBut" onClick={login}>Login</button>
                <button id="loginBut" onClick={handleLogin} style={{ color: 'rgb(10, 10, 10)', background: 'rgb(236, 233, 31)' }}>카카오 로그인</button>
              </div>
            </div>
          </form>
    
          {/* 이전 답변에서 다룬 메뉴얼/로그아웃 링크는 필요하면 여기에 추가 (예시) */}
          {/* <div style={{
              position: 'absolute',
              bottom: '0',
              right: '10px',
              marginTop: '5px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end'
            }}>
              <div><a href={`${API_BASE_URL}/sample/nurseUpload.xlsx`} download>메뉴얼</a></div>
              <div><a href="#" onClick={handleLogout}><img src={outIcon} alt="임시로그아웃" width="20" height="20" className="me-2" /> 로그아웃</a></div>
          </div> */}
        </div>
      );
}

export default Login;