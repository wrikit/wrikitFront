import ProfileForm from "./ProfileForm";
import axios from "axios";
import { useState, useEffect } from "react";
import { getCookie } from "../../tools";
import { serverURL } from "../../settings";

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
          `http://${serverURL}/main/get-profile/`,
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
            `http://${serverURL}/media/user_profile/` +
              res.data.data.profileImg
          );
          setUserId(res.data.data.userId);
          setProfileId(res.data.data.profileId);
        });
    };
    if (window.location.href == `http://localhost:3000/profile/` || window.location.href == `http://115.85.180.7:3000/profile/`) {
      // 현재 사용되지 않는페이지, 이전 페이지로 보내기
    window.history.go(-1);
    } else {
      // url이 '/'으로 끝나지 않을 경우 페이지에 접근가능
      getData();
    }
  }, []);
  
  // name의 초기값이 false, 데이터가 정상적으로 도착했는지 판별하는데 사용
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
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Profile;
