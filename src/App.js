import React, {useState, useEffect, useReducer} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios, { formToJSON } from "axios";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import Document from "./pages/Document";
import TextEditor from "./components/TextEditor";
import LoginPage from './components/LoginPage/LoginTemplate';
import "./styles/App.scss";

function App() {
  // 로그인 상태 관리
  const [isLogin, setIsLogin] = useState(false)

  useEffect(() => {
    

    // if(sessionStorage.getItem('user_id')){
    //   setIsLogin(true)
    // }
  })

  return (
    <div className="App">
      <BrowserRouter>
        <Header isLogin={isLogin}/>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/document" element={<Document />} />
          <Route path="/lgpage" element={<LoginPage />} />
          <Route path="/textEditor" element={<TextEditor />} />
        </Routes>
        {/* <Register/> */}
        {/* <TextEditor  /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
