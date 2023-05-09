import React, { useRef, useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import "../styles/Mypage.scss";
import Profile from "../components/UserProfile/Profile";

const Mypage = (props) => {

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
