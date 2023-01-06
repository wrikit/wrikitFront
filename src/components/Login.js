import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/Login.scss";

const Login = () => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const onIdHandler = (e) => {
    setId(e.currentTarget.value);
  };

  const onPwHandler = (e) => {
    setPw(e.currentTarget.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    
    axios({
      method: "POST",
      url: "http://115.85.180.7:8000/auth/login/",
      data: {
        username: id,
        userpass: pw,
      },
    })
      .then((res) => {
        console.dir(res.data.result)
        if (res.data.result == "True") {
          alert(`${id}님 안녕하세요!`);
          sessionStorage.setItem('user_id', id)
        } else {
          alert(`아이디 또는 비밀번호를 확인해주세요`);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
      document.location.href = '/'
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      onSubmitHandler();
    }
  };

  return (
    <div className="templateBlock">
      <form className="whiteBox" onSubmit={onSubmitHandler}>
        <h3>로그인</h3>
        <input
          className="styleInput"
          type="text"
          value={id}
          onChange={onIdHandler}
          placeholder="아이디"
          />
        <br />
        <input
          className="styleInput"
          type="password"
          value={pw}
          onChange={onPwHandler}
          onKeyDown={onKeyPress}
          placeholder="비밀번호"
        />
        <br />
        <button className="button" onClick={onSubmitHandler}>
          로그인
        </button>
        <div className="link">
          <Link to="/register">회원가입</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
