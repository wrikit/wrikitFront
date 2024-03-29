import { useState, useRef } from "react";
import axios from "axios";
import { getCookie } from "../../tools";
import { serverURL } from "../../settings";

// 프로필에서 계정 패스워드 변경 모달
const Setting = () => {
  const settingDialogRef = useRef(null);
  const passRef = useRef(null);
  const newPassRef = useRef(null);
  const confirmRef = useRef(null);
  const [pass, setPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const inputHandler = (settingFunc) => {
    return (event) => {
      settingFunc(event.target.value);
    };
  };
  const settingHandler = (event) => {
    event.preventDefault();
    settingDialogRef.current.showModal();
  };
  // 패스워드 유효성 검사 함수, 기준변경시 수정할 부분
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
          `http://${serverURL}/auth/login/`,
          { username: getCookie("username"), userpass: pass },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.data.result == "True") {
            axios
              .post(
                `http://${serverURL}/auth/set-password/`,
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
  };

  return (
    <>
      <button onClick={settingHandler}>패스워드 변경</button>
      <div className="pass-setting">
        <dialog ref={settingDialogRef}>
          <h2>비밀번호 재설정</h2>
          <div className="pass-setting-wrapper">
            <label htmlFor="password">기존 패스워드</label> <br />
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
            <label htmlFor="confirm-password">패스워드 확인</label> <br />
            <input
              type="password"
              id="confirm-password"
              onChange={inputHandler(setConfirm)}
              ref={confirmRef}
            />
          </div>
          <br />
          <div className="button-wrapper">
            <button onClick={passChangeHandler}>패스워드 변경</button>
            <button onClick={closeDialog}>CLOSE</button>
          </div>
        </dialog>
      </div>
    </>
  );
};

export default Setting;
