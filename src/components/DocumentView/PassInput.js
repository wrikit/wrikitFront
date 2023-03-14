import { useState } from "react";

const PassInput = props => {
  const [pass, setPass] = useState('');

  const inputHandler = e => {
    setPass(e.target.value);
  }
  const inputEnterDown = e => {
    (e.key=="Enter") && callbackHandler();
  }
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