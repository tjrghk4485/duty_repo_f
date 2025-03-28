import React from "react";
import '../css/Login.css';
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import CircularJSON from 'circular-json';
import { useNavigate } from "react-router-dom";
const Register = ({valueChk}) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [user_nm, setuser_nm] = useState('');
    const [idError, setIdError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const navigate = useNavigate();
    const [isIdCheck, setIsIdCheck] = useState(false); // 중복 검사를 했는지 안했는지
    const [isIdAvailable, setIsIdAvailable] = useState(false); // 아이디 사용 가능한지 아닌지

    const onChangeIdHandler = (e) => {
        const idValue = e.target.value;
        setId(idValue);
        console.log("id=" + id);
        idCheckHandler(idValue);
      }

    const onChangeNikNameHandler = (e) => {
        const user_nm = e.target.value;
        setuser_nm(user_nm);
    }
    
      const onChangePasswordHandler = (e) => {
        const { name, value } = e.target;
        if (name === 'password') {
          setPassword(value);
          passwordCheckHandler(value, confirm);
        } else {
          setConfirm(value);
          passwordCheckHandler(password, value);
        }
      }

      const idCheckHandler = async (id) => {
        console.log("id=" + id);
        const idRegex = /^[a-z\d]{5,10}$/;
        if (id === '') {
          setIdError('아이디를 입력해주세요.');
          setIsIdAvailable(false);
          return false;
        } else if (!idRegex.test(id)) {
          setIdError('아이디는 5~10자의 영소문자, 숫자만 입력 가능합니다.');
          setIsIdAvailable(false);
          return false;
        }
        try {
          const responseData = await axios.get('http://localhost:3001/user/chk', {params: {
            "id": id
        }});
          console.log("responseData:" +responseData.data[0]);
          if (!responseData.data[0]) {
            setIdError('사용 가능한 아이디입니다.');
            setIsIdCheck(true);
            setIsIdAvailable(true);
            return true;
          } else {
            setIdError('이미 사용중인 아이디입니다.');
            setIsIdAvailable(false);
            return false;
          }
        } catch (error) {
          alert('서버 오류입니다. 관리자에게 문의하세요.');
          console.error(error);
          return false;
        }
      }

        

      const passwordCheckHandler = (password, confirm) => {
        const passwordRegex = /^[a-z\d!@*&-_]{8,16}$/;
        if (password === '') {
          setPasswordError('비밀번호를 입력해주세요.');
          return false;
        } else if (!passwordRegex.test(password)) {
          setPasswordError('비밀번호는 8~16자의 영소문자, 숫자, !@*&-_만 입력 가능합니다.');
          return false;
        } else if (confirm !== password) {
          setPasswordError('');
          setConfirmError('비밀번호가 일치하지 않습니다.');
          return false;
        } else {
          setPasswordError('');
          setConfirmError('');
          return true;
        }
      }


      const registMod = (id, password) => {

      }

      const signupHandler = async (e) => {
        e.preventDefault();
        
        const idCheckresult = await idCheckHandler(id);
        if (idCheckresult) setIdError('');
        else return;
        if (!isIdCheck || !isIdAvailable) {
          alert('아이디 중복 검사를 해주세요.');
          return;
        }
    
        const passwordCheckResult = passwordCheckHandler(password, confirm);
        if (passwordCheckResult) { setPasswordError(''); setConfirmError(''); }
        else return;
        
        const requestData = {
            "id": id,
            "password" : password,
            "user_nm" : user_nm
        };
        console.log("requestData=" + JSON.stringify(requestData));
        try {
          const responseData = await axios.post('http://localhost:3001/user/mod', {
            "id": id,
            "password" : password,
            "user_nm" : user_nm
        });
          if (responseData) {
            console.log("responseData.data=" + JSON.stringify(responseData));
            localStorage.setItem("kakaoId", id);
            localStorage.setItem("kakaoId", user_nm);
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
                
                <form className="loginForm">
                    <div>
                        <h1 id='login_title'>회원가입</h1>
                    </div>
                    <div>
                        <div className="input">
                        <label htmlFor='id'>아이디</label>
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
              {idError && <small className={isIdAvailable ? 'idAvailable' : ''}>{idError}</small>}
              <label htmlFor='id'>닉네임</label>
                            <input
                onChange={onChangeNikNameHandler}
                type="text"
                id='user_nm'
                name='user_nm'
                value={user_nm}
                placeholder='닉네임 입력'
                theme='underLine'
                maxLength={10}
              />
              
              <label htmlFor='id'>비밀번호</label>
                            <input onChange={onChangePasswordHandler}
                type="password"
                id='password'
                name='password'
                value={password}
                placeholder='비밀번호 입력'
                theme='underLine'
                maxLength={16}></input>
                {passwordError && <small>{passwordError}</small>}
                <label htmlFor='id'>비밀번호 확인</label>
                            <input onChange={onChangePasswordHandler}
                type="password"
                id='confirm'
                name='confirm'
                value={confirm}
                placeholder='비밀번호 확인'
                theme='underLine'
                maxLength={16}></input>
                {confirmError && <small>{confirmError}</small>}
                            <button onClick={signupHandler}id="loginBut">회원가입</button>
                        </div>
                        </div>
                </form>
            </div>
        )
}


export default Register;