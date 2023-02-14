import axios from "axios";
import { Link } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useState, useEffect } from "react";
import "../../styles/TextEditor.scss";
import ShareButton from "./ShareButton";

const TextEditor = (props) => {
  const { document } = props;
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");

  useEffect(() => {
    console.log("mount");
    // mount시 get-document 값 가져오기
    // getDocument("1", "test11"); //나중에 props로 documentid, documentKey 값 받아온 값으로 교체....  .params.id

    const getDocument = async (documentId, documentKey) => {
      console.log("get-document", documentId, documentKey);
      axios
        .post(
          "http://localhost:8000/main/get-document/",
          {
            documentid: documentId,
            documentkey: documentKey,
          },
          { withCredentials: true }
        )
        .then((res) => {
          console.log("get-document", res.data.result.content);
          // 문서내용 받아온 것 보이도록 설정
          setContents(res.data.result.content);
          // 문서제목 받아오기 보이도록 설정
          setTitle(res.data.result.docName); //docName이 get-document에서 받아오게 설정안돼있어 아직은 못받아옴
          return res.data;
        })
        .catch(function (err) {
          console.log(err);
        });
    };
    // console.log("getDocument:", document.id, document.accessKey);
    getDocument("2", "test11");
  }, []);

  const onChange = async (e) => {
    setTitle(e.target.value);
    // console.log("e.target.value", e.target.value);

    // 타이틀 수정시 PATCH API로 document DB저장
    await axios({
      method: "PATCH",
      url: "http://localhost:8000/main/update-document/",
      data: {
        documentid: "1", //테스트용데이터
        documentkey: "test11", //테스트용데이터
        docName: title,
      },
    })
      .then((res) => {
        console.log("update-document", title, res.data);
        return res.data;
      })
      .catch(function (err) {
        console.log(err);
      });
  };
  return (
    // <Link className="TextEditor" to={"/textEditor/" + document.id}>
    <>
      <input
        className="titleInput"
        onChange={onChange}
        value={title}
        placeholder="제목없는 문서"
      />
      <ShareButton />
      <CKEditor
        editor={ClassicEditor}
        data={contents}
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log("Editor is ready to use!", editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          // console.log({ event, editor, data });
          // 문서 수정시 PATCH API로 document DB저장
          axios({
            method: "PATCH",
            url: "http://localhost:8000/main/update-document/",
            data: {
              documentid: "1", //테스트용데이터
              documentkey: "test11", //테스트용데이터
              content: data,
            },
          })
            .then((res) => {
              console.log("update-document", res.data);
              return res.data;
            })
            .catch(function (err) {
              console.log(err);
            });
        }}
        onBlur={(event, editor) => {
          // console.log("Blur.", editor);
        }}
        onFocus={(event, editor) => {
          // console.log("Focus.", editor);
        }}
      />
    </>
    // </Link>
  );
};

export default TextEditor;
