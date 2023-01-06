import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { throttle } from "lodash";
// import { GrCloudDownload } from "react-icons/gr";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { RiLoginBoxFill } from "react-icons/ri";
import "../styles/Header.scss";

const Header = (props) => {
  const isLogin = props.isLogin;
  const onLogout = () => {
    sessionStorage.removeItem("user_id");
    alert("로그아웃 되었습니다.");
    document.location.href = "/";
  };

  // 스크롤 감지 (-> 헤더 그림자 + 높이 줄어듦 효과)
  // isScrolled가 true -> shadow 클래스 추가
  const [isScrolled, setIsScrolled] = useState(false);
  const updateScroll = () => {
    // 스크롤 위치 값 가져오기
    if (window.scrollY || document.documentElement.scrollTop) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  window.addEventListener("scroll", updateScroll);

  //아이콘에 hover 했을 경우 true -> 아이콘 밑에 p태그 등장
  const [iconHover, setIconHover] = useState(false);

  const handleMouseOver = () => {
    setIconHover(true);
  };

  const handleMouseOut = () => {
    setIconHover(false);
  };

  // Onclick(-> 페이지 이동 및 해당 li에 CSS적용)
  const [isActive, setIsActive] = useState(false);

  const showMydoc = (event) => {
    setIsActive(true);
  };

  const hiddenMydoc = (event) => {
    setIsActive(false);
  };

  return (
    <header className={`header`}>
      <div className={`header__content ${isScrolled ? "shadow" : ""}`}>
        <a href="/" className="header__content__logo">
          Wrikit
        </a>
        <nav className="header__content__nav">
          <ul>
            <li
              id="icon"
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              onClick={showMydoc}
            >
              <NavLink to="/document">
                <IoCloudDownloadOutline size="24" />
              </NavLink>
              <p className={iconHover || isActive ? "active" : "hiddenName"}>
                내 문서
              </p>
            </li>
            <li onClick={hiddenMydoc}>
              {isLogin ? (
                <button type="button" onClick={onLogout}>
                  LOGOUT
                </button>
              ) : (
                <NavLink to="/login">LOGIN</NavLink>
              )}
            </li>
            <li onClick={hiddenMydoc}>
              <NavLink to="/register">SIGN UP</NavLink>
            </li>
          </ul>
        </nav>
        {/* <div className="header__content__toggle">
          <NavLink to="/login">
            <RiLoginBoxFill />
          </NavLink>
        </div> */}
      </div>
    </header>
  );
};

export default Header;
