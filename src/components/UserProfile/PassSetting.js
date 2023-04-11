import { useState, useRef } from "react";
import axios from "axios";

const Setting = () => {
  const settingDialogRef = useRef(null);
  const passRef = useRef(null);
  const newPassRef = useRef(null);
  const confirmRef = useRef(null);
  const [pass, setPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const getCookie = (key) => {
    let value = document.cookie.match("(^|;) ?" + key + "=([^;]*)(;|$)");
    return value ? value[2] : null;
  };
  const inputHandler = (settingFunc) => {
    return (event) => {
      settingFunc(event.target.value);
    };
  };
  const settingHandler = (event) => {
    event.preventDefault();
    settingDialogRef.current.showModal();
  };
  const passValidity = (password) => {
    let length = password.length >= 8;
    return length;
  };
  const passChangeHandler = (event) => {
    event.preventDefault();
    const validity = passValidity(newPass);
    if (validity && newPass == confirm) {
      axios
        .post(
          "http://localhost:8000/auth/login/",
          { username: getCookie("username"), userpass: pass },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.data.result == "True") {
            axios
              .post(
                "http://localhost:8000/auth/set-password/",
                { newpass: newPass },
                { withCredentials: true }
              )
              .then((res) => {
                if (res.data.result == "True") {
                  alert("패스워드변경 완료");
                  passRef.current.value = "";
                  newPassRef.current.value = "";
                  confirmRef.current.value = "";
                }
              });
          } else {
            alert("패스워드를 확인해주세요");
            passRef.current.focus();
          }
        });
    } else if (!validity) {
      alert("8자 이상의 패스워드가 필요합니다.");
      newPassRef.current.focus();
    } else {
      alert("패스워드와 확인이 일치하지 않습니다.");
      confirmRef.current.focus();
    }
  };
  const closeDialog = (event) => {
    event.preventDefault();
    settingDialogRef.current.close();
  }

  return (
    <>
      <button onClick={settingHandler}>패스워드 변경</button>
      <div className="pass-setting">
        <dialog ref={settingDialogRef}>
          <h3>비밀번호 재설정</h3>
          <label htmlFor="password">패스워드</label> <br />
          <input
            type="password"
            id="password"
            onChange={inputHandler(setPass)}
            ref={passRef}
          />
          <br />
          <label htmlFor="new-password">새 패스워드</label> <br />
          <input
            type="password"
            id="new-password"
            onChange={inputHandler(setNewPass)}
            ref={newPassRef}
          />
          <br />
          <label htmlFor="confirm-password">패스워드확인</label> <br />
          <input
            type="password"
            id="confirm-password"
            onChange={inputHandler(setConfirm)}
            ref={confirmRef}
          />
          <br />
          <button onClick={passChangeHandler}>패스워드 변경</button>
          <button onClick={closeDialog}>CLOSE</button>
        </dialog>
      </div>
    </>
  );
};

export default Setting;
