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

const ifKeyDownEnter = (callback=(() => {return true}), ...args) => {
  const return_func = event => {
    event.preventDefault();
    if (event.key === 'Enter') {
      callback.apply(null, args);
    } else {
      return false;
    }
  }
  return return_func;
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

const softAlert = (content, displayTime=1, inTime=1, outTime=1, maxOpacity=0.6) => {
  const messageWrap = document.createElement('div');
  const message = document.createElement('div');
  message.innerText = content;
  messageWrap.appendChild(message);
  const fade_in = () => {
    let now = new Date().getTime();
    if ((start + inTime*1000) < now) {
      messageWrap.style.opacity = maxOpacity;
      display();
    } else {
      messageWrap.style.opacity = maxOpacity*((now-start)/(inTime*1000));
      window.requestAnimationFrame(fade_in);
    }
  }
  const display = () => {
    setTimeout(() => {
      now = new Date().getTime();
      end = now + outTime*1000;
      fade_out();
    }, displayTime*1000);
  }
  const fade_out = () => {
    if (end < now) {
      messageWrap.remove();
      return true;
    } else {
      now = new Date().getTime();
      messageWrap.style.opacity = maxOpacity*((end-now)/(outTime*1000));
      window.requestAnimationFrame(fade_out);
    }
  }
  // message_wrap.style.opacity
  const wrapStyles = {
    'text-align': 'center',
    'position': 'fixed',
    'padding': '0 10vw',
    'bottom': '3rem',
    'width': '100%',
    'opacity': '0'
  }
  const messageStyles = {
    'font-size': '1rem',
    'line-height': '2rem',
    'margin': '0 auto',
    'font-size': '16px',
    'width': `${16*content.length + 30}px`,
    'text-align': 'center',
    'background-color': 'black',
    'color': 'white',
    'height': '2rem',
    'border-radius': '1rem'
  }
  for (const key in wrapStyles) {
    messageWrap.style[key] = wrapStyles[key];
  }
  for (const key in messageStyles) {
    message.style[key] = messageStyles[key];
  }
  document.body.appendChild(messageWrap);
  // fade part
  let start = new Date().getTime();
  let now, end;
  fade_in();
}

const clearEventListener = element => {
  const clone = element.cloneNode(true);
  element.parentNode.replaceChild(clone, element);
}


export { 
  getCookie,
  inputHandler,
  ifKeyDownEnter,
  copyToClipboard,
  softAlert,
  clearEventListener
};