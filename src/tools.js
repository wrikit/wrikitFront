// 공통적으로 자주 사용하는 함수들
// 쿠키가져오기, 패스워드 유효성검사, 입력제어함수, ...
// 1. 함수정의
// 2. 파일 마지막 라인의 export {} 부분에 함수 추가

const getCookie = key => {
  let value = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
  return value ? value[2] : null;
}

const inputHandler = (settingFunc) => {
  return (event) => {
    settingFunc(event.target.value);
  };
}

const copyToClipboard = text => {
  if (c2c_use_navigator(text)) {
    return true;
  } else {
    return c2c_exec_command(text);
  }
}
const c2c_use_navigator = text => {
  navigator.clipboard.writeText(text)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    })
}
const c2c_exec_command = text => {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  } catch (error) {
    console.warn(error);
    return false;
  }
}

export { 
  getCookie,
  inputHandler,
  copyToClipboard
};