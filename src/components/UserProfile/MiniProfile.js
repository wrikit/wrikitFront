import { useState, useRef } from "react";
import axios from "axios";
import { serverURL } from "../../settings";

// 마이페이지가 아닌 다른유저의 프로필사진, 상테메세지를 가져오기, 인증 필요없음
const MiniProfile = (props) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [imageClass, setImageClass] = useState("profile-image");
  const profileRef = useRef(null);

  if (name == '' && props.profileName != '') {
    axios
    .post(`http://${serverURL}/main/get-mini-profile/`, {
      profileName: props.profileName,
    })
    .then((res) => {
      if (res.data.result) {
        setLoading(true);
        setName(res.data.profileName);
        if (res.data.profileMessage != null) {
          setMessage(res.data.profileMessage);
        }
        setImage(
          `http://${serverURL}/media/user_profile/${res.data.profileImg}`
        );
        if (res.data.profileName == "탈퇴한 회원입니다") {
          setImageClass("profile-image gray-scale");
        }
      }
    });
  
  }

  return { loading } ? (
    <div className="mini-profile" ref={profileRef}>
      {Boolean(message.length) && (
        <div className="profile-message">{message}</div>
      )}
      <div className="main">
        <div className="image-container">
          <img src={image} className={imageClass} />
        </div>
        <div className="profile-name">{name}</div>
      </div>
    </div>
  ) : (
    <div className="mini-profile"></div>
  );
};

export default MiniProfile;
