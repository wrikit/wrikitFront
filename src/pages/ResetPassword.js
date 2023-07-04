import axios from "axios";
import { serverURL } from "../settings";
import { useState, useRef } from "react";
import { inputHandler, ifKeyDownEnter } from "../tools";
import { useParams } from "react-router";

const ResetPassword = () => {
    const { username, email } = useParams();
    const [ newPass, setNewPass ] = useState("");
    const [ code, setCode ] = useState("");

    const newPassRef = useRef();
    const codeRef = useRef();

    // 패스워드 리셋 요청
    const formSubmit = (e) => {
        e.preventDefault();
        if (newPass.length < 8) {
            alert("비밀번호는 8글자 이상입니다.");
            newPassRef.current.focus();
        } else if (code.length != 6 || isNaN(code)) {
            alert("인증번호를 확인해주세요.")
            codeRef.current.focus();
        } else {
            axios.post(
                `http://${serverURL}/auth/reset-password/`,
                {
                    username: username,
                    newpass: newPass,
                    email: email,
                    authcode: code
                }
            )
            .then(res => {
                if (res.data.result) {
                    alert("비밀번호 변경이 완료되었습니다.");
                    document.location.href = "/lgpage";
                } else {
                    alert("인증번호를 확인해주세요.");
                    codeRef.current.focus();
                }
            })
            .catch(err => {
                console.log(err);
            })
        }
    }

    return (
    <div>
        <div className="loginPage">
            <section className="loginPage__section__login">
                <div>
                    <div className="templateBlock">
                        <form className="whiteBox" id="passwordResetForm">
                            <h1>Reset password</h1>
                            <input
                                className="styleInput" 
                                type="text"
                                value={username}
                            />
                            <input 
                                className="styleInput"
                                type="email"
                                value={email}
                            />
                            <input 
                                className="styleInput"
                                type="password" 
                                value={newPass}
                                onChange={inputHandler(setNewPass)}
                                minLength={8}
                                ref={newPassRef}
                                placeholder="New Password"
                                required
                            />
                            <div className="text">인증번호</div>
                            <input 
                                className="styleInput"
                                id="authcode"
                                type="text"
                                placeholder="******"
                                value={code}
                                onChange={inputHandler(setCode)}
                                maxLength={6}
                                ref={codeRef}
                                onKeyDown={ifKeyDownEnter(formSubmit)}
                                required
                            />
                            <br />
                            <button
                                className="button" 
                                onClick={formSubmit}>
                                비밀번호 재설정
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    </div>
    );
};

export default ResetPassword;