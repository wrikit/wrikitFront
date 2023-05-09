import { NavLink } from "react-router-dom";
import "../styles/MainPage.scss";

const MainPage = (isLogin) => {
  return (
    <main className="MainPage">
      <div className="banner index-img">
        <div className="main__textwrapper">
          <h1 className="main__textwrapper__title">[ 한 줄 문구 ]</h1>
          <div className="main__textwrapper__desc">
            설명설명설명
            <br />
            설명설명설명
            <br />
            설명설명설명
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
