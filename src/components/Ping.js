import axios from "axios";
// import { useState } from "react";

const Ping = () => {

  const reqPing = () => {
    axios.post("http://localhost:8000/auth/ping/",
    {} ,
    { withCredentials: true }
    ).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <div>
      <button onClick={reqPing}>
        send test request
      </button>
    </div>
  );
}

export default Ping;
