import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaFolderOpen } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { SlLogin } from "react-icons/sl";
import {FiSun} from "react-icons/fi";
import {MdDarkMode} from "react-icons/md";
import axios from "axios";
import { serverURL } from "../settings.js";

const Header = (props) => {
  const isLogin = props.isLogin;
  const toggleDarkMode = props.toggleDarkMode;
  const isDarkMode = props.isDarkMode;
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

  //내문서 아이콘 밑에 p태그 등장
  const [iconHover, setIconHover] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === "/document") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [pathname]);

  // 다른 페이지에서 아이콘 호버했을 때
  const handleMouseOver = () => {
    setIconHover(true);
  };
  const handleMouseOut = () => {
    setIconHover(false);
  };

  const MypageClick = () => {
    props.onMenuClick();
  };

  //미니프로필
  const [userName, setUserName] = useState("");
  useEffect(() => {
    axios
      .post(
        `http://${serverURL}/main/get-profile/`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.result) {
          setUserName(res.data.data.profileName);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <header className={`header`}>
      <div className={`header__content ${isScrolled ? "shadow" : ""}`}>
        <a
          href={!isLogin ? "/" : "/document"} //로그인 후 로고클릭 -> 문서페이지로 이동
          className="header__content__logo"
        >
          Wrikit
        </a>
        <nav className="header__content__nav">
          <ul>
            <li
              id="icon"
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              <NavLink to="/document">
                <FaFolderOpen size="24" title="내 문서" />
              </NavLink>
              <p className={iconHover || isActive ? "active" : "hiddenName"}>
                내 문서
              </p>
            </li>
            <li>
              {isLogin ? (
                <div className="iconContainer">
                  <BsPersonCircle
                    size="24"
                    onClick={MypageClick}
                    title="마이페이지"
                  />
                </div>
              ) : (
                <div className="iconContainer">
                  <NavLink to="/lgpage" className="lgbtn-show">
                    시작하기
                  </NavLink>
                  <NavLink to="/lgpage" className="lgbtn-hide">
                    <SlLogin size="23"></SlLogin>
                  </NavLink>
                </div>
              )}
            </li>
            <li onClick={toggleDarkMode}>
              {isDarkMode ? <MdDarkMode size="23"/> : <FiSun size="23" />}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
