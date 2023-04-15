import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useNavigate,
  useMatch,
} from "react-router-dom";
import axios, { formToJSON } from "axios";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import Document from "./pages/Document";
import DocumentView from "./pages/DocumentView";
import TextEditor from "./components/DocumentPage/TextEditor";
import LoginPage from "./components/LoginPage/LoginTemplate";
import Register from "./components/LoginPage/Register";
import Profile from "./components/UserProfile/Profile";
import NotFound from "./pages/NotFound";
import Mypage from "./pages/Mypage";
import "./styles/App.scss";
import { useMediaQuery } from "react-responsive";

const setCookie = (name, value, exp = 7) => {
  let date = new Date();
  date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

// 페이지 레이아웃 관련 (특히 Header)
const PageLayout = (props) => {
  // 로그인 상태 관리
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const refreshIsLogin = () => {
    axios
      .post("http://localhost:8000/auth/ping/", {}, { withCredentials: true })
      .then((res) => {
        setCookie("username", res.data["user"]);
        setCookie("isKakao", res.data["isKakao"]);

        if (res.data.data) {
          setIsLogin(true);
        } else {
          setIsLogin(false);
        }
      });
  };

  useEffect(() => {
    refreshIsLogin();
  }, []);

  // 로그인 후 메인페이지 x ->  문서페이지로 이동
  useEffect(() => {
    if (isLogin && window.location.pathname === "/") {
      navigate("/document");
    }
  }, [isLogin, navigate]);
  //마이페이지 사이드바
  const mypageRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleClickOutsideMypage = (e) => {
    if (
      mypageRef.current &&
      !mypageRef.current.contains(e.target) &&
      !document.querySelector(".iconContainer").contains(e.target)
    ) {
      setIsSidebarOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutsideMypage, true);
    return () => {
      document.removeEventListener("click", handleClickOutsideMypage, true);
    };
  }, []);
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 문서 작성 페이지에서 모바일환경에서는 헤더 숨김
  const match = useMatch("/document/:id");
  const isMobile = useMediaQuery({ query: "(max-width : 767px)" });
  console.log(match, isMobile);
  return (
    <>
      {!match || (match && !isMobile) ? (
        <Header isLogin={isLogin} onMenuClick={handleSidebarToggle} />
      ) : null}
      {/* <Header isLogin={isLogin} onMenuClick={handleSidebarToggle} /> */}
      {isSidebarOpen && (
        <div ref={mypageRef}>
          <Mypage onCloseClick={handleSidebarToggle} />
        </div>
      )}
      <Outlet />
    </>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* <Header isLogin={isLogin} /> */}
        <Routes>
          <Route element={<PageLayout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/document" element={<Document />} />
            <Route path="/document/:id/:type" element={<DocumentView />} />
            <Route path="/register" element={<Register />} />
            <Route path="/lgpage" element={<LoginPage />} />
            <Route path="/textEditor" element={<TextEditor />} />
          </Route>
          <Route path="/profile" element={<Profile type="profile" />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
        {/* <Register/> */}
        {/* <TextEditor  /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
