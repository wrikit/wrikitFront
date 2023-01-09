import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useState, useEffect } from "react";

const TextEditor = () => {
  const [title, setText] = useState("");
  useEffect(() => {
    console.log("⭕ mount!");
    // API: main/create-document/
    axios({
      method: "POST",
      url: "http://localhost:8000/main/create-document/",
      data: {
        name: { title },
        type: "text",
        key: "test", //임시
        editable: true,
        public: true,
      },
    }).catch(function (err) {
      console.log(err);
    });
  }, []);
  const onChange = (e) => {
    setText(e.target.value);
  };
  return (
    <>
      <input onChange={onChange} value={title} placeholder="제목없는 문서" />
      <CKEditor
        editor={ClassicEditor}
        data="<p>여기에 공유할 내용을 작성하세요</p>"
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log("Editor is ready to use!", editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          console.log({ event, editor, data });
          axios({
            method: "PATCH",
            url: "http://localhost:8000/main/update-document/",
            data: {
              documentid: "1", //테스트용데이터
              documentkey: "test11", //테스트용데이터
              content: data,
            },
          }).catch(function (err) {
            console.log(err);
          });
        }}
        onBlur={(event, editor) => {
          console.log("Blur.", editor);
        }}
        onFocus={(event, editor) => {
          console.log("Focus.", editor);
        }}
      />
    </>
  );
};

export default TextEditor;
