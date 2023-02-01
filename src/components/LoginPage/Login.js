import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginTemplate = () => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  const onIdHandler = (e) => {
    setId(e.target.value);
  };

  const onPwHandler = (e) => {
    setPw(e.target.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault()

    axios({
      method: "POST",
      url: "http://115.85.180.7:8000/auth/login/",
      data: {
        username: id,
        userpass: pw,
      },
    })
      .then((res) => {
        // console.dir(res.data);
        if (res.data.result === "True") {
          alert(`${id}님 안녕하세요!`);
          navigate('/')
        } else {
          alert(`아이디 또는 비밀번호를 확인해주세요`);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      onSubmitHandler(e);
    }
  };

  return (
    <div className="templateBlock">
      <form className="whiteBox" onSubmit={onSubmitHandler}>
        <h1>LOGIN</h1>
        <label>아이디</label>
        <input
          className="styleInput"
          type="text"
          placeholder="아이디"
          value={id}
          onChange={onIdHandler}
          required
        />
        <br />
        <label>비밀번호</label>
        <input
          className="styleInput"
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={onPwHandler}
          onKeyDown={onKeyDown}
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

export default LoginTemplate;
