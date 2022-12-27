import axios from "axios";
import { useState } from "react";

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
    axios({
      method: "POST",
      url: "http://115.85.180.7:8000/auth/login/",
      data: {
        username: id,
        userpass: pw,
      },
    })
      .then((res) => {
        console.dir(res.data);
        // if (res.data[result] === false) {
        //   alert(`${res.data.username}님 안녕하세요!`)
        // } else {
        //   alert('아이디 또는 비밀번호를 확인해주세요.')
        // }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      onSubmitHandler();
    }
  };

  return (
    <form className="Login" onSubmit={onSubmitHandler}>
      <h2>로그인</h2>
      <label htmlFor="id">아이디</label>
      <input
        type="text"
        id="id"
        value={id}
        onChange={onIdHandler}
      />
      <br />
      <label htmlFor="pw">비밀번호</label>
      <input
        type="password"
        id="pw"
        value={pw}
        onChange={onPwHandler}
        onKeyPress={onKeyPress}
      />
      <br />
      <button type="button" onClick={onSubmitHandler}>
        Login
      </button>
    </form>
  );
};

export default Login;
