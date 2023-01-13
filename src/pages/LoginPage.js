import Login from "../components/Login";
import Register from "../components/Register";
import "../styles/lgpage.scss";
import { useState } from "react";
const LoginPage = () => {
  //클릭한 버튼의 name 값을 state에 저장
  const [content, setContent] = useState("login");

  const handleClickButton = (e) => {
    const { name } = e.target;
    setContent(name);
    // setIsActive(true);
  };
  // selectComponent key와 a태그 name 값을 동일하게, key값은 렌더링 할 컴포넌트
  const selectComponent = {
    login: <Login />,
    register: <Register />,
  };

  return (
    <div className="loginPage">
      <section className="loginPage__section__desc">
        설명 그리드
        <div className="boxSize"></div>
      </section>

      <section className="loginPage__section__login">
        <div>
          <ul className="tabGroup">
            <li className={`tab ${content == "login" ? "active" : ""}`}>
              <a onClick={handleClickButton} name="login">
                로그인
              </a>
            </li>
            <li className={`tab ${content == "register" ? "active" : ""}`}>
              <a onClick={handleClickButton} name="register">
                회원가입
              </a>
            </li>
          </ul>
        </div>
        {content && <div>{selectComponent[content]} </div>}
      </section>
    </div>
  );
};

export default LoginPage;
