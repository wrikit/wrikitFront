import React, { useRef, useState, useEffect } from "react";
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
      <button onClick={props.onCloseClick}>Close</button>
      <h2>My page</h2>
      <Profile type="side"></Profile>
      {/* <button onClick={MypageClick}>Close</button> */}
    </div>
  );
};

export default Mypage;
