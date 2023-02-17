import Information from "./Information";
import { useState, useEffect } from "react";
import axios from "axios";

const ProfileForm = props => {
  //TODO 유저프로필 정보 가져오기 -> 이거는 Profile.js에서 구현하기
  //TODO 수정기능(isDisabled)수정 on/off가능하도록 정의
  //TODO 카카오 연동하기 버튼 (카카오계정이 아니라면)
  //TODO 모든기능 완성후 css수정
  //form에 포함될것 : profileImg, profileName, profileMessage
  //TODO 하위 컴포넌트 state의 setting함수의 주소만 넘겨줘서 사용가능한지 확인하기
  //^^^ 가능하다
  const [isDisabled, setIsDisabled] = useState(true);
  const isDisabledHandler = () => { 
    if (!isDisabled && isFormChange) {
      
    }
    setIsDisabled(!isDisabled); 
    //TODO 저장하기가 눌렸을때(isDisabled == false)
    
  };
  const [isImageChange, setIsImageChange] = useState(false);
  const [isNameChange, setIsNameChange] = useState(false);
  const [isMessageChange, setIsMessageChange] = useState(false);
  const [isFormChange, setIsFormChange] = useState(false);
  useEffect(() => {
    setIsFormChange(isImageChange || isNameChange || isMessageChange);
    console.log(isFormChange);
  }, [isImageChange, isNameChange, isMessageChange]);
  

  const return_result = <form action={`${props.URL}/main/`}>
    <Information 
    type="image"
    src={props.src}
    isChange={setIsImageChange}
    isDisabled={isDisabled}
    />
    <Information 
    type="text"
    isChange={setIsNameChange}
    isDisabled={isDisabled}
    default={props.profileName}
    placeHolder="Name"
    />
    <Information 
    type="text"
    isChange={setIsMessageChange}
    isDisabled={isDisabled}
    default={props.profileMessage}
    placeHolder="Status Message"
    />
    <hr />
    <button 
      className={`isDisabled ${isFormChange ? '' : 'form-changed'}`} 
      onClick={isDisabledHandler}
      type="button">
      { isDisabled ? "수정하기" : "저장하기" }
    </button>
  </form>;
  return (return_result);
}

ProfileForm.defaultProps = {
  URL: "http://localhost:8000",
  src: "http://localhost:8000/media/user_profile/default1.jpg"
}

export default ProfileForm;