import axios from "axios";
import { useState, useRef } from "react";
import { URL } from "../../settings";

const Register = (props) => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [ConfirmPw, setConfirmPw] = useState("");

  const onIdHandler = (e) => {
    setId(e.target.value);
  };
  const onPwHandler = (e) => {
    setPw(e.target.value);
  };
  const onConfirmPwHandler = (e) => {
    setConfirmPw(e.target.value);
  };
  const idRef = useRef(null);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (pw !== ConfirmPw) {
      return alert("비밀번호가 같지 않습니다.");
    } else {
      axios({
        method: "POST",
        url: `http://${URL}/auth/create/`,
        data: {
          username: id,
          userpass: pw,
        },
      })
        .then((res) => {
          if (res.data.result == "True") {
            alert(`${res.data.username}님 안녕하세요!`);
            props.setContent("login");
          } else {
            alert(`${res.data.message}`);
            idRef.current.focus();
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      onSubmitHandler(e);
    }
  };

  return (
    <div className="templateBlock">
      <form className="whiteBox" onSubmit={onSubmitHandler}>
        <h1>Sign Up For Free</h1>
        <input
          className="styleInput"
          type="text"
          value={id}
          onChange={onIdHandler}
          placeholder="아이디"
          ref={idRef}
        />
        <br />
        <input
          className="styleInput"
          type="password"
          value={pw}
          onChange={onPwHandler}
          placeholder="비밀번호"
        />
        <br />
        <input
          className="styleInput"
          type="password"
          value={ConfirmPw}
          onChange={onConfirmPwHandler}
          onKeyDown={onKeyPress}
          placeholder="비밀번호 확인"
        />
        <br />
        <button className="button" onClick={onSubmitHandler}>
          가입하기
        </button>
      </form>
    </div>
  );
};

export default Register;
