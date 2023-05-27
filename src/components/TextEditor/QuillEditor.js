import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import Quill from "quill";
import ImageResize from "quill-image-resize";
import "react-quill/dist/quill.snow.css";

//이미지 리사이즈 기능 관련 모듈 추가
Quill.register("modules/ImageResize", ImageResize);

const QuillEditor = (props) => {
  const [content, setContent] = useState(props.data);

  const changeHandler = (value) => {
    setContent(value);
  };

  //텍스트 입력시 focus 감지
  const quillRef = useRef(null);
  const handleFocus = () => {
    props.setIsFocused(true);
  };
  const handleBlur = () => {
    props.setIsFocused(false);
  };

  const toolBar = [
    [
      { font: [] },
      { size: [] },
      { color: [] },
      { list: "ordered" },
      { list: "bullet" },
    ],
    [
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "link",
      "image",
      { align: [] },
      { indent: "+1" },
    ],
  ];

  const modules = {
    // 툴바
    toolbar: toolBar,
    // 이미지 사이즈 재조정
    ImageResize: {
      parchment: Quill.import("parchment"),
    },
    // 클립보드
    clipboard: {
      matchVisual: false, 
      //false -> 텍스트 붙여넣기시 일반텍스트로 붙여넣기됨(서식적용 X)
    },
  };

  // 툴바에서 사용가능한 기능들
  const formats = [
    "font",
    "size",
    "color",
    "",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "indent",
    "align",
  ];
  
  useEffect(() => {
    const editorDiv = document.querySelector(".quill .ql-editor");
    editorDiv.innerHTML=content
  
  }, [])

  return (
    <div>
      <ReactQuill
        ref={quillRef}
        value={content}
        onChange={changeHandler}
        modules={modules}
        readOnly={props.type == "reader"}
        formats={formats}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

QuillEditor.defaultProps = {
  data: "",
  contentRef: undefined,
};

export default QuillEditor;
