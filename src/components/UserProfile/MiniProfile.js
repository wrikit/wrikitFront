import { useState, useRef } from "react";
import axios from "axios";

const MiniProfile = (props) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [imageClass, setImageClass] = useState("profile-image");
  const profileRef = useRef(null);

  axios
    .post("http://localhost:8000/main/get-mini-profile/", {
      profileName: props.profileName,
    })
    .then((res) => {
      if (res.data.result) {
        setLoading(true);
        setName(res.data.profileName);
        setMessage(res.data.profileMessage);
        setImage(
          `http://localhost:8000/media/user_profile/${res.data.profileImg}`
        );
        if (res.data.profileName == "탈퇴한 회원입니다") {
          setImageClass("profile-image gray-scale");
        }
      }
    });

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
