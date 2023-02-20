import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import axios, { formToJSON } from "axios";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import Document from "./pages/Document";
import TextEditor from "./components/DocumentPage/TextEditor";
import LoginPage from "./components/LoginPage/LoginTemplate";
import Register from "./components/LoginPage/Register";
import Profile from "./components/UserProfile/Profile";
import "./styles/App.scss";
import NotFound from "./pages/NotFound";

const setCookie = (name, value, exp=7) => {
  let date = new Date();
  date.setTime(date.getTime() + exp*24*60*60*1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

// 페이지 레이아웃 관련 (특히 Header)
const PageLayout = () => {
  // 로그인 상태 관리
  const [isLogin, setIsLogin] = useState(false);
  const refreshIsLogin = () => {
    axios
      .post("http://localhost:8000/auth/ping/", {}, { withCredentials: true })
      .then((res) => {
        setCookie('username', res.data['user']);
        setCookie('isKakao', res.data['isKakao']);
        
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

  return (
    <>
      <Header isLogin={isLogin} />
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
            <Route path="/register" element={<Register />} />
            <Route path="/lgpage" element={<LoginPage />} />
            <Route path="/textEditor" element={<TextEditor />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/*" element={<NotFound />} />
        </Routes>
        {/* <Register/> */}
        {/* <TextEditor  /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
