import axios from "axios";
import { useState } from "react";

const Resister = () => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [ConfirmPw, setConfirmPw] = useState("");

  const onIdHandler = (e) => {
    setId(e.currentTarget.value);
  };
  const onPwHandler = (e) => {
    setPw(e.currentTarget.value);
  };
  const onConfirmPwHandler = (e) => {
    setConfirmPw(e.currentTarget.value);
  };

  const onSubmitHandler = (e) => {
    if (pw !== ConfirmPw) {
      return alert("비밀번호가 같지 않습니다.");
    } else {
      axios({
        method: "POST",
        url: "http://115.85.180.7:8000/auth/create/",
        data: {
          username: id,
          userpass: pw,
        },
      })
        .then((res) => {
          console.log(res.data);
          console.log(res.data.result);
          if (res.data.result == true) {
            alert(`${res.data.username}님 안녕하세요!`);
          } else {
              alert(`${res.data.message}`)
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      onSubmitHandler();
    }
  };

  return (
    <div>
      <form className="Resister" onSubmit={onSubmitHandler}>
        <h2>회원가입</h2>
        <label htmlFor="id">아이디</label>
        <input id="id" type="text" value={id} onChange={onIdHandler} />
        <br />
        <label htmlFor="pw">비밀번호</label>
        <input id="pw" type="password" value={pw} onChange={onPwHandler} />
        <br />
        <label htmlFor="confirm-pw">비밀번호 확인</label>
        <input
          id="confirm-pw"
          type="password"
          value={ConfirmPw}
          onChange={onConfirmPwHandler}
          onKeyPress={onKeyPress}
        />
        <br />
        <button type="button" onClick={onSubmitHandler}>
          가입하기
        </button>
      </form>
    </div>
  );
};

export default Resister;
