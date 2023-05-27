import { useState } from "react";

// 패스워드가 저장되 있지 않을 경우 패스워드 입력에 사용되는 컴포넌트
const PassInput = props => {
  const [pass, setPass] = useState('');

  const inputHandler = e => {
    setPass(e.target.value);
  }
  const inputEnterDown = e => {
    (e.key=="Enter") && callbackHandler();
  }
  // 패스워드 입력후 실행할 함수
  const callbackHandler = () => {
    props.callback(pass);
  }


  return <div className={props.divClass} >
    <input 
      type="password" 
      className={props.inputClass} 
      onChange={inputHandler} 
      onKeyDown={inputEnterDown} 
      placeholder={props.placeHorder}
      ref={props.inputRef} />
    <button className={props.buttonClass} onClick={callbackHandler}>
      {props.buttonText}
    </button>
  </div>;
}

PassInput.defaultProps = {
  title: '',
  callback: () => {},
  divClass: '',
  inputClass: '',
  buttonClass: '',
  placeHorder: '',
  buttonText: 'OK',
  inputRef: null
}

export default PassInput;