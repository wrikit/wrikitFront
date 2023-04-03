import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { throttle } from "lodash";
// import { GrCloudDownload } from "react-icons/gr";
// import { IoCloudDownloadOutline } from "react-icons/io5";
import { FaFolderOpen } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { SlLogin } from "react-icons/sl";
import { FaWindowClose } from "react-icons/fa";
import { RiLoginBoxFill } from "react-icons/ri";
import axios from "axios";

const Header = (props) => {
  const isLogin = props.isLogin;
  // console.log("Header ::", isLogin);
  const onLogout = () => {
    // sessionStorage.removeItem("user_id");

    axios
      .post("http://localhost:8000/auth/logout/", {}, { withCredentials: true })
      .then((res) => {
        // if (Kakao.Auth.getAccessToken()) {
        //   Kakao.API.request({
        //     url: '/v1/user/unlink',
        //     success: response => {
        //       console.log(response);
        //     },
        //     fail: error => {
        //       console.log(error);
        //     },
        //   })
        //   Kakao.Auth.setAccessToken(undefined);
        // }
      })
      .then(() => {
        document.location.href = "/";
      });
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

  //헤더 드롭다운
  const [isDropdownOpened, setDropdownOpened] = useState(false);

  // 반응형 드롭다운 -> X 버튼(닫기) 생성
  const dropdownRef = useRef();
  const [closeBtn, setCloseBtn] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 767) {
        setCloseBtn(true);
      } else {
        setCloseBtn(false);
      }
    }
    // 드롭다운 외 다른 곳 클릭시 드롭다운 닫힘
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpened(false);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpened]);

  //마이페이지 클릭
  const MypageClick = () => {
    props.onMenuClick();
    setDropdownOpened(false);
  };

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
              onClick={() => {
                showMydoc();
                setDropdownOpened(false);
              }}
            >
              <NavLink to="/document">
                <FaFolderOpen size="24" />
              </NavLink>
              <p className={iconHover || isActive ? "active" : "hiddenName"}>
                내 문서
              </p>
            </li>
            <li onClick={hiddenMydoc}>
              {/* {isLogin ? (<button type="button" onClick={onLogout}>LOGOUT</button>) : (<NavLink to="/lgpage">시작하기</NavLink>)} */}
              {isLogin ? (
                <div className="iconContainer">
                  <BsPersonCircle
                    size="24"
                    onClick={() => setDropdownOpened(!isDropdownOpened)}
                  />
                  {isDropdownOpened && (
                    <ul className="dropdownMenu" ref={dropdownRef}>
                      {closeBtn && (
                        <li id="closeButton">
                          <FaWindowClose
                            size="30"
                            onClick={() => setDropdownOpened(false)}
                          />
                        </li>
                      )}
                      <li onClick={MypageClick}>Mypage</li>
                      <li onClick={onLogout}>Logout</li>
                    </ul>
                  )}
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
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
