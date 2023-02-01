import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "../../styles/lgpage.scss";
import descImg1 from "../../img/desc01.png";

const LoginPage = () => {
  const [content, setContent] = useState("login");

  const handleClickBtn = (e) => {
    setContent(e.target.name);
  };

  return (
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
        <div>{content === "login" ? <Login /> : <Register />}</div>
      </section>
    </div>
  );
};

export default LoginPage;
