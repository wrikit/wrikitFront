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
  reactStates,
} from "../tools";
import MiniProfile from "../components/UserProfile/MiniProfile";
import QuillEditor from "../components/TextEditor/QuillEditor";
import Mypage from "./Mypage.js";
import { VscLink, VscEdit, VscCloudDownload } from "react-icons/vsc";
import html2pdf from "html2pdf.js";
import { serverURL } from "../settings";
import { FiSun } from "react-icons/fi";
import { MdDarkMode } from "react-icons/md";

// 문서를 보는 컴포넌트, 만약 로그인 상태라면 저장된 키를 가져오고 저장되있지 않다면 한번 입력받고 계정에 저장
// 문서의 데이터는 모두 html 그대로 저장됨 -> 서버에서 가져와서 innerHTML로 바로 사용가능, 다른 html 기능으로 확장가능
// type은 editor, reader 두가지, 각각 수정가능 페이지, 읽기전용 페이지
// editor에서 패스워드가 있어 저장 가능한 경우 2분마다 자동저장
const DocumentView = (props) => {
  const { id, type } = useParams();
  const [docName, setDocName] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [writer, setWriter] = useState("");
  const [isMine, setIsMine] = useState(false);
  const [saveKey, setSaveKey] = useState(false);
  const [updateKey, setUpdateKey] = useState("");
  const [isDisplay, setIsDisplay] = useState(false);
  const [content, setContent] = useState(false);
  const [editable, setEditable] = useState(false);
  const [settings, setSettings] = useState({});
  // state 가 너무 많아서 다른 파일에서 state들을 관리하는 class 정의
  const settingsObj = new reactStates(setSettings, settings);
  const [autosave, setAutosave] = useState({});
  const autosaveObj = new reactStates(setAutosave, autosave); 

  // 잘못된 url은 뒤로 보냄
  let typeArr = ["editor", "reader"];
  if (!typeArr.includes(type)) {
    window.history.go(-1);
  }

  const passRef = useRef(null);
  const saveRef = useRef(null);
  const updateInputRef = useRef(null);
  const settingFormRefs = {};
  const htmlPdfRef = useRef(null);
  settingFormRefs.settingForm = useRef(null);
  settingFormRefs.name = useRef(null);
  settingFormRefs.editable = useRef(null);
  settingFormRefs.public = useRef(null);
  settingFormRefs.newPassword = useRef(null);
  const autosaveRef = useRef(null);

  const getSaveKey = (docId) => {
    axios
      .post(
        `http://${serverURL}/main/get-documentkey/`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        const keys = res.data.keys;
        if (docId in keys) {
          setSaveKey(keys[docId]);
        }
      });
  };
  // 패스워드를 입력받은 다음에 동작하는 함수
  const inputKeyCB = (key, URL = `http://${serverURL}/`) => {
    axios
      .post(`${URL}main/get-document/`, { documentid: id, documentkey: key })
      .then((res) => {
        if (res.data.result) {
          const data = res.data.result;
          const doc_html = data.content;
          setContent(doc_html);
          // 자동저장
          if (data.username == getCookie("username") || data.editable) {
            setEditable(true);
            if (type == 'editor') {
              autosaveObj.write("autosave", true);
              const intervalId = setInterval(() => {
                update();
              }, 120 * 1000);
              autosaveObj.write("intervalId", intervalId);  
            }
          } else {
            setEditable(false);
          }
          if (getCookie("username") != "null") {
            axios
              .post(
                `${URL}main/add-document-key/`,
                { documentid: id, documentkey: key },
                { withCredentials: true }
              )
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
  };
  const copyContent = () => {
    const editorDiv = document.querySelector(".quill .ql-editor");
    if (copyToClipboard(editorDiv.innerText)) {
      softAlert("복사완료!");
    } else {
      softAlert("복사되지 않았어요 :(");
    }
  };
  // 저장 모달 오픈
  const saveForm = (event) => {
    event.preventDefault();
    saveRef.current.showModal();
    if (saveKey) {
      updateInputRef.current.value = saveKey;
      setUpdateKey(saveKey);
    }
  };
  // 설정 모달 오픈
  const settingForm = () => {
    settingFormRefs.name.current.value = settings.name;
    settingFormRefs.editable.current.checked = settings.editable;
    settingFormRefs.public.current.checked = settings.public;
    settingFormRefs.settingForm.current.showModal();
  };
  // 설정에서 패스워드 변경, 최대 20자
  const resetPassword = () => {
    const newPass = settingFormRefs.newPassword.current.value;
    if (newPass.length && newPass.length <= 20) {
      axios
        .post(
          `http://${serverURL}/main/set-documentkey/`,
          {
            documentid: id,
            newkey: newPass,
          },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.data.result) {
            alert(`패스워드가 변경되었습니다.  새로운 패스워드: ${newPass}`);
            settingsObj.write("newPassword", "");
            settingFormRefs.newPassword.current.value = "";
          } else {
            softAlert("패스워드 변경 실패 :(");
          }
        });
    } else {
      softAlert("패스워드는 최대20이고 비워둘수 없습니다");
    }
  };
  //문서 삭제
  const deleteDocument = () => {
    axios
      .post(
        `http://${serverURL}/main/delete-document/`,
        { documentid: id },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.result) {
          alert("삭제완료");
          window.location.href = "/document";
        }
      });
  };

  const saveSettings = () => {
    const newName = settingFormRefs.name.current.value;
    if (newName.length) {
      axios
        .post(
          `http://${serverURL}/main/update-document/`,
          {
            documentid: id,
            documentkey: "",
            docName: newName,
            editable: settings.editable,
            public: settings.public,
            savetoken: 'false'
          },
          { withCredentials: true }
        )
        .then((res) => {
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
  };
  const update = () => {
    const saveToken = 'false';
    updateImage(saveToken);
    softAlert("저장중 ...");
    setTimeout(() => {
      updateContent(saveToken);
    }, 5000);
    // updateContent(updateImage());
  }
  const updateImage = (saveToken) => {
    let editorDiv = document.querySelector(".quill .ql-editor");
    const images = editorDiv.querySelectorAll("img");
    if (images != null) {
      images.forEach(element => {
        let src = element.src;
        if (src.slice(0, 4) == "data") {
          const imageNum = Math.floor(Math.random() * 1000);
          const imageName = `${id}_${imageNum}`;
          // let imageType = src.substring(0, src.indexOf(";"));
          // imageType = imageType.slice(imageType.indexOf('/')+1, imageType.length);
          // element.src = `http://${serverURL}/media/document/${imageName}.${imageType}`;
          axios.post(
            `http://${serverURL}/main/upload-image/`,
            {
              name: imageName,
              documentid: id,
              dataurl: src,
              savetoken: saveToken
            }
          )
          .then(res => {
            element.src = `http://${serverURL}/media/document/${res.data['name']}`;        
          });
        } ;
      });
    }
    return saveToken;  
  }
  const updateContent = (saveToken) => {
    let editorDiv = document.querySelector(".quill .ql-editor");
    axios
      .post(
        `http://${serverURL}/main/update-document/`,
        {
          documentid: id,
          documentkey: updateKey,
          content: editorDiv.innerHTML,
          savetoken: String(saveToken)
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.result) {
          softAlert("저장완료!");
        } else {
          softAlert("저장실패 :(");
        }
        saveRef.current.close();
      });
  };
  const closeSettingForm = () => {
    settingFormRefs.settingForm.current.close();
  };
  const cantSave = () => {
    softAlert("주인만 수정가능하도록 설정되있어요");
  };

  // PDF저장
  const savePdf = () => {
    const editorDiv = document.querySelector(".quill .ql-editor");
    htmlPdfRef.current.innerHTML = editorDiv.innerHTML;

    const quotes = htmlPdfRef.current.querySelectorAll("blockquote");
    quotes.forEach((element) => {
      element.innerHTML = `<p style="border-left: 5px solid #bbbbbb; padding: 0 0 0 8px; margin: 2px 0 2px 0;">${element.innerText}</p>`;
    });
    // 문서 내의 이미지들이 너무 크면 화면너비를 넘어가서 최대너비 100%로 제한
    const images = htmlPdfRef.current.querySelectorAll("img");
    images.forEach((element) => {
      element.style["max-width"] = "100%";
    });
    // PDF 변환 관련 설정값들
    const opt = {
      margin: 0.3,
      filename: `${docName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().from(htmlPdfRef.current).set(opt).save();
  };

  //링크복사 버튼
  const copyLink = () => {
    let href = window.location.href;
    let target = href.substring(0, href.lastIndexOf("/") + 1) + "reader";
    copyToClipboard(target);
    softAlert("링크 복사됨");
  };

  //편집페이지로 이동
  const editPage = () => {
    let href = window.location.href;
    let target = href.substring(0, href.lastIndexOf("/") + 1) + "editor";
    window.location.href = target;
  };

  //문서리스트 페이지로 이동
  const goToDocList = () => {
    window.location.href = "/document";
  };

  //마이페이지 열림/닫힘 (상태)
  const [showProfile, setShowProfile] = useState(false);
  // 마이페이지 이벤트_onClick Event
  const mypageClick = () => {
    setShowProfile(true);
  };
  // 마이페이지내에 닫힘 버튼 => Mypage Component에 props 전달
  const closeMypage = () => {
    setShowProfile(false);
  };

  //모바일 환경에서 문서작성 타이핑 중에는 하단 메뉴 안 보이게 설정
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    axios
      .post(
        `http://${serverURL}/main/get-profile/`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.result) {
          const data = res.data.data;
          setProfileName(data.profileName);  
        }
      });
    axios
      .post(
        `http://${serverURL}/main/get-document-name/`,
        { documentid: id },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.result) {
          setDocName(res.data.data);
          setWriter(res.data.username);
          if (res.data.username == profileName) {
            setIsMine(true);
            axios
              .post(
                `http://${serverURL}/main/get-document/`,
                { documentid: id, documentkey: "" },
                { withCredentials: true }
              )
              .then((res) => {
                if (res.data.result) {
                  const data = res.data.result;
                  setEditable(true);
                  setContent(data.content);
                  setIsDisplay(true);
                  if (type == 'editor') {
                    autosaveObj.write("autosave", true);
                    const intervalId = setInterval(() => {
                      update();
                    }, 120 * 1000);
                    autosaveObj.write("intervalId", intervalId);
                  }
                  return res.data;
                } else {
                  softAlert("오류발생 QoQ");
                  return false;
                }
              })
              .then((data) => {
                if (data) {
                  settingsObj.write("name", data.result.docName);
                  settingsObj.write("editable", data.result.editable);
                  settingsObj.write("public", data.result.public);
                }
              });
          } else if (res.data.public) {
            axios
              .post(`http://${serverURL}/main/get-document/`, {
                documentid: id,
                documentkey: "",
              })
              .then((res) => {
                if (res.data.result) {
                  const data = res.data.result;
                  setEditable(data.editable);
                  setContent(data.content);
                  setIsDisplay(true);
                } else {
                  softAlert("오류발생 QoQ");
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
      .then((isExist) => {
        if (isExist) {
          if (saveKey) {
            axios
              .post(`http://${serverURL}/main/get-document/`, {
                documentid: id,
                documentkey: saveKey,
              })
              .then((res) => {
                if (res.data.result) {
                  const data = res.data.result;
                  if (data.username == getCookie("username") || data.editable) {
                    setEditable(true);
                    if (type == 'editor') {
                      autosaveObj.write("autosave", true);
                      const intervalId = setInterval(() => {
                        update();
                      }, 120 * 1000);
                      autosaveObj.write("intervalId", intervalId);  
                    }
                  } else {
                    setEditable(false);
                  }
                  setContent(data.content);
                  setIsDisplay(true);
                } else {
                  // 저장된 키가 틀리면 삭제
                  setSaveKey(false);
                  axios.post(
                    `http://${serverURL}/main/delete-document-key/`,
                    { delete: id },
                    { withCredentials: true }
                  );
                }
              });
          }
        } else {
          document.location.href = "/";
        }
      })
      .then(() => {});
  }, [saveKey, profileName]);

  return (
    <div className={`${type} document-view`}>
      <div className="document-header">
        <div className="document-info">
          <div className="document-name">{docName}</div>
          <MiniProfile profileName={writer} />
        </div>
        <div className="header-button">
          {type == "reader" ? (
            <div className="edit-page" onClick={editPage}>
              <VscEdit />
              <span className="edit-page-text">편집</span>
            </div>
          ) : (
            <></>
          )}
          <div className="copy-link" onClick={copyLink}>
            <VscLink />
            <span className="copy-link-text">링크복사</span>
          </div>
          {/* 모바일 환경(헤더 X) -> 다크모드 버튼 링크 복사 아이콘 옆으로 재배치 */}
          <div className="mobile-darkmode" onClick={props.setDarkMode}>
            {props.isDarkMode ? (<MdDarkMode size={23} />) : (<FiSun size={23} />)}
            <span></span>
          </div>
        </div>
      </div>
      {isDisplay ? (
        <div className="document-main">
          <QuillEditor
            data={content}
            type={type}
            isFocused={isFocused}
            setIsFocused={setIsFocused}
          />
          {/* 하단 메뉴(모바일환경에서 타이핑 중에는 보이지 않음)*/}
          <div className={`document-functions ${isFocused ? "hidden" : null}`}>
            <div className="flex-wrap btnGroup1">
              <button className="copy-button" onClick={copyContent}>
                복사하기
              </button>
              {editable ? (
                <button className="save-button" onClick={saveForm}>
                  저장하기
                </button>
              ) : (
                <button className="cant-save" onClick={cantSave}>
                  저장하기
                </button>
              )}
              {/* 세부적인 설정은 문서주인만 가능 */}
              {isMine ? (
                <button className="setting-button" onClick={settingForm}>
                  Setting
                </button>
              ) : (
                <></>
              )}
              <button className="pdf-button" onClick={savePdf}>
                <VscCloudDownload />
                <span>PDF</span>
              </button>
            </div>
            {/* 모바일 환경에서 헤더 대신 하단 메뉴 추가 */}
            <div className="flex-wrap btnGroup2">
              <button className="docList-button" onClick={goToDocList}>
                문서목록
              </button>
              <button className="mypage-button" onClick={mypageClick}>
                마이페이지
              </button>
            </div>
          </div>
          <div
            className="pdf-html document-functions hidden quill ql-editor"
            ref={htmlPdfRef}
          >
          </div>
          {/* 마이페이지 컴포넌트 렌더링 */}
          {showProfile && <Mypage onCloseClick={closeMypage} />}
          {/* 문서 저장 및 설정 관련 모달 */}
          <dialog ref={saveRef}>
            <h3>저장하기</h3>
            <div className="input-updatekey">
              <input
                type="password"
                placeholder={isMine ? "주인 입니다" : "password"}
                onChange={inputHandler(setUpdateKey)}
                onKeyDown={ifKeyDownEnter(update)}
                ref={updateInputRef}
                disabled={isMine}
              />
              <button className="save-button" onClick={update}>
                저장
              </button>
            </div>
            <div className="auto-save">
              <span>자동저장</span>
              <input
                type="checkbox"
                ref={autosaveRef}
                checked={autosaveObj.data["autosave"]}
                onChange={autosaveObj.handle("autosave", () => {
                  if (autosaveObj.data["autosave"] && type == 'editor') {
                    softAlert("자동저장 켜짐");
                    const intervalId = setInterval(() => {
                      update();
                    }, 120 * 1000);
                    autosaveObj.write("intervalId", intervalId);
                  } else {
                    softAlert("자동저장 꺼짐");
                    clearInterval(autosaveObj.data["intervalId"]);
                  }
                })}
              />
              <br />
              <span className="info">2분마다 저장, 키가 저장되야 합니다</span>
            </div>
            <form method="dialog">
              <button>취소</button>
            </form>
          </dialog>
          <dialog ref={settingFormRefs.settingForm} className="setting-form">
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
                  onChange={settingsObj.handle("name")}
                  required
                />
              </div>
              <div className="editable">
                <span>다른사람의 편집허용</span>
                <input
                  type="checkbox"
                  ref={settingFormRefs.editable}
                  onChange={settingsObj.handle("editable")}
                />
              </div>
              <div className="publice">
                <span>패스워드없이 공개</span>
                <input
                  type="checkbox"
                  ref={settingFormRefs.public}
                  onChange={settingsObj.handle("public")}
                />
              </div>
              <hr />
              <div className="password-reset">
                <button onClick={resetPassword}>패스워드 변경</button>
                <input
                  type="text"
                  placeholder="최대 20자"
                  ref={settingFormRefs.newPassword}
                  onChange={settingsObj.handle("newPassword")}
                  maxLength={20}
                  required
                />
              </div>
              <span className="delete-info">삭제는 더블클릭</span>
              <div className="buttons">
                <button onClick={saveSettings}>변경 저장</button>
                <button onClick={closeSettingForm}>닫기</button>
                <button
                  onDoubleClick={deleteDocument}
                  className="delete-button"
                >
                  삭제
                </button>
              </div>
            </div>
          </dialog>
        </div>
      ) : (
        // 비회원 유저가 초대링크와 같은 경로로 접속했을 경우,
        // 해당 문서의 비밀번호 입력을 통해 접근 권한 확인
        <div className="passInputWrapper">
          <div className="pass-input">
            <div className="pass-input__container">
              문서 비밀번호를 입력해 주세요.
              <PassInput
                callback={inputKeyCB}
                placeHorder="password"
                divClass="passinput-main"
                buttonClass="passinput-button"
                inputClass="passinput-input"
                inputRef={passRef}
              />
            </div>
            <div className="info__container">
              {getCookie("username") == "null" ? (
                <p className="info">
                  <span>
                    로그인 하면 한번 입력한 키를 저장해두고 사용가능해요.
                  </span>
                  <br />
                  <a href="/lgpage">로그인 / 회원가입</a>
                </p>
              ) : (
                <p className="info">
                  <span>
                    한번입력한 패스워드는 저장되고 다음에 자동으로 사용되요.
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentView;
