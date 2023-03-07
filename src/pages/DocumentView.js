import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PassInput from "../components/DocumentView/PassInput";
import { 
  copyToClipboard, 
  getCookie, 
  softAlert, 
  clearEventListener, 
  inputHandler,
  ifKeyDownEnter } from "../tools";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import MiniProfile from "../components/UserProfile/MiniProfile";


const DocumentView = () => {
  const { id } = useParams();
  const [docName, setDocName] = useState(false);
  const [writer, setWriter] = useState('');
  const [saveKey, setSaveKey] = useState(false);
  const [updateKey, setUpdateKey] = useState('');
  const [isDisplay, setIsDisplay] = useState(false);
  const [content, setContentBefore] = useState(false);
  const [updateContent, setUpdateContent] = useState('');
  const [editable, setEditable] = useState();
  const passRef = useRef(null);
  const saveRef = useRef(null);
  const updateInputRef = useRef(null);

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
        const data = res.data.result;
        setContent(data.content);
        if(data.username == getCookie('username') || data.editable) {
          setEditable(true);
        } else {
          setEditable(false);
        }
        if (getCookie('username') != 'null') {
          axios.post(
            `${URL}main/add-document-key/`,
            {documentid: id, documentkey: key},
            { withCredentials: true })
          .then(() => {
            softAlert("패스워드 저장완료");
          });

        }
        setIsDisplay(true);
      } else {
        softAlert("패스워드가 일치하지 않습니다");
        passRef.current.focus();
      }
    });
  }
  const copyContent = () => {
    const editorDiv = document.querySelector(".ck-content");
    if (copyToClipboard(editorDiv.innerText)) {
      softAlert("복사완료!");
    } else {
      softAlert("복사되지 않았어요 :(");
    }
  }
  const saveForm = event => {
    softAlert("TEST: 저장버튼");
    const editorDiv = document.querySelector(".ck-content");
    let temp = editorDiv.innerHTML.replaceAll('<br><br data-cke-filler="true">','__emptytablecell__');
    temp = temp.replaceAll('<span class="ck-table-bogus-paragraph"><br data-cke-filler="true"></span>','<span class="ck-table-bogus-paragraph">__emptytablecell__</span>');
    setUpdateContent(temp);
    event.preventDefault();
    saveRef.current.showModal();
    if (saveKey) {
      updateInputRef.current.value = saveKey;
      setUpdateKey(saveKey);
    }
  }
  const update = () => {
    axios.post(
      "http://localhost:8000/main/update-document/",
      { 
        documentid: id, 
        documentkey: updateKey,
        content: updateContent})
    .then(res => {
      if (res.data.result) {
        softAlert("저장완료!");
      } else {
        softAlert("저장실패 :(");
      }
    })

  }
  const cantSave = () => {
    softAlert("주인만 수정가능하도록 설정되있어요");
  }
  const saveClone = () => {
    softAlert("업데이트 예정");
  }
  const setContent = html => {
    html = html.replaceAll('__emptytablecell__','');
    setContentBefore(html);
  }
  const ckeditorTableClear = () => {
    let tableBrs = document.querySelectorAll(".ck-content td br");
    // tableBrs = [...tableBrs];
    // let empty = tableBrs.filter(br => br.getAttribute('data-cke-filler')!='true');
    for (let br of tableBrs) {
      if (br.getAttribute('data-cke-filler')!='true') {
        // console.log(br);
        br.remove();
        console.log(br);
      }
    }    
    // for (let e of empty) {
    //   e.parentNode.innerHTML='<br data-cke-filler="true">';
    //   console.log(e.parentNode);
    // }
  }

  axios.post(
    "http://localhost:8000/main/get-document-name/",
    { documentid: id },
    { withCredentials: true })
  .then(res => {
    if (res.data.result) {
      setDocName(res.data.data);
      setWriter(res.data.username)
      if (res.data.public) {
        setIsDisplay(true);
      } else {
        getSaveKey(id);
      }
      return true;
    } else {
      alert("문서가 존재하지 않습니다 :(");
      return false;
    }
  })
  .then(isExist => {
    if (isExist) {
      if (saveKey) {
        axios.post(
          "http://localhost:8000/main/get-document/",
          { documentid: id, documentkey: saveKey })
        .then(res => {
          if (res.data.result) {
            const data = res.data.result;
            if(data.username == getCookie('username') || data.editable) {
              setEditable(true);
            } else {
              setEditable(false);
            }
            setContent(data.content);
            setIsDisplay(true);
          } else {
            setSaveKey(false);
            axios.post(
              "http://localhost:8000/main/delete-document-key/",
              { delete: id },
              { withCredentials: true });
          }
        }).then(() => {
          ckeditorTableClear();
        });
      }
    } else {
      document.location.href = "/";
    }
  });

  useEffect(() => {}, [])

  return <div className="document-view">
    <div className="document-info">
      <div className="document-name">
        {docName}
        {/* <span className="writer-name">{writer}</span> */}
      </div>
      <MiniProfile profileName={writer} />
    </div>
    {isDisplay ? (
      <div>
        <CKEditor
          editor={ClassicEditor}
          data={content}
          onReady={() => {
            return true;
          }} />
        
        <button className="copy-button" onClick={copyContent} >복사하기</button>
        {editable ? (
          <button className="save-button" onClick={saveForm} >저장하기</button>
        ) : (
          <button className="cant-save" onClick={cantSave}>저장하기</button>
        )}
        <button className="clone-button" onClick={saveClone}>Save as</button>
        <dialog ref={saveRef}>
          <h3>저장하기</h3>
          <input 
            type="password"
            placeholder="password"
            onChange={inputHandler(setUpdateKey)}
            onKeyDown={ifKeyDownEnter(update)}
            ref={updateInputRef} />
            <br />
            <button className="save-button" onClick={update}>저장</button>
          <form method="dialog"><button>취소</button></form>
        </dialog>
      </div>
    ) : (
      <div className="pass-input">
        <PassInput 
          callback={inputKeyCB}
          placeHorder="password"
          divClass="passinut-main"
          buttonClass="passinput-button"
          inputClass="passinput-input"
          inputRef={passRef} />
          {(getCookie('username') == 'null') ? (
            <p className="info">
              로그인 하시면 한번 입력한 키를 저장해두고 사용가능해요. <br />
              <a href="http://localhost:3000/lgpage">로그인 하러가기</a>
            </p>                        
          ) : (
            <p className="info">
              한번입력한 패스워드는 저장되고 다음에 자동으로 사용되요.
            </p>
          )}
      </div>
      
    )}
  </div>;
};

export default DocumentView;