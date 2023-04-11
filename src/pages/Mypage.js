import React, { useRef, useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import "../styles/Mypage.scss";
import Profile from "../components/UserProfile/Profile";

const Mypage = (props) => {
  //다른 곳 클릭시 마이페이지 닫힘
  // let mypageRef = useRef();

  // useEffect(() => {
  //   let handler = (e) => {
  //     if (!mypageRef.current.contains(e.target)) {
  //       setIsSidebarOpen(true);
  //     }
  //   };

  //   document.addEventListener("mousedown", handler);

  //   return () => {
  //     document.removeEventListener("mousedown", handler);
  //   };
  // }, []);

  return (
    <div className="Mypage">
      <MdClose size={28} onClick={props.onCloseClick} className="closeBtn" />
      <h2>My page</h2>
      <Profile type="side" />
      {/* <button onClick={MypageClick}>Close</button> */}
    </div>
  );
};

export default Mypage;
