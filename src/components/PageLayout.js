import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Outlet, useMatch } from "react-router";
import { getCookie } from "../tools";
import Header from "./Header";
import Mypage from "../pages/Mypage";

const PageLayout = (props) => {
    const isLogin = props.isLogin;
    const setCookie=props.setCookie;
    // 마이페이지 사이드바
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
  
    //다크모드
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
      // console.log('darkmode_effect >>>', getCookie('darkmode'));
      if (getCookie('darkmode') === 'true') {
        // setCookie('darkmode', true);
        setIsDarkMode(true);
      }
    }, []);
    const toggleDarkMode = () => {
      setCookie('darkmode', !isDarkMode);
      setIsDarkMode(!isDarkMode);
    };
    
    // 문서 작성 페이지에서 모바일환경에서는 헤더 숨김
    const match = useMatch("/document/:id/:type");
    const isMobile = useMediaQuery({ query: "(max-width : 767px)" });
    return (
      <>
          <div className={isDarkMode ? 'dark-mode':''}>
        {!match || (match && !isMobile) ? (
          <Header isLogin={isLogin} onMenuClick={handleSidebarToggle} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        ) : null}
        {isSidebarOpen && (
          <div ref={mypageRef}>
            <Mypage onCloseClick={handleSidebarToggle} />
          </div>
        )}
        <Outlet />
        </div>
      </>
    );
  };

  export default PageLayout;
  