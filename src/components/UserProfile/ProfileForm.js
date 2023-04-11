import Information from "./Information";
import { useState, useEffect, useRef } from "react";
import { getCookie } from "../../tools";
import PassSetting from "./PassSetting";
import axios from "axios";

const ProfileForm = (props) => {
  //TODO 카카오 연동하기 버튼 (카카오계정이 아니라면)
  //TODO 모든기능 완성후 css수정
  const [isDisabled, setIsDisabled] = useState(true);
  const [profileId, setProfileId] = useState(props.profileId);
  const [csrf, setCsrf] = useState("");
  const [isImageChange, setIsImageChange] = useState(false);
  const [isNameChange, setIsNameChange] = useState(false);
  const [isMessageChange, setIsMessageChange] = useState(false);
  const [isKakao, setIsKakao] = useState();


  const submitRef = useRef(null);
  const isDisabledHandler = (event) => {
    // event.preventDefault();
    if (!isDisabled && (isNameChange || isImageChange || isMessageChange)) {
      submitRef.current.submit();
      // window.history.back();
    }
    setIsDisabled(!isDisabled);
  };
  const getCsrfToken = () => {
    let csrfToken = "";
    document.cookie.split("; ").map((element) => {
      const [name, ...value] = element.split("=");
      if (name == "csrftoken") {
        csrfToken = value;
      }
    });
    return csrfToken;
  };

  useEffect(() => {
    if (getCookie("isKakao") == "true") {
      setIsKakao(true);
    } else {
      setIsKakao(false);
    }
  });

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
  useEffect(() => {
    setCsrf(getCsrfToken());
  }, []);

  const return_result = (
    <form
      action={`${props.URL}/main/UserProfile/${profileId}/update/`}
      ref={submitRef}
      method="POST"
      data-method="PUT"
      encType="multipart/form-data"
    >
      <input
        type="hidden"
        name="csrfmiddlewaretoken"
        id="form-csrftoken"
        value={csrf}
      />
      <Information
        type="image"
        src={props.src}
        isChange={setIsImageChange}
        isDisabled={isDisabled}
        formName="profileImg"
      />
      <Information
        type="text"
        isChange={setIsNameChange}
        isDisabled={isDisabled}
        default={props.profileName}
        placeHolder="Name"
        formName="profileName"
        infoName="Name"
      />
      <Information
        type="text"
        isChange={setIsMessageChange}
        isDisabled={isDisabled}
        default={props.profileMessage}
        placeHolder="Status Message"
        formName="profileMessage"
        infoName="Message"
      />
      <div className="button_container">
        <button onClick={isDisabledHandler} type="button">
          {isDisabled ? "프로필 수정하기" : "저장하기"}
        </button>
        {isKakao ? 
        <button disabled>
          패스워드 변경
        </button>
        : <PassSetting />}
        
      </div>
      <div className="button_container">
        <button type="button">회원탈퇴</button>
        <button onClick={onLogout} type="button">로그아웃</button>
      </div>
    </form>
  );
  return return_result;
};

ProfileForm.defaultProps = {
  URL: "http://localhost:8000",
  src: "http://localhost:8000/media/user_profile/default1.jpg",
  userId: 0,
};

export default ProfileForm;
