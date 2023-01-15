import axios from "axios";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";

const Login = () => {
  //CSS 관련

  //로그인 기능
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
        console.dir(res.data.result);
        if (res.data.result == "True") {
          alert(`${id}님 안녕하세요!`);
          sessionStorage.setItem("user_id", id);
        } else {
          alert(`아이디 또는 비밀번호를 확인해주세요`);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
    document.location.href = "/";
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      onSubmitHandler();
    }
  };

  return (
    <div className="templateBlock">
      <form className="whiteBox" onSubmit={onSubmitHandler}>
        {/* <ul className="tabGroup">
          <li className="tab active">
            <a href="/login">로그인</a>
          </li>
          <li className="tab">
            <a href="/register">회원가입</a>
          </li>
        </ul> */}
        <h1>LOGIN</h1>
        <label>아이디</label>
        <input
          // ref={inputRef}
          className="styleInput"
          type="text"
          name="loginID"
          value={id}
          onChange={onIdHandler}
          placeholder="아이디"
          required
        />
        <br />
        <label>비밀번호</label>
        <input
          className="styleInput"
          type="password"
          name="loginPW"
          value={pw}
          onChange={onPwHandler}
          onKeyDown={onKeyPress}
          placeholder="비밀번호"
          required
        />
        <br />
        <button className="button" onClick={onSubmitHandler}>
          로그인
        </button>
      </form>
    </div>
  );
};

export default Login;
