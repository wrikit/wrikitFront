import { useState } from 'react';
import axios from 'axios';
import { serverURL } from '../../settings';
import { NavLink } from 'react-router-dom';

//아이디 찾기 컴포넌트
const FindID = () => {
    const [email, setEmail] = useState('');

    const onEmailHandler = (e) => {
        setEmail(e.target.value);
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();

        axios
            .post(
                `http://${serverURL}/auth/find-account/`,
                {
                    email: email
                }
            )
            .then((res) => {
                if (res.data.result) {
                    alert(`이메일로 아이디가 전송 되었습니다.`);
                    document.location.href = '/lgpage';
                } else {
                    alert(`이메일을 다시 확인해주세요.`);
                }
            })
            .catch(function (err) {
                console.log(err);
            }
        );
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSubmitHandler(e);
        }
    };

    return (
        <div className="templateBlock">
            <form className="whiteBox" onSubmit={onSubmitHandler}>
                <h1>Let's get you into your account</h1>
                <label>아이디</label>
                <input
                    className="styleInput"
                    type="email"
                    placeholder="가입시 사용한 이메일"
                    value={email}
                    onChange={onEmailHandler}
                    onKeyDown={onKeyDown}
                    required
                />
                <br />
                <br />
                <button className="button" onClick={onSubmitHandler}>
                    아이디 찾기
                </button>
                <NavLink to="/lgpage" style={{ textDecoration: 'none' }}>
                    <button className="button">로그인 하러 가기</button>
                </NavLink>
            </form>
        </div>
    );
};

export default FindID;
