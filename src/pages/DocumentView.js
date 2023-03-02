import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PassInput from "../components/DocumentView/PassInput";
import ContentBox from "../components/DocumentView/ContentBox";
import { copyToClipboard, getCookie, softAlert } from "../tools";

const DocumentView = () => {
  const { id } = useParams();
  const [docName, setDocName] = useState(false);
  const [saveKey, setSaveKey] = useState(false);
  const [isDisplay, setIsDisplay] = useState(false);
  const [content, setContent] = useState(false);
  const passRef = useRef(null);
  // TODO 문서이름 가져오는 api만들기 ...OK
  // TODO 프로필받아서 키를 가지고있는지 확인 ...OK
  // TODO 문서이름표시, 비밀번호 입력받아서 서버로 요청 ...OK
  // TODO 비밀번호를 입력받는 컴포넌트 -> css만하면됨
  //  ^^^ props -> 문서이름, 입력받은뒤 실행할 콜벡 ...OK
  // TODO 문서내용을 표시하고 제어할 컴포넌트 -> TextEditor필요
  // TODO 요청결과에 화면에표시 -> TextEditor.js를 약간 수정해서 사용가능
  // TODO 문서가 수정가능한지 확인, 수정기능 on/off
  // TODO 만약 로그인 상태에서 입력한 문서비밀번호가 일치하면 저장 ...OK
  // TODO 복사하기 버튼 ...OK
  const getSaveKey = (docId) => {
    axios.post(
      "http://localhost:8000/main/get-documentkey/",
      {},
      { withCredentials: true })
    .then(res => {
      const keys = res.data.keys;
      if (docId in keys) {
        setSaveKey(keys[docId]);
      }
    });
  }
  const inputKeyCB = (key, URL='http://localhost:8000/') => {
    axios.post(
      `${URL}main/get-document/`,
      {documentid: id, documentkey: key})
    .then(res => {
      if (res.data.result) {
        setContent(res.data.result.content);
        if (getCookie('username') != 'null') {
          axios.post(
            `${URL}main/add-document-key/`,
            {documentid: id, documentkey: key},
            { withCredentials: true });
        }
        setIsDisplay(true);
      } else {
        softAlert("패스워드가 일치하지 않습니다");
        passRef.current.focus();

      }
    });
  }
  const copyContent = () => {
    if (copyToClipboard(content)) {
      softAlert(true);
    } else {
      softAlert(false);
    }
  }

  axios.post(
    "http://localhost:8000/main/get-document-name/",
    { documentid: id },
    { withCredentials: true })
  .then(res => {
    if (res.data.result) {
      setDocName(res.data.data);
      if (res.data.public) {
        setIsDisplay(true);
      } else {
        getSaveKey(id);
      }
      return true;
    } else {
      softAlert("문서가 존재하지 않습니다 :(");
      return false;
    }
  })
  .then(isExist => {
    if (isExist) {
      if (saveKey) {
        axios.post(
          "http://localhost:8000/main/get-document/",
          { documentid: id,
            documentkey: saveKey })
        .then(res => {
          if (res.data.result) {
            setContent(res.data.result.content);
            setIsDisplay(true);
          } else {
            axios.post(
              "http://localhost:8000/main/delete-document-key/",
              { delete: id },
              { withCredentials: true });
          }
        });
      }
    } else {
      document.location.href = "/";
    }
  });

  return <div className="document-view">
    {isDisplay ? (
      <div>
        <div className="document-name">{docName}</div>
        <ContentBox 
          content={content}
          divClass='content-main'
          contentClass='content-text' />
        <button className="copy-button" onClick={copyContent} >복사하기</button>
      </div>
    ) : (
      <div className="pass-input">
        <PassInput 
          documentName={docName} 
          callback={inputKeyCB}
          placeHorder="password"
          divClass="passinut-main"
          buttonClass="passinput-button"
          inputClass="passinput-input"
          inputRef={passRef} />
        <p className="info">
          로그인 하시면 한번 입력한 키를 저장해두고 사용가능해요. <br />
          <a href="http://localhost:3000/lgpage">로그인 하러가기</a>
        </p>
      </div>
      
    )}
  </div>;
};

export default DocumentView;