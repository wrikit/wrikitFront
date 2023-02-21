import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import axios, { formToJSON } from "axios";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import Document from "./pages/Document";
import TextEditor from "./components/DocumentPage/TextEditor";
import LoginPage from "./components/LoginPage/LoginTemplate";
import Register from "./components/LoginPage/Register";
import NotFound from "./pages/NotFound";
import Mypage from "./pages/Mypage";
import "./styles/App.scss";

// 페이지 레이아웃 관련 (특히 Header)
const PageLayout = (props) => {
  // 로그인 상태 관리
  const [isLogin, setIsLogin] = useState(false);
  const refreshIsLogin = () => {
    axios
      .post("http://localhost:8000/auth/ping/", {}, { withCredentials: true })
      .then((res) => {
        console.log(res.data.data);
        if (res.data.data) {
          setIsLogin(true);
        } else {
          setIsLogin(false);
        }
      });
  };

  // useEffect(() => {
  //   if (sessionStorage.getItem("user_id")) {
  //     setIsLogin(true);
  //   }
  // });

  useEffect(() => {
    refreshIsLogin();
  }, []);

  //마이페이지 사이드바
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  // //다른 곳 클릭시 마이페이지 닫힘

  
  
  // let mypageRef = useRef();
  // useEffect(() => {
  //   let handler = (e) => {
  //     if(!mypageRef.current.contains(e.target)){
  //       setIsSidebarOpen(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handler);

  //   return () => {
  //     document.removeEventListener("mousedown", handler);
  //   };
  // },[]);

  return (
    <>
      <Header isLogin={isLogin} onMenuClick={handleSidebarToggle} />
      {isSidebarOpen && <Mypage onCloseClick={handleSidebarToggle} setIsSidebarOpen={setIsSidebarOpen} />}
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
