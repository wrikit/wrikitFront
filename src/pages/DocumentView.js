import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PassInput from "../components/DocumentView/PassInput";
import { 
  copyToClipboard, 
  getCookie, 
  softAlert, 
  inputHandler,
  ifKeyDownEnter,
  reactStates } from "../tools";
import MiniProfile from "../components/UserProfile/MiniProfile";
import QuillEditor from "../components/TextEditor/QuillEditor";


const DocumentView = () => {
  const { id } = useParams();
  const [docName, setDocName] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [writer, setWriter] = useState('');
  const [isMine, setIsMine] = useState(false);
  const [saveKey, setSaveKey] = useState(false);
  const [updateKey, setUpdateKey] = useState('');
  const [isDisplay, setIsDisplay] = useState(false);
  const [content, setContent] = useState(false);
  const [updateContent, setUpdateContent] = useState('');
  const [editable, setEditable] = useState(false);
  const [settings, setSettings] = useState({});
  const settingsObj = new reactStates(setSettings, settings);

  const passRef = useRef(null);
  const saveRef = useRef(null);
  const updateInputRef = useRef(null);
  const settingFormRefs = {};
  settingFormRefs.settingForm = useRef(null);
  settingFormRefs.name = useRef(null);
  settingFormRefs.editable = useRef(null);
  settingFormRefs.public = useRef(null);
  settingFormRefs.newPassword = useRef(null);

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
    const editorDiv = document.querySelector(".quill .ql-editor");
    if (copyToClipboard(editorDiv.innerText)) {
      softAlert("복사완료!");
    } else {
      softAlert("복사되지 않았어요 :(");
    }
  }
  const saveForm = event => {
    const editorDiv = document.querySelector(".quill .ql-editor");
    setUpdateContent(editorDiv.innerHTML);
    event.preventDefault();
    saveRef.current.showModal();
    if (saveKey) {
      updateInputRef.current.value = saveKey;
      setUpdateKey(saveKey);
    }
  }
  const settingForm = () => {
    settingFormRefs.name.current.value = settings.name;
    settingFormRefs.editable.current.checked = settings.editable;
    settingFormRefs.public.current.checked = settings.public;
    settingFormRefs.settingForm.current.showModal();
  }
  const resetPassword = () => {
    const newPass = settingFormRefs.newPassword.current.value;
    if (newPass.length && newPass.length <= 20) {
      axios.post(
        "http://localhost:8000/main/set-documentkey/", 
        {
          documentid: id,
          newkey: newPass
        }, 
        { withCredentials: true } )
      .then(res => {
        if (res.data.result) {
          alert(`패스워드가 변경되었습니다.  새로운 패스워드: ${newPass}`);
          settingsObj.write('newPassword', '');
          settingFormRefs.newPassword.current.value = '';
        } else {
          softAlert("패스워드 변경 실패 :(");
        }
      })
    } else {
      softAlert("패스워드는 최대20이고 비워둘수 없습니다");
    }
  }
  const delete_mousedown = event => {
    settingsObj.write('deleteMouseDown', new Date().getTime());
  }
  const documentDelete = event => {
    const now = new Date().getTime();
    if (now > (settings.deleteMouseDown+5000)) {
      axios.post(
        "http://localhost:8000/main/delete-document/",
        { documentid: id },
        { withCredentials: true }
      )
      .then(res => {
        if (res.data.result) {
          document.location.href = "/document";
        } else {
          softAlert("삭제 실패");
        }
      });
    }
  }
  const saveSettings = event => {
    const newName = settingFormRefs.name.current.value;
    if (newName.length) {
      axios.post(
        "http://localhost:8000/main/update-document/",
        { 
          documentid: id,
          documentkey: '',
          docName: newName,
          editable: settings.editable,
          public: settings.public
        },
        { withCredentials: true }
      )
      .then(res => {
        if (res.data.result) {
          settingFormRefs.name.current.value = newName;
          settingFormRefs.settingForm.current.close();
          setDocName(newName);
          softAlert("설정 저장됨");
        } else {
          softAlert("설정 저장실패");
        }
      });
    } else {
      softAlert("제목을 비워둘수 없습니다");
    }
  }
  const update = () => {
    axios.post(
      "http://localhost:8000/main/update-document/",
      { documentid: id, 
        documentkey: updateKey,
        content: updateContent},
        { withCredentials: true } )
    .then(res => {
      if (res.data.result) {
        softAlert("저장완료!");
      } else {
        softAlert("저장실패 :(");
      }
      saveRef.current.close();
    })
  }
  const closeSettingForm = () => {
    settingFormRefs.settingForm.current.close();
  }
  const cantSave = () => {
    softAlert("주인만 수정가능하도록 설정되있어요");
  }
  const saveClone = () => {
    softAlert("업데이트 예정");
  }


  console.log("profileName", profileName);

  useEffect(() => {
    axios.post(
      "http://localhost:8000/main/get-profile/",
      {},
      { withCredentials: true }
    )
    .then(res => {
      const data = res.data.data;
      setProfileName(data.profileName);
    })
    axios.post(
      "http://localhost:8000/main/get-document-name/",
      { documentid: id },
      { withCredentials: true })
    .then(res => {
      if (res.data.result) {
        setDocName(res.data.data);
        setWriter(res.data.username)
        if (res.data.username == profileName) {
          setIsMine(true);
          //TODO: username형식이 카카오이면 
          axios.post(
            "http://localhost:8000/main/get-document/",
            { documentid: id, documentkey:'' },
            { withCredentials: true } )
          .then(res => {
            if (res.data.result) {
              const data = res.data.result;
              setEditable(true);
              setContent(data.content);
              setIsDisplay(true);
              return res.data;
            } else {
              softAlert("오류발생 QoQ");
              console.log('error >>>', res.data.message);
              return false;
            }
          })
          .then(data => {
            if (data) {
              settingsObj.write('name', data.result.docName);
              settingsObj.write('editable', data.result.editable);
              settingsObj.write('public', data.result.public);
            }
          });
        } else if (res.data.public) {
          axios.post(
            "http://localhost:8000/main/get-document/",
            { documentid: id, documentkey:'' })
          .then(res => {
            if (res.data.result) {
              const data = res.data.result;
              setEditable(data.editable);
              setContent(data.content);
              setIsDisplay(true);
            } else {
              softAlert("오류발생 QoQ");
              console.log('error >>>', res.data.message);
            }
          });
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
          });
        }
      } else {
        document.location.href = "/";
      }
    })
    .then(() => {
      
    });
  }, [saveKey, profileName])

  return <div className="document-view">
    <div className="document-info">
      <div className="document-name">
        {docName}
      </div>
      <MiniProfile profileName={writer} />
    </div>
    {isDisplay ? (
      <div className="document-main">
        <QuillEditor data={content} />
        <div className="document-functions">
          <div className="flex-wrap">
            <button className="copy-button" onClick={copyContent} >복사하기</button>
            {editable ? (
              <button className="save-button" onClick={saveForm} >저장하기</button>
            ) : (
              <button className="cant-save" onClick={cantSave}>저장하기</button>
            )}
            {isMine ? (
              <button className="setting-button" onClick={settingForm}>Setting</button>
            ) : (
              <button className="clone-button" onClick={saveClone}>Save as</button>   
            )}
          </div>
        </div>
        <dialog ref={saveRef}>
          <h3>저장하기</h3>
          <div className="input-updatekey">
            <input 
              type="password"
              placeholder={isMine ? ("주인 입니다") : ("password")}
              onChange={inputHandler(setUpdateKey)}
              onKeyDown={ifKeyDownEnter(update)}
              ref={updateInputRef} 
              disabled={isMine} />
            <button className="save-button" onClick={update}>저장</button>
          </div>
          <form method="dialog"><button>취소</button></form>
        </dialog>
        <dialog ref={settingFormRefs.settingForm} className="setting-form" >
          <div className="info">
            <h1>설정</h1>
            <span>작성자만 수정가능 합니다</span>
          </div>
          <div className="flex-wrap">
            <div className="name">
              <span>제목</span>
              <input 
                type="text" 
                ref={settingFormRefs.name} 
                onChange={settingsObj.handle('name')}
                required />
            </div>
            <div className="editable">
              <span>다른사람의 편집허용</span>
              <input 
                type="checkbox" 
                ref={settingFormRefs.editable}
                onChange={settingsObj.handle('editable')} />
            </div>
            <div className="publice">
              <span>패스워드없이 공개</span>
              <input 
                type="checkbox" 
                ref={settingFormRefs.public}
                onChange={settingsObj.handle('public')} />
            </div>
            <hr />
            <div className="password-reset">
              <button onClick={resetPassword}>패스워드 변경</button>
              <input 
                type="text"
                placeholder="최대 20자"
                ref={settingFormRefs.newPassword}
                onChange={settingsObj.handle('newPassword')}
                maxLength={20}
                required />
            </div>
            <span className="delete-info">삭제는 5초이상 눌러주세요</span>
            <div className="buttons">
              <button onClick={saveSettings}>변경 저장</button>
              <button onClick={closeSettingForm}>닫기</button>
              <button 
                onClick={documentDelete} 
                onMouseDown={delete_mousedown} 
                className="delete-button">삭제</button>
            </div>

          </div>
        </dialog>
      </div>
    ) : (
      <div className="pass-input">
        <PassInput 
          callback={inputKeyCB}
          placeHorder="password"
          divClass="passinput-main"
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