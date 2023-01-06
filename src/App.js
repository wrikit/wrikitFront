import React, {useState} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import axios, { formToJSON } from "axios";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import Document from "./pages/Document";
import "./styles/App.scss";
import Register from "./components/Register";
import "./styles/App.scss"
import TextEditor from "./components/TextEditor";
import { useEffect } from "react";

function App() {
  // 로그인 상태 관리
  const [isLogin, setIsLogin] = useState(false)

  useEffect(() => {
    if(sessionStorage.getItem('user_id')){
      setIsLogin(true)
    }
  })

  return (
    <div className="App">
      <BrowserRouter>
        <Header isLogin={isLogin}/>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/document" element={<Document />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/textEditor" element={<TextEditor />} />
        </Routes>
        {/* <Register/>
      <TextEditor  /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
