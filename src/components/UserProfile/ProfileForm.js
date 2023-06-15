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
import { serverURL } from "../../settings";

// 프로필 컴포넌트, 기존 프로필 컴포넌트에 현재 컴포넌트 외에 다른기능이 있어 분리 시켰었지만
// 삭제되서 프로필 컴포넌트, 프로필을 표시, 프로필 수정시 프로필의 내용이 변경되었는지 확인하고
// 변경되면 서버에 저장, 패스워드 변경(카카오계정은 안됨), 로그아웃, 계정 삭제 기능 포함
const ProfileForm = (props) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [profileId] = useState(props.profileId);
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
  // form의 내용이 변했나 확인하고 submit
  const isDisabledHandler = () => {
    if (!isDisabled && (isNameChange || isImageChange || isMessageChange)) {
      submitRef.current.submit();
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
      .post(`http://${serverURL}/auth/logout/`, {}, { withCredentials: true })
      .then((res) => {
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
          {isKakao ? <button onClick={(e) => {
            e.preventDefault();
            softAlert('카카오계정으로 로그인되어 있습니다.');
          }}>패스워드 변경</button> : <PassSetting />}
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
        <span className="delete-confirm-message">작성했던 내용은 모두 삭제됩니다</span>
        <div className="delete-confirm">
          {isKakao ? (
            <></>
          ) : (
            <input
            type="password"
            onChange={inputHandler(setConfirmKey)}
            onKeyDown={ifKeyDownEnter(deleteAccount)}
            />
          )}
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
  URL: `http://${serverURL}`,
  src: `http://${serverURL}/media/user_profile/default1.jpg`,
  userId: 0,
};

export default ProfileForm;
