import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import PageLayout from './components/PageLayout';
import MainPage from './pages/MainPage';
import Document from './pages/Document';
import DocumentView from './pages/DocumentView';
import LoginPage from './components/LoginPage/LoginTemplate';
import Register from './components/LoginPage/Register';
import Profile from './components/UserProfile/Profile';
import NotFound from './pages/NotFound';
import './styles/App.scss';
import { serverURL } from './settings.js';
import { getCookie, setCookie } from './tools';
import FindAccountPage from './pages/FindAccount';

const App = () => {
    // 쿠키 적용(로그인, 다크모드 유지)
    // 로그인 상태 관리
    const [isLogin, setIsLogin] = useState(false);
    const refreshIsLogin = async () => {
        try {
            const res = await axios.post(`http://${serverURL}/auth/ping/`, {}, { withCredentials: true });
            setCookie('username', res.data['user']);
            setCookie('isKakao', res.data['isKakao']);

            if (res.data.data) {
                setIsLogin(true);
            } else {
                setIsLogin(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // 다크모드 관리
    const [isDarkMode, setIsDarkMode] = useState(getCookie('darkmode') == 'true');
    const toggleDarkMode = () => {
        setCookie('darkmode', !isDarkMode);
        setIsDarkMode(!isDarkMode);
    };

    useEffect(() => {
        refreshIsLogin();
    }, []);

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route
                        element={<PageLayout isLogin={isLogin} isDarkMode={isDarkMode} setDarkMode={toggleDarkMode} />}
                    >
                        <Route path="/" element={<MainPage isLogin={isLogin} />} />
                        <Route path="/document" element={<Document />} />
                        <Route
                            path="/document/:id/:type"
                            element={<DocumentView isDarkMode={isDarkMode} setDarkMode={toggleDarkMode} />}
                        />
                        <Route path="/register" element={<Register />} />
                        <Route path="/lgpage" element={<LoginPage />} />
                        <Route path="/findaccount" element={<FindAccountPage />} />
                    </Route>
                    <Route path="/profile" element={<Profile type="profile" />} />
                    <Route path="/*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
