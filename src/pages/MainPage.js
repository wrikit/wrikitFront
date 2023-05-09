import { NavLink } from "react-router-dom";
import "../styles/MainPage.scss";

const MainPage = (isLogin) => {
  return (
    <main className="MainPage">
      <div className="banner index-img">
        <div className="main__textwrapper">
          <h1 className="main__textwrapper__title">어디든, 언제든!<br /> 간편한 문서공유</h1>
          <div className="main__textwrapper__desc">
            이메일 초대없이 링크하나로 협업
            <br />
            간단하고 직관적인 편집툴
            <br />
            작성한 문서를 PDF로 다운받아 보세요
            <br />
          </div>
          <div className="main__textwrapper__btnArea">
            {isLogin ? (
                <NavLink to="/document">
                <button className="runBtn">
                  <span>시작하기</span>
                </button>
              </NavLink>
            ) : (  <NavLink to="/lgpage">
            <button className="runBtn">
              <span>시작하기</span>
            </button>
          </NavLink>)}
          
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainPage;
