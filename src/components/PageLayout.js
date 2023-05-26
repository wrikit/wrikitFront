import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Outlet, useMatch } from "react-router";
import Header from "./Header";
import Mypage from "../pages/Mypage";

const PageLayout = (props) => {
    const isLogin = props.isLogin;
    // 마이페이지 컨트롤(사이드바)
    const mypageRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
    // 마이페이지 열린 상태에서 마이페이지 외부 영역 클릭시 마이페이지 닫힘
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

    // 헤더 마이페이지 아이콘 클릭시 토글(사이드바 열림/닫힘)
    const handleSidebarToggle = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
      
    // 문서 작성 페이지에서 모바일환경인 경우 => 헤더 숨김
    const match = useMatch("/document/:id/:type"); // 문서작성페이지 경로 확인
    const isMobile = useMediaQuery({ query: "(max-width : 767px)" }); // 모바일환경인지 확인
    return (
      <>
        <div className={props.isDarkMode ? 'dark-mode':''}>
        {!match || (match && !isMobile) ? (
          <Header isLogin={isLogin} onMenuClick={handleSidebarToggle} isDarkMode={props.isDarkMode} setDarkMode={props.setDarkMode} />
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
  