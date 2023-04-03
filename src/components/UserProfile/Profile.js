import ProfileForm from "./ProfileForm";
import PassSetting from "./PassSetting";
import axios from "axios";
import { useState, useEffect } from "react";

const Profile = (props) => {
  const [name, setName] = useState(false);
  const [message, setMessage] = useState();
  const [src, setSrc] = useState();
  const [userId, setUserId] = useState();
  const [profileId, setProfileId] = useState();
  const [isKakao, setIsKakao] = useState();
  if (name == null) {
    setName("");
  }
  if (message == null) {
    setMessage("");
  }
  if (src == null) {
    setSrc("");
  }

  const getCookie = (key) => {
    let value = document.cookie.match("(^|;) ?" + key + "=([^;]*)(;|$)");
    return value ? value[2] : null;
  };

  useEffect(() => {
    if (getCookie("isKakao") == "true") {
      setIsKakao(true);
    } else {
      setIsKakao(false);
    }
  });
  useEffect(() => {
    const getData = async () => {
      axios
        .post(
          "http://localhost:8000/main/get-profile/",
          {},
          { withCredentials: true }
        )
        .then((res) => {
          if (res.data.data == undefined) {
            alert("로그인이 필요합니다.");
            document.location.href = "/lgpage";
            return 0;
          }
          setName(res.data.data.profileName);
          setMessage(res.data.data.profileMessage);
          setSrc(
            "http://localhost:8000/media/user_profile/" +
              res.data.data.profileImg
          );
          setUserId(res.data.data.userId);
          setProfileId(res.data.data.profileId);
        });
    };
    getData();
  }, []);
  //로그아웃 기능
  const onLogout = () => {
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
  return (
    <div className={props.type} id="profile">
      {name && isKakao != undefined ? (
        <div>
          <ProfileForm
            profileName={name}
            profileMessage={message}
            src={src}
            userId={userId}
            profileId={profileId}
          />
          {isKakao ? "" : <PassSetting />}
          <button onClick={onLogout}>로그아웃</button>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
  // TODO App.js에서 유저정보 쿠키로 만들고 가져오기
  // TODO 카카오계정이면 PassSetting숨기기
};

export default Profile;
