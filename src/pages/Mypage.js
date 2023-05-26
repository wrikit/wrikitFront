import React from "react";
import { MdClose } from "react-icons/md";
import "../styles/Mypage.scss";
import Profile from "../components/UserProfile/Profile";

const Mypage = (props) => {

  return (
    <div className="Mypage">
      <MdClose size={28} onClick={props.onCloseClick} className="closeBtn" />
      <h2>My page</h2>
      {/* 사이드바 형식으로 렌더링 */}
      <Profile type="side" />
    </div>
  );
};

export default Mypage;
