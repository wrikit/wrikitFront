import React from "react";
import "../styles/Mypage.scss";

const Mypage=(props)=>{
    return(
    <div className="Mypage">
        <button onClick={props.onCloseClick}>Close</button>
    <p>This is Mypage</p>
    </div>
    )
}

export default Mypage;