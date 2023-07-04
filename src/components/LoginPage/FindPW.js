import axios from 'axios';
import { useState, useRef } from 'react';
import { serverURL } from '../../settings';
import { NavLink } from 'react-router-dom';

// 비밀번호 찾기 컴포넌트
const FindPW = (props) => {
    const [id, setId] = useState('');
    const [email, setEmail] = useState('');

    const onIdHandler = (e) => {
        setId(e.target.value);
    };
    const onEmailHandler = (e) => {
        setEmail(e.target.value);
    };

    const idRef = useRef(null);

    // 아이디, 이메일 확인 후 이메일전송
    const onSubmitHandler = (e) => {
        e.preventDefault();

        axios.post(
            `http://${serverURL}/auth/send-authcode/`,
            {
                username: id,
                email: email
            }
        )
            .then((res) => {
                if (res.data.result) {
                    alert(`인증번호 전송이 완료되었습니다. 이메일을 확인해주세요.`);
                    document.location.href = `/resetpassword/${id}/${email}`;
                } else {
                    alert(`일치하는 정보가 없습니다. 아이디, 이메일을 다시 확인해주세요.`);
                    idRef.current.focus();
                }
            })
            .catch(function (err) {
                console.log(err);
            });
    };

    const onKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSubmitHandler(e);
        }
    };

    return (
        <div className="templateBlock">
            <form className="whiteBox" onSubmit={onSubmitHandler}>
                <h1>Let's get you into your account</h1>
                <input
                    className="styleInput"
                    type="text"
                    value={id}
                    onChange={onIdHandler}
                    placeholder="아이디"
                    ref={idRef}
                    required
                />
                <br />
                <input
                    className="styleInput"
                    type="email"
                    value={email}
                    onChange={onEmailHandler}
                    placeholder="가입시 사용한 이메일"
                    onKeyDown={onKeyPress}
                    required
                />
                <br />
                <br />
                <button className="button" onClick={onSubmitHandler}>
                    비밀번호 찾기 이메일 전송
                </button>
                <NavLink to="/lgpage" style={{ textDecoration: 'none' }}>
                    <button className="button">로그인 하러 가기</button>
                </NavLink>
            </form>
        </div>
    );
};

export default FindPW;
