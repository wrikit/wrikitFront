import { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import "../../styles/lgpage.scss";
import { getCookie } from "../../tools";
import axios from "axios";
import { NavLink } from "react-router-dom";

const LoginPage = () => {
  const [content, setContent] = useState("login");
  const [display, setDisplay] = useState(<Login />);
  const [login, setLogin] = useState(false);
  const handleClickBtn = (e) => {
    setContent(e.target.name);
  };

  const logout_login = () => {
    axios.post(
      "http://localhost:8000/auth/logout/",
      {},
      { withCredentials: true } 
    )
    .then(() => {
      document.cookie = 'username=null';
      setLogin(false);

    });
  }

  useEffect(() => {
    content === "login"
      ? setDisplay(<Login />)
      : setDisplay(<Register setContent={setContent} />);
  }, [content]);
  useEffect(() => {
    console.log(getCookie('username'));
    setLogin(getCookie('username') != "null");
  }, []);

  return (
    <div>
    {login ? (
      <div className="logined">
        <div className="flex-item"></div>
        <div className="flex-item"></div>
        <h1>이미 로그인한 상태입니다.</h1>
        <div className="flex-item"></div>
        <button onClick={logout_login}>로그아웃하고 다시 로그인 하기</button>
        <NavLink to="/document"><button>내 문서로 이동하기</button></NavLink>
        <div className="flex-item"></div>
      </div>
    ) : (
      <div className="loginPage">
        <section className="loginPage__section__login">
          <div>
            <ul className="tabGroup">
              <li className={`tab login ${content === "login" ? "active" : ""}`}>
                <a name="login" onClick={handleClickBtn}>
                  로그인
                </a>
              </li>
              <li
                className={`tab register ${
                  content === "register" ? "active" : ""
                }`}
              >
                <a name="register" onClick={handleClickBtn}>
                  회원가입
                </a>
              </li>
            </ul>
          </div>
          <div>{display}</div>
        </section>
      </div>
    )}
    </div>
    
  );
};

export default LoginPage;
