import Information from "./Information";
import { useState, useEffect, useRef } from "react";
import {
  getCookie,
  inputHandler,
  softAlert,
  ifKeyDownEnter,
} from "../../tools";
import PassSetting from "./PassSetting";
import axios from "axios";
import { FaEdit, FaRegWindowClose } from "react-icons/fa";

const ProfileForm = (props) => {
  //TODO 카카오 연동하기 버튼 (카카오계정이 아니라면)
  //TODO 모든기능 완성후 css수정
  const [isDisabled, setIsDisabled] = useState(true);
  const [profileId, setProfileId] = useState(props.profileId);
  const [csrf, setCsrf] = useState("");
  const [profileName, setProfileName] = useState(props.profileName);
  const [message, setMessage] = useState(props.profileMessage);
  const [imageSrc, setImageSrc] = useState(props.src);
  const [isImageChange, setIsImageChange] = useState(false);
  const [isNameChange, setIsNameChange] = useState(false);
  const [isMessageChange, setIsMessageChange] = useState(false);
  const [isKakao, setIsKakao] = useState();
  const [confirmKey, setConfirmKey] = useState("");

  const submitRef = useRef(null);
  const nameInputRef = useRef(null);
  const deleteAccountRef = useRef(null);
  const isDisabledHandler = (event) => {
    // event.preventDefault();
    if (!isDisabled && (isNameChange || isImageChange || isMessageChange)) {
      submitRef.current.submit();
      // window.history.back();
    }
    if (isDisabled) {
      nameInputRef.current.focus();
    }
    setIsDisabled(!isDisabled);
  };
  const profileNameHandler = (event) => {
    setProfileName(event.target.value);
    if (event.target.value != props.profileName) {
      setIsNameChange(true);
    } else {
      setIsNameChange(false);
    }
  };
  const messageHandler = (event) => {
    setMessage(event.target.value);
    if (event.target.value != props.profileMessage) {
      setIsMessageChange(true);
    } else {
      setIsMessageChange(false);
    }
  };
  const imageHandler = (event) => {
    setImageSrc(URL.createObjectURL(event.target.files[0]));
    setIsImageChange(true);
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

  const deleteAccountModal = () => {
    deleteAccountRef.current.showModal();
  };
  const deleteAccount = () => {
    axios
      .post(
        `${props.URL}/auth/delete/`,
        { userpass: confirmKey },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.result) {
          window.location.href = "/";
        } else {
          softAlert("패스워드를 확인해주세요");
        }
      });
  };

  const return_result = (
    <>
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
        {isDisabled ? (
          <>
            <div>
              <label htmlFor="profile-img">
                <div className="image-container">
                  <img src={imageSrc} className="profile-img" />
                  {!isDisabled && (
                    <div className="editableIcon">
                      <FaEdit size={28} />
                    </div>
                  )}
                </div>
              </label>
              <input
                id="profile-img"
                type="file"
                className="image-input"
                onChange={imageHandler}
                disabled
                name="profileImg"
              />
            </div>
            <div>
              <div className="info_name">Name</div>
              <input
                type="text"
                className="text-input"
                value={profileName}
                onChange={profileNameHandler}
                readOnly
                placeholder="Name"
                name="profileName"
                ref={nameInputRef}
              />
            </div>
            <div>
              <div className="info_name">Message</div>
              <input
                type="text"
                className="text-input"
                value={message}
                onChange={messageHandler}
                readOnly
                placeholder="Message"
                name="profileMessage"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="profile-img">
                <div className="image-container">
                  <img src={imageSrc} className="profile-img" />
                  {!isDisabled && (
                    <div className="editableIcon">
                      <FaEdit size={28} />
                    </div>
                  )}
                </div>
              </label>
              <input
                id="profile-img"
                type="file"
                className="image-input"
                onChange={imageHandler}
                name="profileImg"
              />
            </div>
            <div>
              <div className="info_name">Name</div>
              <input
                type="text"
                className="text-input"
                value={profileName}
                onChange={profileNameHandler}
                placeholder="Name"
                ref={nameInputRef}
                name="profileName"
              />
            </div>
            <div>
              <div className="info_name">Message</div>
              <input
                type="text"
                className="text-input"
                value={message}
                onChange={messageHandler}
                placeholder="Message"
                name="profileMessage"
              />
            </div>
          </>
        )}

        <div className="button_container">
          <button onClick={isDisabledHandler} type="button">
            {isDisabled ? "프로필 수정하기" : "저장하기"}
          </button>
          {isKakao ? <button disabled>패스워드 변경</button> : <PassSetting />}
        </div>
        <div className="button_container">
          <button type="button" onClick={deleteAccountModal}>
            회원탈퇴
          </button>
          <button onClick={onLogout} type="button">
            로그아웃
          </button>
        </div>
      </form>
      <dialog ref={deleteAccountRef} className="delete-confirm-modal">
        <h2>회원탈퇴</h2>
        <div className="delete-confirm">
          <input
            type="password"
            onChange={inputHandler(setConfirmKey)}
            onKeyDown={ifKeyDownEnter(deleteAccount)}
          />
          <button type="button" onClick={deleteAccount}>
            탈퇴하기
          </button>
        </div>
        <form method="dialog">
          <button>
            <FaRegWindowClose />
            <span> 취소</span>
          </button>
        </form>
      </dialog>
    </>
  );
  return return_result;
};

ProfileForm.defaultProps = {
  URL: "http://localhost:8000",
  src: "http://localhost:8000/media/user_profile/default1.jpg",
  userId: 0,
};

export default ProfileForm;
